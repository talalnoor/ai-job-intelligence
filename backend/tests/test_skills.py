from app.services.skill_extractor import extract_skills
from app.services.skill_normalizer import normalize_skill


def test_extract_skills_finds_known_skill():
    text = "I have experience with Python and Docker."
    result = extract_skills(text)
    assert "Python" in result
    assert "Docker" in result


def test_extract_skills_case_insensitive():
    text = "i know python and DOCKER"
    result = extract_skills(text)
    assert "Python" in result
    assert "Docker" in result


def test_extract_skills_no_partial_match():
    # "Go" should not match inside "Google"
    text = "I have experience with Google Cloud Platform."
    result = extract_skills(text)
    assert "Go" not in result


def test_extract_skills_no_skills_found():
    text = "I enjoy hiking and reading books."
    result = extract_skills(text)
    assert result == []


def test_normalize_skill_known_variant():
    assert normalize_skill("sklearn") == "scikit-learn"
    assert normalize_skill("ML") == "Machine Learning"


def test_normalize_skill_unknown_passthrough():
    # Unknown terms should pass through unchanged, not get mangled
    assert normalize_skill("SomeRandomTool") == "SomeRandomTool"