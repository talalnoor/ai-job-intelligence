from app.services.scoring import (
    calculate_skill_match,
    calculate_requirement_match,
    calculate_keyword_match,
    calculate_final_score,
)


def test_skill_match_full_overlap():
    resume_skills = ["Python", "SQL", "Docker"]
    job_skills = ["Python", "SQL", "Docker"]
    assert calculate_skill_match(resume_skills, job_skills) == 1.0


def test_skill_match_no_overlap():
    resume_skills = ["Python"]
    job_skills = ["Java", "C++"]
    assert calculate_skill_match(resume_skills, job_skills) == 0.0


def test_skill_match_empty_job_skills():
    assert calculate_skill_match(["Python"], []) == 0.0


def test_requirement_match_no_requirements():
    # No explicit requirements means nothing to fail on
    assert calculate_requirement_match(["Python"], []) == 1.0


def test_requirement_match_partial():
    resume_skills = ["Python", "SQL"]
    required = ["Python", "SQL", "Docker", "AWS"]
    assert calculate_requirement_match(resume_skills, required) == 0.5


def test_keyword_match_basic():
    resume_text = "python developer with sql experience"
    job_text = "looking for python developer"
    score = calculate_keyword_match(resume_text, job_text)
    assert 0.0 < score <= 1.0


def test_final_score_is_weighted_correctly():
    # semantic=1.0, skill=1.0, requirement=1.0, keyword=1.0 -> should be 100
    score = calculate_final_score(1.0, 1.0, 1.0, 1.0)
    assert score == 100.0


def test_final_score_zero_everything():
    score = calculate_final_score(0.0, 0.0, 0.0, 0.0)
    assert score == 0.0


def test_final_score_weights_semantic_most_heavily():
    # perfect semantic, nothing else -> should still be the biggest single contributor (50%)
    high_semantic = calculate_final_score(1.0, 0.0, 0.0, 0.0)
    high_skill = calculate_final_score(0.0, 1.0, 0.0, 0.0)
    assert high_semantic > high_skill