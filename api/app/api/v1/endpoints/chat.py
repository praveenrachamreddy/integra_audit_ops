from fastapi import APIRouter, Depends
from app.domain.models.explanation_agent import (
    ExplanationRequest, ExplanationResponse
)
from app.agents.explanation_agent import ExplanationAgent
from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def get_explanation_agent():
    vertex_ai = VertexAIClient()
    adk = ADKClient()
    return ExplanationAgent(vertex_ai, adk)

@router.post("/message", response_model=ExplanationResponse)
async def explain_message(
    request: ExplanationRequest,
    agent: ExplanationAgent = Depends(get_explanation_agent),
    current_user=Depends(get_current_user)
):
    result = await agent.explain(request.query)
    return ExplanationResponse(
        adk_result=result["adk_result"],
        llm_result=result["llm_result"]
    ) 