"""
Small hand-labeled evaluation set: resume/job pairs with an expected
qualitative label. This is intentionally small (a portfolio-scale
evaluation, not a production benchmark) -- we say so explicitly rather
than pretending otherwise.
"""

EVALUATION_PAIRS = [
    {
        "resume_skills": ["Python", "Machine Learning", "scikit-learn", "Pandas", "NumPy"],
        "job_required_skills": ["Python", "Machine Learning", "scikit-learn"],
        "job_all_skills": ["Python", "Machine Learning", "scikit-learn", "Pandas"],
        "expected_label": "strong",
    },
    {
        "resume_skills": ["Python", "Flask", "HTML", "CSS"],
        "job_required_skills": ["React", "JavaScript", "Next.js"],
        "job_all_skills": ["React", "JavaScript", "Next.js", "CSS"],
        "expected_label": "weak",
    },
    {
        "resume_skills": ["Python", "SQL", "Pandas"],
        "job_required_skills": ["Python", "SQL", "Docker", "AWS"],
        "job_all_skills": ["Python", "SQL", "Docker", "AWS", "Pandas"],
        "expected_label": "moderate",
    },
    {
        "resume_skills": ["Java", "Spring", "MySQL"],
        "job_required_skills": ["Java", "Spring", "MySQL", "REST API"],
        "job_all_skills": ["Java", "Spring", "MySQL", "REST API"],
        "expected_label": "strong",
    },
    {
        "resume_skills": ["React", "JavaScript", "CSS"],
        "job_required_skills": ["Python", "Django", "PostgreSQL"],
        "job_all_skills": ["Python", "Django", "PostgreSQL"],
        "expected_label": "weak",
    },
]