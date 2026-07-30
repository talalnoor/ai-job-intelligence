import re
from app.config.skills import ALL_SKILLS
from app.services.skill_normalizer import normalize_skill


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found_skills = set()

    for canonical_skill in ALL_SKILLS:
        pattern = r"\b" + re.escape(canonical_skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.add(canonical_skill)

    return sorted(found_skills)
