import json
import re
import os
from typing import List, Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient

class QueryDeconstructorAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        dir_path = os.path.dirname(os.path.realpath(__file__))
        prompt_path = os.path.join(dir_path, '..', 'prompts', 'query_deconstructor_prompt.txt')
        with open(prompt_path, 'r') as f:
            return f.read()

    async def deconstruct_query(self, query: str, user_id: str, session_id: str) -> List[str]:
        prompt = self.prompt_template.format(user_query=query)
        instruction = "Deconstruct the user's complex query into a list of simple, researchable questions."
        
        adk_result = await self.adk.run_agent(
            agent_name="query_deconstructor",
            data={"prompt": prompt},
            instruction=instruction,
            user_id=user_id,
            session_id=session_id
        )

        if adk_result and adk_result.get("result"):
            raw_response = adk_result.get("result")
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw_response, re.DOTALL)
            json_str = json_match.group(1) if json_match else raw_response
            try:
                return json.loads(json_str).get("sub_questions", [])
            except json.JSONDecodeError:
                return []
        
        return [] 