from pydantic import BaseModel, EmailStr, constr

class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: constr(min_length=2, max_length=100)

class VerifyEmailRequest(BaseModel):
    token: str

class SetPasswordRequest(BaseModel):
    token: str
    password: constr(min_length=8)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str 