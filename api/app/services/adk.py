import asyncio
import google.generativeai as genai
from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from app.core.config import settings
from google.genai.types import Content, Part
from app.infrastructure.logger import Logger
from google.genai import Client

logger = Logger(__name__)

class ADKClient:
    """
    ADKClient manages agent and session lifecycle for ADK/Vertex AI integration.
    - The LlmAgent is initialized with the model string (from settings).
    - Vertex AI credentials, project, and location are picked up from environment/config.
    - No need to inject a GenAI client directly; ADK handles backend selection.
    """
    def __init__(self):
        self.model = settings.ADK_MODEL_NAME
        self.app_name = settings.GCP_PROJECT_NAME
        self.session_service = InMemorySessionService()
        
        # Configure Gemini API if not using Vertex AI
        if not settings.GOOGLE_GENAI_USE_VERTEX and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel(settings.ADK_MODEL_NAME)
        else:
            self.gemini_model = None

    async def ensure_session(self, user_id: str, session_id: str):
        session = await self.session_service.create_session(
            app_name=self.app_name,
            user_id=user_id,
            session_id=session_id
        )
        return session

    async def run_agent(self, agent_name: str, data: dict, user_id: str, session_id: str, tools: list = None, instruction: str = None) -> dict:
        # If using Gemini API directly (not Vertex AI), use it instead
        if self.gemini_model and not settings.GOOGLE_GENAI_USE_VERTEX:
            # Use provided instruction or a default one
            agent_instruction = instruction if instruction is not None else "You are a helpful assistant."

            prompt = getattr(data, "prompt", None)
            if prompt is None and isinstance(data, dict):
                prompt = data.get("prompt")
            if prompt is None:
                prompt = str(data)
            
            try:
                full_prompt = f"{agent_instruction}\n\n{prompt}"
                response = self.gemini_model.generate_content(full_prompt)
                return {"result": response.text}
            except Exception as e:
                logger.error(f"Gemini API error: {str(e)}")
                # Fall back to ADK if Gemini fails
        
        # Ensure session asynchronously before running agent
        await self.ensure_session(user_id, session_id)

        # Use provided tools or default to google_search
        agent_tools = tools if tools is not None else [google_search]
        
        # Use provided instruction or a default one
        agent_instruction = instruction if instruction is not None else "You are a helpful assistant."

        agent = LlmAgent(
            name=agent_name,
            model=self.model,
            instruction=agent_instruction,
            tools=agent_tools,
        )
        prompt = getattr(data, "prompt", None)
        if prompt is None and isinstance(data, dict):
            prompt = data.get("prompt")
        if prompt is None:
            prompt = str(data)
        prompt = str(prompt)
        logger.data({"prompt": prompt})
        content = Content(role="user", parts=[Part(text=prompt)])
        runner = Runner(agent=agent, app_name=self.app_name, session_service=self.session_service)
         # ✅ Use synchronous generator instead of `run_async`
        events = runner.run(user_id=user_id, session_id=session_id, new_message=content)

        final_response = None
        for event in events:
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        final_response = part.text
        return {"result": final_response} 