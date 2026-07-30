import json
from google import genai
from app.config import GEMINI_API_KEY
from app.models.schemas import GeminiInsights

_client = genai.Client(api_key=GEMINI_API_KEY)


class GeminiServiceError(Exception):
    """Raised when Gemini fails or returns unusable output."""
    pass


def _build_prompt(data: dict) -> str:
    return f"""You are a career advisor analyzing a job match. Based on the
structured data below, return ONLY a JSON object (no markdown, no backticks,
no extra text) with exactly these fields:

{{
  "summary": "2-3 sentence overview of this job match",
  "strengths": ["list of strengths based on matching skills"],
  "weaknesses": ["list of weaknesses based on missing skills"],
  "skill_gap_explanation": "1-2 sentences explaining the skill gaps",
  "resume_improvements": ["specific, actionable resume improvement suggestions"]
}}

Data:
Job Title: {data['job_title']}
Compatibility Score: {data['final_score']}%
Resume Skills: {', '.join(data['resume_skills'])}
Matching Skills: {', '.join(data['matching_skills'])}
Missing Skills: {', '.join(data['missing_skills'])}
High-Demand Missing Skills (across all analyzed jobs): {', '.join(data['market_high_demand_missing'])}

Important: only suggest skills the candidate should genuinely learn.
Never suggest fabricating experience or skills they don't have.
"""


def get_gemini_insights(data: dict) -> GeminiInsights:
    prompt = _build_prompt(data)

    try:
        response = _client.models.generate_content(
           model="gemini-flash-latest",
            contents=prompt,
        )
    except Exception as e:
        raise GeminiServiceError(f"Gemini API call failed: {e}")

    raw_text = response.text.strip()

    # Defensive cleanup: Gemini sometimes wraps JSON in markdown fences
    # despite instructions not to.
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.startswith("json"):
            raw_text = raw_text[4:].strip()

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise GeminiServiceError(f"Gemini returned invalid JSON: {e}")

    try:
        return GeminiInsights(**parsed)
    except Exception as e:
        raise GeminiServiceError(f"Gemini response didn't match expected schema: {e}")