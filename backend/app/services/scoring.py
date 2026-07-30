def calculate_skill_match(resume_skills: list[str], job_all_skills: list[str]) -> float:
    """
    Percentage of the job's mentioned skills that the resume actually has.
    Returns 0.0 if the job mentions no skills at all (avoids division by zero).
    """
    if not job_all_skills:
        return 0.0

    resume_set = set(resume_skills)
    job_set = set(job_all_skills)
    matched = resume_set & job_set

    return len(matched) / len(job_set)


def calculate_requirement_match(resume_skills: list[str], required_skills: list[str]) -> float:
    """
    Percentage of REQUIRED (not preferred) skills the resume covers.
    This is stricter than general skill match — missing a required skill
    hurts more conceptually, even though here we just measure coverage.
    """
    if not required_skills:
        return 1.0  # no explicit requirements means nothing to fail on

    resume_set = set(resume_skills)
    required_set = set(required_skills)
    matched = resume_set & required_set

    return len(matched) / len(required_set)


def calculate_keyword_match(resume_text: str, job_text: str) -> float:
    """
    Simple literal word-overlap ratio between resume and job text,
    independent of our curated skill dictionary. Catches terms our
    skill list doesn't know about yet.
    """
    resume_words = set(resume_text.lower().split())
    job_words = set(job_text.lower().split())

    if not job_words:
        return 0.0

    matched = resume_words & job_words
    return len(matched) / len(job_words)


def calculate_final_score(
    semantic_similarity: float,
    skill_match: float,
    requirement_match: float,
    keyword_match: float,
) -> float:
    """
    Weighted final compatibility score, per our Phase 1 architecture:
    50% semantic, 30% skill match, 10% requirement match, 10% keyword match.
    """
    score = (
        semantic_similarity * 0.50
        + skill_match * 0.30
        + requirement_match * 0.10
        + keyword_match * 0.10
    )
    return round(score * 100, 2)  # as a percentage