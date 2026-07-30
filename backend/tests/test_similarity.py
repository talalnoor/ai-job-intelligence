import numpy as np
from app.services.similarity import cosine_similarity


def test_identical_vectors_similarity_is_one():
    v = np.array([1, 2, 3])
    assert abs(cosine_similarity(v, v) - 1.0) < 1e-6


def test_orthogonal_vectors_similarity_is_zero():
    v1 = np.array([1, 0])
    v2 = np.array([0, 1])
    assert abs(cosine_similarity(v1, v2)) < 1e-6


def test_opposite_vectors_similarity_is_negative_one():
    v1 = np.array([1, 0])
    v2 = np.array([-1, 0])
    assert abs(cosine_similarity(v1, v2) - (-1.0)) < 1e-6


def test_zero_vector_returns_zero_not_error():
    v1 = np.array([0, 0, 0])
    v2 = np.array([1, 2, 3])
    assert cosine_similarity(v1, v2) == 0.0