import json
import re
import os
from typing import List, Dict, Any
from app.services.adk import ADKClient
from app.services.vertex_ai import VertexAIClient

class SynthesizerAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        dir_path = os.path.dirname(os.path.realpath(__file__))
        prompt_path = os.path.join(dir_path, '..', 'prompts', 'synthesizer_prompt.txt')
        with open(prompt_path, 'r') as f:
            return f.read()

    async def synthesize_explanation(self, query: str, findings: List[Dict[str, Any]], user_id: str, session_id: str) -> str:
        prompt = self.prompt_template.format(
            user_query=query,
            research_findings=json.dumps(findings, indent=2)
        )
        instruction = "Synthesize the research findings into a single, clear answer to the user's original question."
        
        adk_result = await self.adk.run_agent(
            agent_name="synthesizer",
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
                return json.loads(json_str).get("explanation", "Could not synthesize an explanation.")
            except json.JSONDecodeError:
                return "Error: Could not parse the synthesized explanation."
        
        return "An unknown error occurred during synthesis." 