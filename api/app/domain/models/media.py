from pydantic import BaseModel
from typing import Dict, Any

class StartVideoConversationRequest(BaseModel):
    permit_details: Dict[str, Any]

class VideoConversationResponse(BaseModel):
    conversation_url: str

class StartAudioConversationRequest(BaseModel):
    permit_details: Dict[str, Any]

class AudioConversationConfigResponse(BaseModel):
    agent_id: str
    prompt: str 