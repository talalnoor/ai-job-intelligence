import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is not set. Add it to your .env file in backend/"
    )

client = AsyncIOMotorClient(MONGODB_URI)
db = client["ai_job_intelligence"]

analyses_collection = db["analyses"]
users_collection = db["users"]