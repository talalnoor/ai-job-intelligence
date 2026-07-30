from fastapi import Header, HTTPException
from app.services.auth_service import decode_access_token


async def get_current_user(authorization: str = Header(None)) -> dict:
    """
    FastAPI dependency: extracts and verifies the JWT from the
    Authorization header. Raises 401 if missing or invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header.")

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    return {"user_id": payload["sub"], "email": payload["email"]}