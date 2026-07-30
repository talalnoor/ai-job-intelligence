from fastapi import APIRouter, HTTPException
from app.services.user_service import create_user, authenticate_user
from app.services.auth_service import create_access_token
from app.models.schemas import UserSignup, UserLogin, TokenResponse

router = APIRouter()


@router.post("/api/auth/signup", response_model=TokenResponse)
async def signup(payload: UserSignup):
    user = await create_user(payload.email, payload.password, payload.name)
    if user is None:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    token = create_access_token(user["id"], user["email"])
    return TokenResponse(access_token=token, name=user["name"], email=user["email"])


@router.post("/api/auth/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    user = await authenticate_user(payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(user["id"], user["email"])
    return TokenResponse(access_token=token, name=user["name"], email=user["email"])