from app.api.v1.endpoints import (
    audit,
    permit,
    explain,
    chat,
    auth,
    users,
    media,
)

api_router = APIRouter()
api_router.include_router(audit.router, prefix="/audit", tags=["Audit"])
api_router.include_router(permit.router, prefix="/permit", tags=["Permit"])
api_router.include_router(explain.router, prefix="/explain", tags=["Explain"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(media.router, prefix="/media", tags=["Media"]) 