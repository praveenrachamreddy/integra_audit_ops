from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.infrastructure.db import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.domain.models.project import (
    ProjectCreate, 
    ProjectUpdate, 
    ProjectInDB,
    ProjectStatus
)
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

router = APIRouter()

@router.post("/", response_model=ProjectInDB)
async def create_project(
    project: ProjectCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new project"""
    project_dict = project.dict()
    project_dict["created_at"] = datetime.utcnow()
    project_dict["updated_at"] = datetime.utcnow()
    project_dict["created_by"] = str(current_user.id)
    
    result = await db.projects.insert_one(project_dict)
    project_dict["id"] = str(result.inserted_id)
    
    return ProjectInDB(**project_dict)

@router.get("/", response_model=List[ProjectInDB])
async def list_projects(
    status: Optional[ProjectStatus] = None,
    project_type: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all projects with optional filtering"""
    query = {}
    if status:
        query["status"] = status.value
    if project_type:
        query["project_type"] = project_type
    
    cursor = db.projects.find(query).sort("created_at", -1)
    projects = []
    
    async for project in cursor:
        project["id"] = str(project.pop("_id"))
        projects.append(ProjectInDB(**project))
    
    return projects

@router.get("/{project_id}", response_model=ProjectInDB)
async def get_project(
    project_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific project by ID"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project["id"] = str(project.pop("_id"))
        return ProjectInDB(**project)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

@router.put("/{project_id}", response_model=ProjectInDB)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a project"""
    try:
        existing_project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        update_data = project_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        
        updated_project = await db.projects.find_one({"_id": ObjectId(project_id)})
        updated_project["id"] = str(updated_project.pop("_id"))
        
        return ProjectInDB(**updated_project)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")