from pydantic_settings import BaseSettings
from pydantic import EmailStr, validator
from typing import Optional, Literal
import secrets
import logging

class Settings(BaseSettings):
    # Environment
    ENV: Literal["development", "production"] = "development"
    DEBUG: bool = True
    PORT: int = 5050
    
    # Project Info
    PROJECT_NAME: str = "RegOps AI Suite"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "regops"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Email
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @validator("DEBUG", pre=True)
    def set_debug(cls, v, values):
        if "ENV" in values:
            return values["ENV"] == "development"
        return v
    
    @validator("LOG_LEVEL", pre=True)
    def set_log_level(cls, v, values):
        if "ENV" in values and values["ENV"] == "production":
            return "WARNING"
        return v or "INFO"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__) 