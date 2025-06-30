import json
import os
from app.domain.models.media import StartAudioConversationRequest, AudioConversationConfigResponse
from app.core.config import settings

PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompts", "media_context_prompt.txt")

class AudioOrchestrator:
    def __init__(self):
        self.agent_id = settings.ELEVENLABS_AGENT_ID
        self.base_prompt = self._load_base_prompt()

    def _load_base_prompt(self) -> str:
        try:
            with open(PROMPT_PATH, "r") as f:
                return f.read()
        except FileNotFoundError:
            return "You are a helpful assistant."

    def _create_full_prompt(self, permit_details: dict) -> str:
        details_json = json.dumps(permit_details, indent=2)
        return f"{self.base_prompt}\n{details_json}"

    def generate_config(self, request: StartAudioConversationRequest) -> AudioConversationConfigResponse:
        return AudioConversationConfigResponse(
            agent_id=self.agent_id,
            system_prompt=self.base_prompt,
            context=request.permit_details
        ) 