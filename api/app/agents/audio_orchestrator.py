import json
from app.domain.models.media import StartAudioConversationRequest, AudioConversationConfigResponse
from app.core.config import settings

class AudioOrchestrator:
    def __init__(self):
        self.agent_id = settings.ELEVENLABS_AGENT_ID

    def _create_prompt_from_details(self, permit_details: dict) -> str:
        base_prompt = (
            "You are an expert AI assistant for RegOps, a platform that helps users navigate complex regulatory compliance. "
            "You are having a real-time audio conversation with a user about their permit application. "
            "Your goal is to answer their questions clearly and concisely based on the following permit data. "
            "Do not make up information you don't have. Be polite and professional.\n\n"
            "Here is the permit information:\n"
        )
        details_json = json.dumps(permit_details, indent=2)
        return f"{base_prompt}{details_json}"

    def generate_config(self, request: StartAudioConversationRequest) -> AudioConversationConfigResponse:
        prompt = self._create_prompt_from_details(request.permit_details)
        
        return AudioConversationConfigResponse(
            agent_id=self.agent_id,
            prompt=prompt
        ) 