import os
import json
import re
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
        ]

    def _load_prompt_template(self) -> str:
        """Loads the prompt template from the file system."""
        try:
            dir_path = os.path.dirname(os.path.realpath(__file__))
            prompt_path = os.path.join(dir_path, 'prompts', 'audit_analyst_prompt.txt')
            with open(prompt_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            # Fallback or error handling
            return "Error: Prompt template not found."

    async def run_audit(self, audit_details: dict, audit_type: str = None, mongo_uri: str = None, documents=None, user_id: str = None, session_id: str = None):
        with TemporaryDirectory() as tmpdir:
            doc_paths = []
            uploaded_pdf_ids = []
            if documents:
                for file in documents:
                    path = os.path.join(tmpdir, file.filename)
                    with open(path, "wb") as f:
                        f.write(await file.read())
                    doc_paths.append(path)
                    if file.filename.lower().endswith('.pdf'):
                        pdf_id = await save_pdf_to_db(mongodb.db, path, file.filename, metadata={"user_id": user_id, "type": "uploaded"})
                        uploaded_pdf_ids.append(str(pdf_id))
            
            # 1. Load and format the prompt from the template file
            prompt_template = self._load_prompt_template()
            prompt = prompt_template.format(
                audit_type=audit_type,
                company_name=audit_details.get('company_name', 'N/A'),
                audit_scope=audit_details.get('audit_scope', 'N/A'),
                control_families=audit_details.get('control_families', []),
                doc_paths=doc_paths
            )

            agent_input = {"prompt": prompt}
            instruction = "You are an AI Compliance Analyst executing a specific task. Follow the user's prompt exactly and return only the requested JSON object."

            # 2. Run the ADK agent with the new prompt and instruction
            adk_result = await self.adk.run_agent(
                agent_name="audit_run",
                data=agent_input,
                instruction=instruction,
                user_id=user_id,
                session_id=session_id,
                tools=self.tools
            )

            # 3. Parse the structured JSON from the LLM's text response
            final_json_result = {}
            if adk_result and adk_result.get("result"):
                raw_response = adk_result.get("result")
                # Use regex to find the JSON block, robustly handling markdown backticks
                json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw_response, re.DOTALL)
                json_str = json_match.group(1) if json_match else raw_response
                try:
                    final_json_result = json.loads(json_str)
                except json.JSONDecodeError:
                    final_json_result = {"error": "Failed to parse JSON from LLM response", "raw_response": raw_response}

            score = final_json_result.get("score")
            issues = final_json_result.get("issues")
            report_sections = final_json_result.get("report_sections")
            
            # 4. Generate PDF report from the structured data
            pdf_url = None
            generated_pdf_id = None
            if report_sections or score or issues:
                pdf_path = generate_pdf_report(report_sections, score, issues, output_dir=tmpdir)
                generated_pdf_id = await save_pdf_to_db(mongodb.db, pdf_path, f"audit_report_{user_id}.pdf", metadata={"user_id": user_id, "type": "generated"})
                pdf_url = f"/api/v1/audit/pdf/{generated_pdf_id}"

            return {
                "adk_result": adk_result,
                "llm_result": final_json_result,
                "score": score,
                "issues": issues,
                "report_sections": report_sections,
                "pdf_url": pdf_url,
                "uploaded_pdf_ids": uploaded_pdf_ids,
                "generated_pdf_id": str(generated_pdf_id) if generated_pdf_id else None
            }

    async def get_history(self, user_id: str):
        return await self.adk.run_agent("audit_history", {"user_id": user_id}) 