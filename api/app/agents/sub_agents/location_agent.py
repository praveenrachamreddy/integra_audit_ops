import json
import re
import os
from typing import Dict, Any, List
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient
from google.adk.tools import google_search

class LocationAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        self.prompt_template = self._load_prompt_template()
        self.tools = [google_search]

    def _load_prompt_template(self) -> str:
        try:
            dir_path = os.path.dirname(os.path.realpath(__file__))
            prompt_path = os.path.join(dir_path, '..', 'prompts', 'location_agent_prompt.txt')
            with open(prompt_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return "Error: Location agent prompt template not found."

    async def get_regional_rules(self, project_summary: Dict[str, Any], location: str, user_id: str, session_id: str) -> List[Dict[str, Any]]:
        if "Error" in self.prompt_template:
            return [{"error": self.prompt_template}]

        prompt = self.prompt_template.format(
            project_summary=json.dumps(project_summary, indent=2),
            location=location
        )
        agent_input = {"prompt": prompt}
        instruction = "You are an AI Location Specialist. You must use your search tool to find official government websites."

        adk_result = await self.adk.run_agent(
            agent_name="location_agent",
            data=agent_input,
            instruction=instruction,
            user_id=user_id,
            session_id=session_id,
            tools=self.tools
        )

        if adk_result and adk_result.get("result"):
            raw_response = adk_result.get("result")
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw_response, re.DOTALL)
            json_str = json_match.group(1) if json_match else raw_response
            try:
                return json.loads(json_str).get("region_specific_rules", [])
            except json.JSONDecodeError:
                return [{"error": "Failed to parse JSON from location agent", "raw_response": raw_response}]
        
        return [{"error": "No result from ADK agent"}]
