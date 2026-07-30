from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, analysis, auth

app = FastAPI(title="AI Job Intelligence API")

app.add_middleware(
    CORSMiddleware,
 allow_origins=[
    "http://localhost:5173",
    "https://your-new-railway-frontend-url.up.railway.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(analysis.router)
app.include_router(auth.router)