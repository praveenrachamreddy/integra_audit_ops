import os
import logging
from typing import List
import json

class Settings:
    # Environment
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    PORT: int = int(os.getenv("PORT", 9090))
    
    # Project Info
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "RegOps AI Suite")
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
    MAILTRAP_API_TOKEN: str = os.getenv("MAILTRAP_API_TOKEN", "")
    MAILTRAP_SENDER_EMAIL: str = os.getenv("MAILTRAP_SENDER_EMAIL", "")
    MAILTRAP_SENDER_NAME: str = os.getenv("MAILTRAP_SENDER_NAME", "RegOps AI Suite")
    MAILTRAP_INBOX_ID: str = os.getenv("MAILTRAP_INBOX_ID", "")  # Optional
    
    # CORS
    try:
        BACKEND_CORS_ORIGINS: List[str] = json.loads(os.getenv("BACKEND_CORS_ORIGINS", '["http://localhost:3000"]'))
    except Exception:
        BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

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