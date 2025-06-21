from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient

class PermitAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk

    async def analyze_requirements(self, project_details: dict):
        adk_result = await self.adk.run_agent("permit_analysis", project_details)
        llm_result = await self.vertex_ai.analyze(str(project_details))
        return {
            "adk_result": adk_result,
            "llm_result": llm_result
        }

    async def generate_submission(self, permit_data: dict):
        return await self.adk.run_agent("permit_submission", permit_data) 