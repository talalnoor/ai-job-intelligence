"""
Evaluates whether calculate_skill_match's numeric output correctly
separates 'strong' pairs from 'weak' pairs on our small hand-labeled set.

This is a limited evaluation (5 pairs) appropriate for a portfolio
project -- not a claim of statistically robust benchmarking.
"""
from app.services.scoring import calculate_skill_match
from tests.evaluation_data import EVALUATION_PAIRS


def test_strong_pairs_score_higher_than_weak_pairs():
    strong_scores = []
    weak_scores = []

    for pair in EVALUATION_PAIRS:
        score = calculate_skill_match(pair["resume_skills"], pair["job_all_skills"])
        if pair["expected_label"] == "strong":
            strong_scores.append(score)
        elif pair["expected_label"] == "weak":
            weak_scores.append(score)

    avg_strong = sum(strong_scores) / len(strong_scores)
    avg_weak = sum(weak_scores) / len(weak_scores)

    print(f"\nAvg strong-match score: {avg_strong:.2f}")
    print(f"Avg weak-match score: {avg_weak:.2f}")

    assert avg_strong > avg_weak