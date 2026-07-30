from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    filename: str
    char_count: int
    extracted_text: str
    skills_found: list[str]


class JobInput(BaseModel):
    title: str
    company: str | None = None
    description: str


class ParsedJob(BaseModel):
    title: str
    company: str | None = None
    required_skills: list[str]
    preferred_skills: list[str]
    all_skills_mentioned: list[str]


class JobAnalysisResponse(BaseModel):
    jobs: list[ParsedJob]


class SimilarityTestRequest(BaseModel):
    text_a: str
    text_b: str


class SimilarityTestResponse(BaseModel):
    similarity: float

class JobFitRequest(BaseModel):
    resume_text: str
    resume_skills: list[str]
    job_title: str
    job_description: str
    job_required_skills: list[str]
    job_all_skills: list[str]


class JobFitResponse(BaseModel):
    job_title: str
    final_score: float
    semantic_similarity: float
    skill_match: float
    requirement_match: float
    keyword_match: float   

class RankJobsRequest(BaseModel):
    resume_text: str
    resume_skills: list[str]
    jobs: list[JobInput]


class RankedJob(BaseModel):
    title: str
    company: str | None = None
    final_score: float
    semantic_similarity: float
    skill_match: float
    requirement_match: float
    keyword_match: float
    matching_skills: list[str]
    missing_skills: list[str]


class RankJobsResponse(BaseModel):
    ranked_jobs: list[RankedJob]

class MarketSkillFrequency(BaseModel):
    skill: str
    job_count: int
    total_jobs: int
    percentage: float
    resume_has_it: bool


class MarketAnalysisResponse(BaseModel):
    total_jobs_analyzed: int
    skill_frequencies: list[MarketSkillFrequency]
    high_demand_missing_skills: list[str]


class GeminiInsights(BaseModel):
    summary: str
    strengths: list[str]
    weaknesses: list[str]
    skill_gap_explanation: str
    resume_improvements: list[str]


class GeminiInsightsRequest(BaseModel):
    resume_skills: list[str]
    job_title: str
    final_score: float
    matching_skills: list[str]
    missing_skills: list[str]
    market_high_demand_missing: list[str]
from datetime import datetime


class SavedAnalysis(BaseModel):
    user_id: str
    created_at: datetime
    resume_skills: list[str]
    ranked_jobs: list[RankedJob]


class SaveAnalysisRequest(BaseModel):
    resume_skills: list[str]
    ranked_jobs: list[RankedJob]


class AnalysisHistoryItem(BaseModel):
    id: str
    created_at: datetime
    top_job_title: str
    top_job_score: float
    job_count: int

class UserSignup(BaseModel):
    email: str
    password: str
    name: str


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str
    email: str


class CurrentUser(BaseModel):
    user_id: str
    email: str
    name: str