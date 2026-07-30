from app.database import users_collection
from app.services.auth_service import hash_password, verify_password


async def create_user(email: str, password: str, name: str) -> dict | None:
    existing = await users_collection.find_one({"email": email})
    if existing:
        return None  # email already registered

    hashed = hash_password(password)
    document = {"email": email, "password_hash": hashed, "name": name}
    result = await users_collection.insert_one(document)

    return {"id": str(result.inserted_id), "email": email, "name": name}


async def authenticate_user(email: str, password: str) -> dict | None:
    user = await users_collection.find_one({"email": email})
    if not user:
        return None

    if not verify_password(password, user["password_hash"]):
        return None

    return {"id": str(user["_id"]), "email": user["email"], "name": user["name"]}