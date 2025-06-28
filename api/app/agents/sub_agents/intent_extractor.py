import json
import re
import os
from typing import Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient

# Placeholder for IntentExtractorAgent
class IntentExtractorAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        try:
            dir_path = os.path.dirname(os.path.realpath(__file__))
            prompt_path = os.path.join(dir_path, '..', 'prompts', 'intent_extractor_prompt.txt')
            with open(prompt_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return "Error: Intent extractor prompt template not found."

    async def extract_intent(self, project_description: str, user_id: str, session_id: str) -> Dict[str, Any]:
        if "Error" in self.prompt_template:
            return {"error": self.prompt_template}

        prompt = self.prompt_template.format(project_description=project_description)
        agent_input = {"prompt": prompt}
        instruction = "You are an AI assistant that extracts structured data from user descriptions."

        adk_result = await self.adk.run_agent(
            agent_name="intent_extractor",
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
                return json.loads(json_str)
            except json.JSONDecodeError:
                return {"error": "Failed to parse JSON from intent extractor", "raw_response": raw_response}
        
        return {"error": "No result from ADK agent"}
