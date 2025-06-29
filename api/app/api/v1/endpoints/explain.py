from fastapi import APIRouter, Depends, Header, HTTPException
from typing import Optional
from app.api.v1.endpoints.auth import get_current_user
from app.agents.explanation_orchestrator import ExplanationOrchestrator
from app.domain.models.explanation_orchestrator import ExplanationRequest, ExplanationResponse

router = APIRouter()

@router.post("/", response_model=ExplanationResponse)
async def get_explanation(
    request: ExplanationRequest,
    user: dict = Depends(get_current_user),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """
    Accepts a user's query and returns a synthesized explanation based on research.
    """
    from app.main import adk, vertex_ai # Lazy import to avoid circular dependency
    
    user_id = user.id
    session_id = x_session_id or "default_session"
    
    orchestrator = ExplanationOrchestrator(vertex_ai, adk)
    
    try:
        result = await orchestrator.get_explanation(
            query=request.query,
            user_id=user_id,
            session_id=session_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}") 