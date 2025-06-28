import asyncio
import json
import re
import os
from typing import AsyncGenerator, Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient
from app.services.pdf_tools import extract_pdf_content
from app.infrastructure.db import mongodb
from bson import ObjectId

class ComplianceScannerAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        
        # Define a simple wrapper function that the ADK can easily parse.
        # This function takes a string, converts it to an ObjectId, and then calls the real logic.
        # This hides the complex `ObjectId` type from the ADK's automatic tool parser.
        def get_document_content(file_id: str) -> str:
            """
            Retrieves the text content of a document given its file ID.
            Use this tool to read the documents provided to you to find compliance issues.
            """
            # Note: This is a synchronous wrapper for an async function.
            # The ADK handles the async invocation.
            return extract_pdf_content(mongodb.db, ObjectId(file_id))

        self.tools = [get_document_content]
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        """Loads the prompt template from the file system."""
        try:
            # Navigate from 'sub_agents' up to 'agents' and then down to 'prompts'
            dir_path = os.path.dirname(os.path.realpath(__file__))
            prompt_path = os.path.join(dir_path, '..', 'prompts', 'compliance_scanner_prompt.txt')
            with open(prompt_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return "Error: Scanner prompt template not found."

    async def stream_issues(
        self,
        audit_type: str,
        company_name: str,
        audit_scope: str,
        control_families: list,
        doc_ids: list,
        user_id: str,
        session_id: str
    ) -> AsyncGenerator[Dict[str, Any], None]:
        
        if "Error" in self.prompt_template:
            yield {"error": self.prompt_template}
            return

        prompt = self.prompt_template.format(
            audit_type=audit_type,
            company_name=company_name,
            audit_scope=audit_scope,
            control_families=control_families,
            doc_ids=[str(doc_id) for doc_id in doc_ids]
        )
        
        agent_input = {"prompt": prompt}
        instruction = "You are an AI Compliance Analyst. Follow the prompt and return only the requested JSON."

        adk_result = await self.adk.run_agent(
            agent_name="compliance_scanner",
            data=agent_input,
            instruction=instruction,
            user_id=user_id,
            session_id=session_id,
            tools=self.tools
        )

        if adk_result and adk_result.get("result"):
            raw_response = adk_result.get("result")
            # Use regex to robustly find the JSON block, even with markdown backticks
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw_response, re.DOTALL)
            json_str = json_match.group(1) if json_match else raw_response
            
            try:
                parsed_json = json.loads(json_str)
                issues = parsed_json.get("issues", [])
                for issue in issues:
                    yield issue
            except json.JSONDecodeError:
                yield {"error": "Failed to parse JSON from scanner", "raw_response": raw_response}
        else:
            yield {"error": "No result from ADK agent"}
