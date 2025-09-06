from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from fastapi import FastAPI, Request, Depends
from typing import Generator
import asyncio

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
    
    # Create indexes for better performance (in the background)
    try:
        asyncio.create_task(create_indexes(mongodb.db))
    except Exception as e:
        print(f"Warning: Failed to create indexes: {e}")

async def create_indexes(db):
    """Create database indexes for better query performance."""
    try:
        # Users collection indexes
        await db.users.create_index("email", unique=True)
        
        # Projects collection indexes
        await db.projects.create_index("client.id")
        await db.projects.create_index("status")
        await db.projects.create_index("project_type")
        await db.projects.create_index([("name", "text"), ("description", "text")])
        
        # Clients collection indexes
        await db.clients.create_index("name")
        await db.clients.create_index("email")
        
        # Audit reports indexes
        await db.fs.files.create_index("metadata.project_id")
        await db.fs.files.create_index("metadata.user_id")
        await db.fs.files.create_index("metadata.type")
        
        print("✅ Database indexes created successfully")
    except Exception as e:
        print(f"Warning: Failed to create some indexes: {e}")

def close_db(app: FastAPI):
    """Close MongoDB client."""
    if hasattr(app, 'mongodb_client') and app.mongodb_client:
        app.mongodb_client.close()

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    """Dependency to get the MongoDB database from request.state."""
    return request.state.db 