from fastapi import APIRouter, Depends, HTTPException, Body, Header
from typing import Annotated, Dict, Any, Optional
from app.api.v1.endpoints.auth import get_current_user
from app.agents.permit_orchestrator import PermitOrchestrator
from app.domain.models.permit_orchestrator import PermitAnalysisRequest, PermitAnalysisResponse

router = APIRouter()

@router.post("/analyze_permit", response_model=PermitAnalysisResponse)
async def analyze_permit(
    request: PermitAnalysisRequest,
    user: dict = Depends(get_current_user),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """
    Analyzes a project description and location to determine permit requirements.
    """
    from app.main import adk, vertex_ai # Lazy import to avoid circular dependency
    
    user_id = user["sub"]
    session_id = x_session_id or "default_session"
    
    orchestrator = PermitOrchestrator(vertex_ai, adk)
    
    try:
        result = await orchestrator.analyze_permit_request(
            project_description=request.project_description,
            location=request.location,
            user_id=user_id,
            session_id=session_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 