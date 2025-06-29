import httpx
from app.core.config import settings

class TavusClient:
    def __init__(self):
        self.api_key = settings.TAVUS_API_KEY
        self.base_url = "https://tavusapi.com/v2"

    async def create_conversation(self, context: str, replica_id: str, greeting: str = None) -> str:
        url = f"{self.base_url}/conversations"
        headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "replica_id": replica_id,
            "conversational_context": context,
        }

        if greeting:
            payload["custom_greeting"] = greeting
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                return data.get("conversation_url")
            except httpx.HTTPStatusError as e:
                # Log the error and re-raise or handle it
                print(f"Error creating Tavus conversation: {e.response.text}")
                raise
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
                raise 