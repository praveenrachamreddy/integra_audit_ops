from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    contact_person: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class ClientInDB(ClientBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: str  # User ID