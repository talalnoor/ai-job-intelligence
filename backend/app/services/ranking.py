def rank_jobs(scored_jobs: list[dict]) -> list[dict]:
    """
    Sorts a list of already-scored jobs by final_score, descending.
    Ranking itself is trivial — the value is in guaranteeing a
    consistent, explainable ordering the frontend can trust.
    """
    return sorted(scored_jobs, key=lambda job: job["final_score"], reverse=True)