from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient

class AuditAgent:
    def __init__(self, vertex_ai: VertexAIClient, adk: ADKClient):
        self.vertex_ai = vertex_ai
        self.adk = adk

    async def run_audit(self, audit_details: dict):
        adk_result = await self.adk.run_agent("audit_run", audit_details)
        llm_result = await self.vertex_ai.analyze(str(audit_details))
        return {
            "adk_result": adk_result,
            "llm_result": llm_result
        }

    async def get_history(self, user_id: str):
        return await self.adk.run_agent("audit_history", {"user_id": user_id}) 