import asyncio
import sys
import os

# Add the api directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def verify_user(email: str):
    """Manually verify a user account"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        # Find the user
        user = await db.users.find_one({"email": email})
        if not user:
            print(f"❌ User with email {email} not found")
            return False
        
        # Check if already verified
        if user.get("is_verified") and user.get("is_active"):
            print(f"✅ User {email} is already verified and active")
            return True
        
        # Update user to be verified and active
        result = await db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "is_verified": True,
                    "is_active": True,
                    "verification_token": None
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"✅ User {email} has been successfully verified and activated!")
            print("You can now log in to the application.")
            return True
        else:
            print(f"⚠️  No changes were made to user {email}")
            return False
            
    except Exception as e:
        print(f"❌ Error verifying user: {e}")
        return False
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python verify_user.py <email>")
        sys.exit(1)
    
    email = sys.argv[1]
    asyncio.run(verify_user(email))