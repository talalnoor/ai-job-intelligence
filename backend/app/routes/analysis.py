from fastapi import Depends
from app.utils.auth_dependency import get_current_user
from app.services.analysis_service import save_analysis, get_analysis_history, get_analysis_by_id
from app.models.schemas import SaveAnalysisRequest, AnalysisHistoryItem, SavedAnalysis
from app.services.gemini_service import get_gemini_insights, GeminiServiceError
from app.models.schemas import GeminiInsightsRequest, GeminiInsights
from app.services.market_analysis import analyze_market_skills
from app.models.schemas import MarketAnalysisResponse
from app.services.ranking import rank_jobs
from app.models.schemas import RankJobsRequest, RankJobsResponse, RankedJob
from app.services.scoring import (
    calculate_skill_match,
    calculate_requirement_match,
    calculate_keyword_match,
    calculate_final_score,
)
from app.models.schemas import JobFitRequest, JobFitResponse
from app.services.embeddings import get_embedding
from app.services.similarity import cosine_similarity
from app.models.schemas import SimilarityTestRequest, SimilarityTestResponse
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_parser import extract_text_from_pdf, PDFExtractionError
from app.services.skill_extractor import extract_skills
from app.services.job_parser import parse_job_description
from app.models.schemas import (
    ResumeUploadResponse,
    JobInput,
    ParsedJob,
    JobAnalysisResponse,
)

router = APIRouter()


@router.post("/api/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        extracted_text = extract_text_from_pdf(file_bytes)
    except PDFExtractionError as e:
        raise HTTPException(status_code=422, detail=str(e))

    skills_found = extract_skills(extracted_text)

    return ResumeUploadResponse(
        filename=file.filename,
        char_count=len(extracted_text),
        extracted_text=extracted_text,
        skills_found=skills_found,
    )


@router.post("/api/jobs/analyze", response_model=JobAnalysisResponse)
async def analyze_jobs(jobs: list[JobInput]):
    if len(jobs) == 0:
        raise HTTPException(status_code=400, detail="At least one job is required.")

    parsed_jobs = []
    for job in jobs:
        if not job.description.strip():
            raise HTTPException(
                status_code=400,
                detail=f"Job '{job.title}' has an empty description."
            )

        parsed = parse_job_description(job.description)

        parsed_jobs.append(ParsedJob(
            title=job.title,
            company=job.company,
            required_skills=parsed["required_skills"],
            preferred_skills=parsed["preferred_skills"],
            all_skills_mentioned=parsed["all_skills_mentioned"],
        ))

    return JobAnalysisResponse(jobs=parsed_jobs)


@router.post("/api/test/similarity", response_model=SimilarityTestResponse)
async def test_similarity(payload: SimilarityTestRequest):
    embedding_a = get_embedding(payload.text_a)
    embedding_b = get_embedding(payload.text_b)
    score = cosine_similarity(embedding_a, embedding_b)
    return SimilarityTestResponse(similarity=score)


@router.post("/api/jobs/fit", response_model=JobFitResponse)
async def calculate_job_fit(payload: JobFitRequest):
    resume_embedding = get_embedding(payload.resume_text)
    job_embedding = get_embedding(payload.job_description)
    semantic_sim = cosine_similarity(resume_embedding, job_embedding)

    semantic_sim = max(0.0, semantic_sim)

    skill_match = calculate_skill_match(payload.resume_skills, payload.job_all_skills)
    requirement_match = calculate_requirement_match(payload.resume_skills, payload.job_required_skills)
    keyword_match = calculate_keyword_match(payload.resume_text, payload.job_description)

    final_score = calculate_final_score(
        semantic_sim, skill_match, requirement_match, keyword_match
    )

    return JobFitResponse(
        job_title=payload.job_title,
        final_score=final_score,
        semantic_similarity=round(semantic_sim * 100, 2),
        skill_match=round(skill_match * 100, 2),
        requirement_match=round(requirement_match * 100, 2),
        keyword_match=round(keyword_match * 100, 2),
    )


@router.post("/api/jobs/rank", response_model=RankJobsResponse)
async def rank_jobs_endpoint(payload: RankJobsRequest):
    if len(payload.jobs) == 0:
        raise HTTPException(status_code=400, detail="At least one job is required.")

    resume_embedding = get_embedding(payload.resume_text)
    resume_skill_set = set(payload.resume_skills)

    scored_jobs = []

    for job in payload.jobs:
        if not job.description.strip():
            raise HTTPException(
                status_code=400,
                detail=f"Job '{job.title}' has an empty description."
            )

        parsed = parse_job_description(job.description)
        required_skills = parsed["required_skills"]
        all_skills = parsed["all_skills_mentioned"]

        job_embedding = get_embedding(job.description)
        semantic_sim = max(0.0, cosine_similarity(resume_embedding, job_embedding))

        skill_match = calculate_skill_match(payload.resume_skills, all_skills)
        requirement_match = calculate_requirement_match(payload.resume_skills, required_skills)
        keyword_match = calculate_keyword_match(payload.resume_text, job.description)

        final_score = calculate_final_score(
            semantic_sim, skill_match, requirement_match, keyword_match
        )

        matching_skills = sorted(resume_skill_set & set(all_skills))
        missing_skills = sorted(set(all_skills) - resume_skill_set)

        scored_jobs.append({
            "title": job.title,
            "company": job.company,
            "final_score": final_score,
            "semantic_similarity": round(semantic_sim * 100, 2),
            "skill_match": round(skill_match * 100, 2),
            "requirement_match": round(requirement_match * 100, 2),
            "keyword_match": round(keyword_match * 100, 2),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
        })

    ranked = rank_jobs(scored_jobs)

    return RankJobsResponse(
        ranked_jobs=[RankedJob(**job) for job in ranked]
    )


@router.post("/api/jobs/market-analysis", response_model=MarketAnalysisResponse)
async def market_analysis_endpoint(payload: RankJobsRequest):
    if len(payload.jobs) == 0:
        raise HTTPException(status_code=400, detail="At least one job is required.")

    jobs_all_skills = []
    for job in payload.jobs:
        if not job.description.strip():
            raise HTTPException(
                status_code=400,
                detail=f"Job '{job.title}' has an empty description."
            )
        parsed = parse_job_description(job.description)
        jobs_all_skills.append(parsed["all_skills_mentioned"])

    result = analyze_market_skills(jobs_all_skills, payload.resume_skills)

    return MarketAnalysisResponse(**result)


@router.post("/api/insights/generate", response_model=GeminiInsights)
async def generate_insights(payload: GeminiInsightsRequest):
    try:
        insights = get_gemini_insights(payload.model_dump())
    except GeminiServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return insights


@router.post("/api/analyses/save")
async def save_analysis_endpoint(
    payload: SaveAnalysisRequest,
    current_user: dict = Depends(get_current_user),
):
    ranked_jobs_dicts = [job.model_dump() for job in payload.ranked_jobs]
    analysis_id = await save_analysis(current_user["user_id"], payload.resume_skills, ranked_jobs_dicts)
    return {"id": analysis_id, "message": "Analysis saved successfully."}


@router.get("/api/analyses/history", response_model=list[AnalysisHistoryItem])
async def get_history_endpoint(current_user: dict = Depends(get_current_user)):
    history = await get_analysis_history(current_user["user_id"])
    return history


@router.get("/api/analyses/{analysis_id}")
async def get_analysis_endpoint(
    analysis_id: str,
    current_user: dict = Depends(get_current_user),
):
    doc = await get_analysis_by_id(analysis_id, current_user["user_id"])
    if doc is None:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc