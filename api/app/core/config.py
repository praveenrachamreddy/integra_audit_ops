import os
import logging
from typing import List, Union, Any
import json
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from app.infrastructure.logger import Logger

logger = Logger(__name__)
load_dotenv()

class Settings(BaseSettings):
    # Environment
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    PORT: int = int(os.getenv("PORT", 9090))
    
    # Project Info
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "RegOps API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "changeme")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "regops")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Mailtrap API
    MAILTRAP_API_URL: str = os.getenv("MAILTRAP_API_URL", "https://send.api.mailtrap.io/api/send")
    logger.data({"MAILTRAP_API_URL": MAILTRAP_API_URL})
    MAILTRAP_API_TOKEN: str = os.getenv("MAILTRAP_API_TOKEN", "")
    logger.data({"MAILTRAP_API_TOKEN": MAILTRAP_API_TOKEN})
    MAILTRAP_SENDER_EMAIL: str = os.getenv("MAILTRAP_SENDER_EMAIL", "")
    MAILTRAP_SENDER_NAME: str = os.getenv("MAILTRAP_SENDER_NAME", "RegOps AI Suite")
    MAILTRAP_INBOX_ID: str = os.getenv("MAILTRAP_INBOX_ID", "")  # Optional
    
    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # GCP Vertex AI
    GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "your-gcp-project-id")
    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    GOOGLE_CLOUD_LOCATION: str = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    GCP_PROJECT_NAME: str = os.getenv("GCP_PROJECT_NAME", "regops")
    GCP_LOCATION: str = os.getenv("GCP_LOCATION", "us-central1")
    GOOGLE_GENAI_USE_VERTEX: bool = os.getenv("GOOGLE_GENAI_USE_VERTEX", "True").lower() == "true"
    VERTEX_MODEL_NAME: str = os.getenv("VERTEX_MODEL_NAME", "gemini-1.5-pro-001")
    VERTEX_MAX_OUTPUT_TOKENS: int = int(os.getenv("VERTEX_MAX_OUTPUT_TOKENS", 2048))
    VERTEX_TEMPERATURE: float = float(os.getenv("VERTEX_TEMPERATURE", 0.7))
    VERTEX_TOP_P: float = float(os.getenv("VERTEX_TOP_P", 0.95))
    logger.data({"GOOGLE_APPLICATION_CREDENTIALS": GOOGLE_APPLICATION_CREDENTIALS})

    # ADK
    ADK_MODEL_NAME: str = os.getenv("ADK_MODEL_NAME", "gemini-2.0-flash")

    # For streaming responses
    JINA_API_KEY: str = os.getenv("JINA_API_KEY", "")

    # Tavus
    TAVUS_API_KEY: str = os.getenv("TAVUS_API_KEY", "")
    TAVUS_REPLICA_ID: str = os.getenv("TAVUS_REPLICA_ID", "")

    # ElevenLabs
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    ELEVENLABS_AGENT_ID: str = os.getenv("ELEVENLABS_AGENT_ID", "")

    class Config:
        case_sensitive = True

settings = Settings()

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__) 