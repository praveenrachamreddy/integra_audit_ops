from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient

class PermitAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk

    async def analyze_requirements(self, project_details: dict, user_id: str, session_id: str):
        # Only use the LLM for /suggest
        llm_result = await self.vertex_ai.analyze(project_details.prompt)
        return {
            "adk_result": {},  # Return an empty dict instead of None
            "llm_result": llm_result
        }

    async def generate_submission(self, permit_data: dict, user_id: str, session_id: str):
        return await self.adk.run_agent("permit_submission", permit_data, user_id, session_id) 