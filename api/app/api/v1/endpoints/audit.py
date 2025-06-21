from fastapi import APIRouter, Depends
from app.domain.models.audit_agent import (
    AuditRunRequest, AuditRunResponse,
    AuditHistoryRequest, AuditHistoryResponse
)
from app.agents.audit_agent import AuditAgent
from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient

router = APIRouter()

def get_audit_agent():
    vertex_ai = VertexAIClient()
    adk = ADKClient()
    return AuditAgent(vertex_ai, adk)

@router.post("/run", response_model=AuditRunResponse)
async def run_audit(
    request: AuditRunRequest,
    agent: AuditAgent = Depends(get_audit_agent)
):
    result = await agent.run_audit(request.audit_details)
    return AuditRunResponse(
        adk_result=result["adk_result"],
        llm_result=result["llm_result"]
    )

@router.get("/history", response_model=AuditHistoryResponse)
async def get_audit_history(
    user_id: str,
    agent: AuditAgent = Depends(get_audit_agent)
):
    history = await agent.get_history(user_id)
    return AuditHistoryResponse(history=history) 