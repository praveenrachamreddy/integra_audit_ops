from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ProjectStatus(str, Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ProjectType(str, Enum):
    WEB_DEVELOPMENT = "web_development"
    MOBILE_APP = "mobile_app"
    ENTERPRISE_SOFTWARE = "enterprise_software"
    INFRASTRUCTURE = "infrastructure"
    CONSULTING = "consulting"
    AUDIT = "audit"

class ClientInfo(BaseModel):
    id: str
    name: str
    contact_person: str
    email: str
    phone: Optional[str] = None

class ProjectBase(BaseModel):
    name: str
    description: str
    project_type: ProjectType
    client: ClientInfo
    start_date: datetime
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    status: ProjectStatus = ProjectStatus.PLANNING

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    status: Optional[ProjectStatus] = None

class ProjectInDB(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: str  # User ID