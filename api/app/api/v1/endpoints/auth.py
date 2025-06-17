from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient
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

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_database():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    try:
        yield db
    finally:
        client.close()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Check if user already exists
    if await db.users.find_one({"email": request.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create verification token
    verification_token = auth_service.create_verification_token()
    
    # Create user document
    user = UserInDB(
        email=request.email,
        full_name=request.full_name,
        verification_token=verification_token
    )
    
    # Save user to database
    result = await db.users.insert_one(user.dict())
    user.id = str(result.inserted_id)
    
    # Send verification email
    await email_service.send_verification_email(request.email, verification_token)
    
    return {"message": "Registration successful. Please check your email to verify your account."}

@router.post("/verify-email")
async def verify_email(
    request: VerifyEmailRequest,
    db: AsyncIOMotorClient = Depends(get_database)
):
    user = await db.users.find_one({"verification_token": request.token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    # Create password setup token
    password_token = auth_service.create_verification_token()
    
    # Update user
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
    
    # Send password setup email
    await email_service.send_password_setup_email(user["email"], password_token)
    
    return {"message": "Email verified successfully. Please check your email to set up your password."}

@router.post("/set-password")
async def set_password(
    request: SetPasswordRequest,
    db: AsyncIOMotorClient = Depends(get_database)
):
    user = await db.users.find_one({"password_token": request.token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Hash password and update user
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
    db: AsyncIOMotorClient = Depends(get_database)
):
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
    db: AsyncIOMotorClient = Depends(get_database)
):
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