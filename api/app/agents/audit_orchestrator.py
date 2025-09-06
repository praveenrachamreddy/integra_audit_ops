import asyncio
import os
from typing import List, Dict, Any, Optional
from tempfile import TemporaryDirectory
from fastapi import UploadFile

from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient
from app.services.pdf_tools import save_pdf_stream_to_db, save_pdf_file_to_db, generate_pdf_report
from app.infrastructure.db import mongodb
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from app.agents.sub_agents.compliance_scanner import ComplianceScannerAgent
from app.agents.sub_agents.remediation_suggestor import RemediationSuggestorAgent
from app.agents.sub_agents.report_generator import ReportGeneratorAgent

class AuditOrchestrator:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        # Instantiate the sub-agents
        self.scanner = ComplianceScannerAgent(vertex_ai, adk)
        self.remediator = RemediationSuggestorAgent(vertex_ai, adk)
        self.reporter = ReportGeneratorAgent()

    async def _remediate_issue(self, issue: Dict[str, Any], user_id: str, session_id: str) -> Dict[str, Any]:
        """Helper coroutine to get a recommendation for a single issue."""
        recommendation = await self.remediator.get_recommendation(issue, user_id, session_id)
        issue['recommendation'] = recommendation
        return issue

    async def run_audit(self, audit_type: str, company_name: str, audit_scope: str, control_families: list, documents: List[UploadFile], user_id: str, session_id: str, project_id: Optional[str] = None):
        # 1. Stream files to GridFS and get their unique IDs
        upload_tasks = [save_pdf_stream_to_db(mongodb.db, doc.file, doc.filename, {"user_id": user_id, "type": "uploaded"}) for doc in documents]
        doc_ids = await asyncio.gather(*upload_tasks)

        # 2. Concurrently fan-out remediation tasks as issues are streamed from the scanner
        remediation_tasks = []
        async for issue in self.scanner.stream_issues(audit_type, company_name, audit_scope, control_families, doc_ids, user_id, session_id, project_id):
            if "error" not in issue:
                # Create a task for each issue and add it to the list
                task = asyncio.create_task(self._remediate_issue(issue, user_id, session_id))
                remediation_tasks.append(task)
        
        # 3. Aggregate results once all remediation tasks are complete
        if not remediation_tasks:
            # Handle case where no issues were found
            enriched_issues = []
        else:
            enriched_issues = await asyncio.gather(*remediation_tasks)

        # 4. Perform final sequential steps: scoring and report section generation
        severity_weights = {
            "High": 30,
            "Medium": 10,
            "Low": 5
        }
        
        score = 100
        for issue in enriched_issues:
            severity = issue.get("severity", "Low") 
            score -= severity_weights.get(severity, 5)

        score = max(0, score)
        
        # Determine overall severity for report coloring
        severities = {issue.get("severity") for issue in enriched_issues}
        if "High" in severities:
            overall_severity = "High"
        elif "Medium" in severities:
            overall_severity = "Medium"
        elif "Low" in severities:
            overall_severity = "Low"
        else:
            overall_severity = "None"

        report_sections = []
        for issue in enriched_issues:
            report_sections.append({
                "title": f"Issue: {issue.get('description', 'N/A')}",
                "content": f"Severity: {issue.get('severity', 'N/A')}\n\nRecommendation: {issue.get('recommendation', 'N/A')}",
                "flagged": True
            })
        if not enriched_issues:
            report_sections.append({
                "title": "No Compliance Issues Found",
                "content": "Based on the provided documents and control families, no compliance gaps were identified.",
                "flagged": False
            })

        # 5. Generate and save the final PDF report
        pdf_url = None
        with TemporaryDirectory() as tmpdir:
            pdf_path = self.reporter.create_pdf_report(
                score=score, 
                issues=enriched_issues, 
                sections=report_sections, 
                overall_severity=overall_severity,
                output_dir=tmpdir
            )
            pdf_id = await save_pdf_file_to_db(
                mongodb.db,
                pdf_path,
                f"audit_report_{user_id}.pdf",
                metadata={
                    "user_id": str(user_id), 
                    "type": "generated",
                    "score": score,
                    "company_name": company_name,
                    "project_id": project_id
                }
            )
            pdf_url = f"/api/v1/audit/pdf/{pdf_id}"
        
        return {
            "score": score,
            "issues": enriched_issues,
            "report_sections": report_sections,
            "pdf_url": pdf_url,
        }

    async def get_history(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves a list of all past audit reports for a given user.
        """
        fs = AsyncIOMotorGridFSBucket(mongodb.db)
        # Find all files generated by this user. Query user_id as a string for consistency.
        cursor = fs.find({
            "metadata.user_id": str(user_id),
            "metadata.type": "generated"
        }).sort("uploadDate", -1) # Sort by most recent first

        history_items = []
        for doc in await cursor.to_list(length=None):
            # Correctly access all data using dictionary keys, not attributes.
            metadata = doc.get("metadata", {})
            history_items.append({
                "audit_id": str(doc.get("_id")),
                "company_name": metadata.get("company_name", "N/A"),
                "run_date": doc.get("uploadDate").strftime("%Y-%m-%d %H:%M:%S"),
                "score": metadata.get("score", "N/A"),
                "pdf_url": f"/api/v1/audit/pdf/{doc.get('_id')}",
                "project_id": metadata.get("project_id")
            })
        return history_items 