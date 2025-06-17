from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    REGULATOR = "regulator"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.USER
    is_active: bool = False
    is_verified: bool = False

class UserCreate(UserBase):
    pass

class UserInDB(UserBase):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    hashed_password: str
    verification_token: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 