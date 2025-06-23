import os
from tempfile import TemporaryDirectory
from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient
from google.adk.tools import google_search
from app.services.pdf_tools import extract_pdf_content, generate_pdf_report, save_pdf_to_db
from app.infrastructure.db import mongodb

class AuditAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        # Register tools for the agent
        self.tools = [
            extract_pdf_content,
            generate_pdf_report,
            google_search,
        ]

    async def run_audit(self, audit_details: dict, audit_type: str = None, mongo_uri: str = None, documents=None, system_logs=None, user_id: str = None, session_id: str = None):
        with TemporaryDirectory() as tmpdir:
            doc_paths = []
            uploaded_pdf_ids = []
            if documents:
                for file in documents:
                    path = os.path.join(tmpdir, file.filename)
                    with open(path, "wb") as f:
                        f.write(await file.read())
                    doc_paths.append(path)
                    # Save uploaded PDF to DB
                    if file.filename.lower().endswith('.pdf'):
                        pdf_id = await save_pdf_to_db(mongodb.db, path, file.filename, metadata={"user_id": user_id, "type": "uploaded"})
                        uploaded_pdf_ids.append(pdf_id)
            log_paths = []
            if system_logs:
                for file in system_logs:
                    path = os.path.join(tmpdir, file.filename)
                    with open(path, "wb") as f:
                        f.write(await file.read())
                    log_paths.append(path)
            mongo_logs = None
            if mongo_uri:
                # Implement actual MongoDB log fetching here
                pass
            # Prepare input for ADK agent
            agent_input = {
                **audit_details,
                "audit_type": audit_type,
                "documents": doc_paths,
                "system_logs": log_paths,
                "mongo_logs": mongo_logs,
            }
            # Run the ADK agent with tools
            adk_result = await self.adk.run_agent(
                agent_name="audit_run",
                data=agent_input,
                user_id=user_id,
                session_id=session_id,
                tools=self.tools
            )
            # Extract score/issues/sections from adk_result
            score = adk_result.get("score") if adk_result else None
            issues = adk_result.get("issues") if adk_result else None
            report_sections = adk_result.get("report_sections") if adk_result else None
            pdf_url = None
            generated_pdf_id = None
            if report_sections or score or issues:
                pdf_path = generate_pdf_report(report_sections, score, issues, output_dir=tmpdir)
                generated_pdf_id = await save_pdf_to_db(mongodb.db, pdf_path, f"audit_report_{user_id}.pdf", metadata={"user_id": user_id, "type": "generated"})
                pdf_url = f"/api/v1/audit/pdf/{generated_pdf_id}"
            return {
                "adk_result": adk_result,
                "score": score,
                "issues": issues,
                "report_sections": report_sections,
                "pdf_url": pdf_url,
                "uploaded_pdf_ids": uploaded_pdf_ids,
                "generated_pdf_id": generated_pdf_id
            }

    async def get_history(self, user_id: str):
        return await self.adk.run_agent("audit_history", {"user_id": user_id}) 