from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from fastapi import FastAPI, Request, Depends
from typing import Generator

class MongoDB:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

mongodb = MongoDB()

def init_db(app: FastAPI):
    """Initialize MongoDB client and attach to app."""
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongodb.db = mongodb.client[settings.DATABASE_NAME]
    app.mongodb_client = mongodb.client
    app.mongodb = mongodb.db

def close_db(app: FastAPI):
    """Close MongoDB client."""
    if hasattr(app, 'mongodb_client') and app.mongodb_client:
        app.mongodb_client.close()

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    """Dependency to get the MongoDB database from request.state."""
    return request.state.db 