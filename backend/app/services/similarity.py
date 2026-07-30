import numpy as np


def cosine_similarity(vec_a, vec_b) -> float:
    """
    Measures the angle between two vectors, returning a value roughly
    between 0 and 1 for normal sentence embeddings (1 = identical meaning,
    0 = unrelated).
    """
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(dot_product / (norm_a * norm_b))