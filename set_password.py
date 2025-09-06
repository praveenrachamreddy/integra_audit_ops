import asyncio
import sys
import os

# Add the api directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.services.auth_service import auth_service

async def set_user_password(email: str, password: str):
    """Set a password for a user account"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        # Find the user
        user = await db.users.find_one({"email": email})
        if not user:
            print(f"❌ User with email {email} not found")
            return False
        
        # Hash the password
        hashed_password = auth_service.get_password_hash(password)
        
        # Update user with the hashed password
        result = await db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "hashed_password": hashed_password,
                    "is_active": True  # Activate the user
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"✅ Password has been successfully set for user {email}!")
            return True
        else:
            print(f"⚠️  No changes were made to user {email}")
            return False
            
    except Exception as e:
        print(f"❌ Error setting password: {e}")
        return False
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python set_password.py <email> <password>")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    asyncio.run(set_user_password(email, password))