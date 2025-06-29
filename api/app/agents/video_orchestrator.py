import json
from app.services.tavus_service import TavusClient
from app.domain.models.media import StartVideoConversationRequest, VideoConversationResponse
from app.core.config import settings

class VideoOrchestrator:
    def __init__(self):
        self.tavus_client = TavusClient()
        self.replica_id = settings.TAVUS_REPLICA_ID

    def _create_context_from_details(self, permit_details: dict) -> str:
        base_prompt = (
            "You are an expert AI assistant for RegOps, a platform that helps users navigate complex regulatory compliance. "
            "You are having a real-time conversation with a user about their permit application. "
            "Your goal is to answer their questions clearly and concisely based on the following permit data. "
            "Do not make up information you don't have. Be polite and professional.\n\n"
            "Here is the permit information:\n"
        )
        details_json = json.dumps(permit_details, indent=2)
        return f"{base_prompt}{details_json}"

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