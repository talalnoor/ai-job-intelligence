SKILL_CATEGORIES = {
    "programming_languages": [
        "Python", "Java", "C++", "JavaScript", "TypeScript", "Go", "Rust"
    ],
    "ml_ai": [
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "LLMs", "Generative AI",
        "OOP", "Feature Engineering", "Data Preprocessing", "Model Evaluation",
        "Logistic Regression", "Decision Trees", "Random Forest", "GridSearchCV"
    ],
    "ml_libraries": [
        "scikit-learn", "PyTorch", "TensorFlow", "Keras", "Matplotlib", "Seaborn"
    ],
    "data": [
        "NumPy", "Pandas", "SQL", "Power BI", "Tableau"
    ],
    "backend": [
        "FastAPI", "Flask", "Django", "REST API"
    ],
    "databases": [
        "MongoDB", "PostgreSQL", "MySQL", "Redis"
    ],
    "cloud_devops": [
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "GitHub Actions", "Git", "GitHub"
    ],
    "frontend": [
        "React", "Next.js", "HTML", "CSS", "JavaScript"
    ],
    "tools": [
        "Jupyter Notebook", "VS Code"
    ],
}

ALL_SKILLS = {
    skill: category
    for category, skills in SKILL_CATEGORIES.items()
    for skill in skills
}