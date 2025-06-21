from fastapi import APIRouter, Depends
from app.domain.models.permit_agent import (
    PermitSuggestRequest, PermitSuggestResponse,
    PermitSubmissionRequest, PermitSubmissionResponse
)
from app.agents.permit_agent import PermitAgent
from app.services.vertex_ai import VertexAIClient
from app.services.adk import ADKClient
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def get_permit_agent():
    vertex_ai = VertexAIClient()
    adk = ADKClient()
    return PermitAgent(vertex_ai, adk)

@router.post("/suggest", response_model=PermitSuggestResponse)
async def suggest_permit(
    request: PermitSuggestRequest,
    agent: PermitAgent = Depends(get_permit_agent),
    current_user=Depends(get_current_user)
):
    result = await agent.analyze_requirements(request.project_details)
    return PermitSuggestResponse(
        requirements=result["llm_result"],
        adk_result=result["adk_result"],
        llm_result=result["llm_result"]
    )

@router.post("/submit", response_model=PermitSubmissionResponse)
async def submit_permit(
    request: PermitSubmissionRequest,
    agent: PermitAgent = Depends(get_permit_agent),
    current_user=Depends(get_current_user)
):
    submission = await agent.generate_submission(request.permit_data)
    return PermitSubmissionResponse(submission=submission) 