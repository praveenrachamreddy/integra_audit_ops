from fastapi import APIRouter, Depends
from app.infrastructure.db import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.get("/", summary="Health check")
async def health_check(db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        # MongoDB ping
        await db.command("ping")
        db_status = "ok"
    except Exception:
        db_status = "unreachable"
    return {
        "status": "ok",
        "database": db_status
    }