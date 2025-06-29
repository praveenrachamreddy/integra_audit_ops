import json
import re
import os
import asyncio
from typing import List, Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient
from google.adk.tools import google_search

class RegulationFinderAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        self.prompt_template = self._load_prompt_template()
        self.tools = [google_search]

    def _load_prompt_template(self) -> str:
        dir_path = os.path.dirname(os.path.realpath(__file__))
        prompt_path = os.path.join(dir_path, '..', 'prompts', 'regulation_finder_prompt.txt')
        with open(prompt_path, 'r') as f:
            return f.read()

    async def find_regulations(self, sub_questions: List[str], user_id: str, session_id: str) -> List[Dict[str, Any]]:
        # This agent benefits from running searches in parallel for each sub-question.
        prompt = self.prompt_template.format(sub_questions="\n- ".join(sub_questions))
        instruction = "For each question, perform a targeted web search using the provided tools and return the findings."
        
        adk_result = await self.adk.run_agent(
            agent_name="regulation_finder",
            data={"prompt": prompt},
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
                return json.loads(json_str).get("results", [])
            except json.JSONDecodeError:
                return []
        
        return [] 