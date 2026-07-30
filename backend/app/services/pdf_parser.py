import fitz  # PyMuPDF

class PDFExtractionError(Exception):
    """Raised when a PDF has no extractable text."""
    pass

def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")

    text_parts = []
    for page in doc:
        text_parts.append(page.get_text())

    doc.close()

    full_text = "\n".join(text_parts).strip()

    if not full_text:
        raise PDFExtractionError(
            "No extractable text found. This PDF may be a scanned image."
        )
    return full_text