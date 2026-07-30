from collections import Counter


def analyze_market_skills(
    jobs_all_skills: list[list[str]],
    resume_skills: list[str],
    high_demand_threshold: float = 0.5,
) -> dict:
    """
    Takes the 'all_skills_mentioned' list from each analyzed job and computes
    how often each skill appears across the full set of jobs.

    high_demand_threshold: a skill counts as 'high demand' if it appears in
    at least this fraction of jobs (default 50%).
    """
    total_jobs = len(jobs_all_skills)
    if total_jobs == 0:
        return {
            "total_jobs_analyzed": 0,
            "skill_frequencies": [],
            "high_demand_missing_skills": [],
        }

    resume_skill_set = set(resume_skills)

    # Flatten all skills across all jobs, counting one occurrence per job
    # (not per mention within a job's text) — a skill mentioned twice in
    # one job description should still only count as 1 toward job_count.
    skill_counter = Counter()
    for job_skills in jobs_all_skills:
        for skill in set(job_skills):
            skill_counter[skill] += 1

    skill_frequencies = []
    high_demand_missing = []

    for skill, count in skill_counter.items():
        percentage = round((count / total_jobs) * 100, 2)
        has_it = skill in resume_skill_set

        skill_frequencies.append({
            "skill": skill,
            "job_count": count,
            "total_jobs": total_jobs,
            "percentage": percentage,
            "resume_has_it": has_it,
        })

        if (count / total_jobs) >= high_demand_threshold and not has_it:
            high_demand_missing.append(skill)

    # Sort by frequency, most in-demand first
    skill_frequencies.sort(key=lambda s: s["job_count"], reverse=True)
    high_demand_missing.sort()

    return {
        "total_jobs_analyzed": total_jobs,
        "skill_frequencies": skill_frequencies,
        "high_demand_missing_skills": high_demand_missing,
    }