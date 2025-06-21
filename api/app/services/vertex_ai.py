import vertexai
from vertexai.generative_models import GenerativeModel
import vertexai.generative_models as generative_models
from app.core.config import settings

class VertexAIClient:
    def __init__(self):
        vertexai.init(project=settings.GCP_PROJECT_ID, location=settings.GCP_LOCATION)
        self.model = GenerativeModel(settings.VERTEX_MODEL_NAME)
        self.generation_config = {
            "max_output_tokens": settings.VERTEX_MAX_OUTPUT_TOKENS,
            "temperature": settings.VERTEX_TEMPERATURE,
            "top_p": settings.VERTEX_TOP_P,
        }
        self.safety_settings = {
            generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }

    async def analyze(self, prompt: str) -> str:
        response = await self.model.generate_content_async(
            [prompt],
            generation_config=self.generation_config,
            safety_settings=self.safety_settings,
            stream=False,
        )
        return response.text 