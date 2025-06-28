import asyncio
import json
import re
import os
from typing import Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient

class RemediationSuggestorAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        """Loads the prompt template from the file system."""
        try:
            dir_path = os.path.dirname(os.path.realpath(__file__))
            prompt_path = os.path.join(dir_path, '..', 'prompts', 'remediation_suggestor_prompt.txt')
            with open(prompt_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return "Error: Remediator prompt template not found."

    async def get_recommendation(
        self,
        issue: Dict[str, Any],
        user_id: str,
        session_id: str
    ) -> str:
        
        if "Error" in self.prompt_template:
            return f"Error loading prompt: {self.prompt_template}"

        prompt = self.prompt_template.format(
            severity=issue.get("severity", "N/A"),
            description=issue.get("description", "N/A")
        )
        
        agent_input = {"prompt": prompt}
        instruction = "You are an AI Remediation Specialist. Follow the prompt and return only the requested JSON."

        adk_result = await self.adk.run_agent(
            agent_name="remediation_suggestor",
            data=agent_input,
            instruction=instruction,
            user_id=user_id,
            session_id=session_id
        )

        if adk_result and adk_result.get("result"):
            raw_response = adk_result.get("result")
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw_response, re.DOTALL)
            json_str = json_match.group(1) if json_match else raw_response
            
            try:
                # The agent returns a dict like {"recommendation": "..."}
                return json.loads(json_str).get("recommendation", "Failed to extract recommendation.")
            except json.JSONDecodeError:
                return f"Error parsing remediation JSON: {raw_response}"
        
        return "No recommendation received from ADK agent."
