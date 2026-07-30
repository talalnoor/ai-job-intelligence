import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. Create a .env file in backend/ "
        "with GEMINI_API_KEY=your_key_here"
    )

if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is not set. Add JWT_SECRET_KEY=your_secret to .env"
    )