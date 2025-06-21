from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from google.adk.runners import InMemoryRunner
from app.core.config import settings

class ADKClient:
    def __init__(self):
        self.model = settings.ADK_MODEL_NAME

    async def run_agent(self, agent_name: str, data: dict) -> dict:
        agent = LlmAgent(
            name=agent_name,
            model=self.model,
            instruction="You are a helpful assistant.",
            tools=[google_search],
        )
        prompt = data.get("prompt") or str(data)
        runner = InMemoryRunner()
        response = await runner.run(agent, prompt)
        return {"result": response.text} 