import re
from app.config.skills import ALL_SKILLS
from app.services.skill_normalizer import normalize_skill

REQUIRED_MARKERS = [
    "required", "requirements", "must have", "you have", "you must"
]

PREFERRED_MARKERS = [
    "preferred", "nice to have", "bonus", "a plus", "good to have"
]


def _find_skills_in_text(text: str) -> set[str]:
    """Scan a chunk of text for known skills, returning canonical names."""
    text_lower = text.lower()
    found = set()
    for canonical_skill in ALL_SKILLS:
        pattern = r"\b" + re.escape(canonical_skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found.add(canonical_skill)
    return found


def parse_job_description(description: str) -> dict:
    """
    Splits a job description into a 'required' section and a 'preferred'
    section based on marker phrases, then extracts skills from each.

    This is a heuristic, not perfect NLP — if no preferred-section marker
    is found, all mentioned skills are treated as required by default.
    """
    text_lower = description.lower()

    preferred_start = None
    for marker in PREFERRED_MARKERS:
        idx = text_lower.find(marker)
        if idx != -1:
            preferred_start = idx
            break

    if preferred_start is not None:
        required_text = description[:preferred_start]
        preferred_text = description[preferred_start:]
    else:
        required_text = description
        preferred_text = ""

    required_skills = _find_skills_in_text(required_text)
    preferred_skills = _find_skills_in_text(preferred_text)

    # A skill shouldn't be double-counted as both; required takes priority
    preferred_skills = preferred_skills - required_skills

    all_skills = required_skills | preferred_skills

    return {
        "required_skills": sorted(required_skills),
        "preferred_skills": sorted(preferred_skills),
        "all_skills_mentioned": sorted(all_skills),
    }