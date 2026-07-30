NORMALIZATION_MAP = {
    "scikit learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "scikit-learn": "scikit-learn",

    "ml": "Machine Learning",
    "machine-learning": "Machine Learning",
    "machine learning": "Machine Learning",

    "fast api": "FastAPI",
    "fastapi": "FastAPI",

    "js": "JavaScript",
    "javascript": "JavaScript",

    "nlp": "NLP",
    "natural language processing": "NLP",

    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
}


def normalize_skill(raw_skill: str) -> str:
    key = raw_skill.strip().lower()
    return NORMALIZATION_MAP.get(key, raw_skill.strip())