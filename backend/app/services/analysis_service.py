from datetime import datetime, timezone
from bson import ObjectId
from app.database import analyses_collection


async def save_analysis(user_id: str, resume_skills: list[str], ranked_jobs: list[dict]) -> str:
    """
    Saves a completed analysis to MongoDB and returns the new document's ID.
    """
    document = {
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc),
        "resume_skills": resume_skills,
        "ranked_jobs": ranked_jobs,
    }

    result = await analyses_collection.insert_one(document)
    return str(result.inserted_id)


async def get_analysis_history(user_id: str) -> list[dict]:
    """
    Returns a lightweight summary list of past analyses for a given user,
    most recent first.
    """
    cursor = analyses_collection.find({"user_id": user_id}).sort("created_at", -1)
    documents = await cursor.to_list(length=50)

    history = []
    for doc in documents:
        top_job = doc["ranked_jobs"][0] if doc["ranked_jobs"] else None
        history.append({
            "id": str(doc["_id"]),
            "created_at": doc["created_at"],
            "top_job_title": top_job["title"] if top_job else "N/A",
            "top_job_score": top_job["final_score"] if top_job else 0.0,
            "job_count": len(doc["ranked_jobs"]),
        })
    return history


async def get_analysis_by_id(analysis_id: str, user_id: str) -> dict | None:
    """
    Fetches a single full analysis document, scoped to the requesting user
    so users can't view each other's saved analyses by guessing IDs.
    """
    doc = await analyses_collection.find_one({
        "_id": ObjectId(analysis_id),
        "user_id": user_id,
    })
    return doc