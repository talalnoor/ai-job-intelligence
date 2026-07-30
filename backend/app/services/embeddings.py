from sentence_transformers import SentenceTransformer

# Loaded once at import time, not per-request — loading this model is
# expensive (reads weights from disk), so we reuse a single instance
# across every API call instead of reloading it every time.
_model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text: str):
    """
    Converts a piece of text into a 384-dimensional vector representing
    its semantic meaning.
    """
    return _model.encode(text)