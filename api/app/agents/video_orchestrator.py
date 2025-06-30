import json
import os
from app.services.tavus_service import TavusClient
from app.domain.models.media import StartVideoConversationRequest, VideoConversationResponse
from app.core.config import settings

PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompts", "media_context_prompt.txt")

class VideoOrchestrator:
    def __init__(self):
        self.tavus_client = TavusClient()
        self.replica_id = settings.TAVUS_REPLICA_ID
        self.base_prompt = self._load_base_prompt()

    def _load_base_prompt(self) -> str:
        try:
            with open(PROMPT_PATH, "r") as f:
                return f.read()
        except FileNotFoundError:
            # Fallback or error logging
            return "You are a helpful assistant."

    def _create_context_from_details(self, permit_details: dict) -> str:
        details_json = json.dumps(permit_details, indent=2)
        return f"{self.base_prompt}\n{details_json}"

    async def start_conversation(self, request: StartVideoConversationRequest) -> VideoConversationResponse:
        context = self._create_context_from_details(request.permit_details)
        greeting = "Hello! I am your RegOps AI assistant. I have reviewed your permit details and am ready to discuss them with you. What would you like to know?"
        
        conversation_url = await self.tavus_client.create_conversation(
            context=context,
            replica_id=self.replica_id,
            greeting=greeting
        )

        if not conversation_url:
            # Handle error case where URL is not returned
            raise Exception("Failed to retrieve conversation URL from Tavus.")

        return VideoConversationResponse(conversation_url=conversation_url) 