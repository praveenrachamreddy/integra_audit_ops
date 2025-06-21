from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient

class ExplanationAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk

    async def explain(self, query: dict):
        adk_result = await self.adk.run_agent("explanation", query)
        llm_result = await self.vertex_ai.analyze(str(query))
        return {
            "adk_result": adk_result,
            "llm_result": llm_result
        } 