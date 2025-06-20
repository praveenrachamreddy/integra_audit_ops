from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from app.domain.schemas.auth import (
    RegisterRequest,
    VerifyEmailRequest,
    SetPasswordRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest
)
from app.services.auth_service import auth_service
from app.services.email_service import email_service
from app.domain.models.user import User, UserInDB
from bson import ObjectId
from jose import JWTError
from app.infrastructure.db import get_db

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncIOMotorDatabase = Depends(get_db)) -> User:
    """Dependency to get the current user from JWT token."""
    try:
        payload = auth_service.verify_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_data = db.users.find_one({"_id": ObjectId(user_id)})
        if user_data is None:
            raise HTTPException(status_code=404, detail="User not found")
        return User(**user_data)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Register a new user and send verification email."""
    if await db.users.find_one({"email": request.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    verification_token = auth_service.create_verification_token()
    user = UserInDB(
        email=request.email,
        full_name=request.full_name,
        verification_token=verification_token
    )
    result = await db.users.insert_one(user.dict())
    user.id = str(result.inserted_id)
    await email_service.send_verification_email(request.email, verification_token)
    return {"message": "Registration successful. Please check your email to verify your account."}

@router.post("/verify-email")
async def verify_email(
    request: VerifyEmailRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Verify user's email and send password setup email."""
    user = await db.users.find_one({"verification_token": request.token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    password_token = auth_service.create_verification_token()
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "is_verified": True,
                "verification_token": None,
                "password_token": password_token
            }
        }
    )
    await email_service.send_password_setup_email(user["email"], password_token)
    return {"message": "Email verified successfully. Please check your email to set up your password."}

@router.post("/set-password")
async def set_password(
    request: SetPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Set password for a verified user."""
    user = await db.users.find_one({"password_token": request.token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    hashed_password = auth_service.get_password_hash(request.password)
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "hashed_password": hashed_password,
                "password_token": None,
                "is_active": True
            }
        }
    )
    return {"message": "Password set successfully"}

@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> TokenResponse:
    """Authenticate user and return JWT tokens."""
    user = await db.users.find_one({"email": request.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.get("is_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified"
        )
    if not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is not active"
        )
    if not auth_service.verify_password(request.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    return auth_service.create_tokens(User(**user))

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> TokenResponse:
    """Refresh JWT tokens using a valid refresh token."""
    try:
        payload = auth_service.verify_token(request.refresh_token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return auth_service.create_tokens(User(**user))
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.get("/me", summary="Get current user info", description="Returns the current user's information. Requires JWT Bearer token.",
            response_model=User, tags=["auth"],
            responses={401: {"description": "Unauthorized"}})
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    """Get current user info (JWT protected)."""
    return current_user 