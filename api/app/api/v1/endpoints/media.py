from fastapi import APIRouter, Depends, HTTPException
from app.agents.video_orchestrator import VideoOrchestrator
from app.agents.audio_orchestrator import AudioOrchestrator
from app.api.v1.endpoints.auth import get_current_user
from app.domain.models.media import (
    StartVideoConversationRequest, 
    VideoConversationResponse,
    StartAudioConversationRequest,
    AudioConversationConfigResponse
)

router = APIRouter()

@router.post("/video/start_conversation", response_model=VideoConversationResponse)
async def start_video_conversation(
    request: StartVideoConversationRequest,
    orchestrator: VideoOrchestrator = Depends(VideoOrchestrator),
    user: dict = Depends(get_current_user)
):
    try:
        response = await orchestrator.start_conversation(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/audio/start_conversation", response_model=AudioConversationConfigResponse)
def get_audio_conversation_config(
    request: StartAudioConversationRequest,
    orchestrator: AudioOrchestrator = Depends(AudioOrchestrator),
    user: dict = Depends(get_current_user)
):
    try:
        response = orchestrator.generate_config(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 