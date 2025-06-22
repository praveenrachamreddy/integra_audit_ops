from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from app.core.config import settings
from google.genai.types import Content, Part
from app.infrastructure.logger import Logger

logger = Logger(__name__)

class ADKClient:
    def __init__(self):
        self.model = settings.ADK_MODEL_NAME
        self.app_name = settings.GCP_PROJECT_NAME  # Use a constant or config value
        self.session_service = InMemorySessionService()

    async def ensure_session(self, user_id: str, session_id: str):
        # Try to get the session, if not found, create it
        try:
            session = await self.session_service.get_session(
                app_name=self.app_name,
                user_id=user_id,
                session_id=session_id
            )
        except Exception:
            session = await self.session_service.create_session(
                app_name=self.app_name,
                user_id=user_id,
                session_id=session_id
            )
        return session

    async def run_agent(self, agent_name: str, data: dict, user_id: str, session_id: str) -> dict:
        await self.ensure_session(user_id, session_id)
        agent = LlmAgent(
            name=agent_name,
            model=self.model,
            instruction="You are a helpful assistant.",
            tools=[google_search],
        )
        # Support both dict and Pydantic model
        prompt = getattr(data, "prompt", None)
        if prompt is None and isinstance(data, dict):
            prompt = data.get("prompt")
        if prompt is None:
            prompt = str(data)
        # Ensure prompt is always a string
        prompt = str(prompt)
        logger.data({"prompt": prompt})
        content = Content(role="user", parts=[Part(text=prompt)])
        runner = Runner(agent=agent, app_name=self.app_name, session_service=self.session_service)
        events = runner.run(
            user_id=user_id,
            session_id=session_id,
            new_message=content
        )
        final_response = None
        for event in events:
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        final_response = part.text
        return {"result": final_response} 