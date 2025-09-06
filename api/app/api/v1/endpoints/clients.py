from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.infrastructure.db import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.domain.models.client import ClientCreate, ClientUpdate, ClientInDB
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/", response_model=ClientInDB)
async def create_client(
    client: ClientCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new client"""
    client_dict = client.dict()
    client_dict["created_at"] = datetime.utcnow()
    client_dict["updated_at"] = datetime.utcnow()
    client_dict["created_by"] = str(current_user.id)
    
    result = await db.clients.insert_one(client_dict)
    client_dict["id"] = str(result.inserted_id)
    
    return ClientInDB(**client_dict)

@router.get("/", response_model=List[ClientInDB])
async def list_clients(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all clients"""
    cursor = db.clients.find().sort("name", 1)
    clients = []
    
    async for client in cursor:
        client["id"] = str(client.pop("_id"))
        clients.append(ClientInDB(**client))
    
    return clients

@router.get("/{client_id}", response_model=ClientInDB)
async def get_client(
    client_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific client by ID"""
    try:
        client = await db.clients.find_one({"_id": ObjectId(client_id)})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        client["id"] = str(client.pop("_id"))
        return ClientInDB(**client)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid client ID")

@router.put("/{client_id}", response_model=ClientInDB)
async def update_client(
    client_id: str,
    client_update: ClientUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a client"""
    try:
        existing_client = await db.clients.find_one({"_id": ObjectId(client_id)})
        if not existing_client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        update_data = client_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await db.clients.update_one(
            {"_id": ObjectId(client_id)},
            {"$set": update_data}
        )
        
        updated_client = await db.clients.find_one({"_id": ObjectId(client_id)})
        updated_client["id"] = str(updated_client.pop("_id"))
        
        return ClientInDB(**updated_client)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid client ID")