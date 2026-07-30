# AI Job Intelligence

AI-powered career intelligence platform that analyzes resumes, ranks job compatibility, identifies skill gaps, and generates personalized career roadmaps using semantic embeddings, NLP, and LLMs.

## Overview

AI Job Intelligence answers a simple question with rigorous methods: *given my resume and a set of target jobs, which ones actually fit, why, and what should I learn next?* Rather than a keyword-matching resume scanner or a thin LLM wrapper, the system combines rule-based NLP skill extraction, Sentence Transformer embeddings, a transparent weighted scoring engine, and LLM-generated qualitative reasoning — with a hard architectural rule that the LLM never controls the numeric score.

## Features

- **Resume parsing** — PDF text extraction (PyMuPDF) and skill extraction against a normalized skill taxonomy
- **Job description analysis** — required vs. preferred skill parsing from raw job postings
- **Semantic matching** — Sentence Transformer embeddings (`all-MiniLM-L6-v2`) + cosine similarity for true semantic fit, not just keyword overlap
- **Explainable scoring** — weighted Job Fit Score (semantic similarity, skill match, requirement match, keyword match), fully broken down per job
- **Job ranking** — compare multiple jobs side-by-side, sorted by fit
- **Market analysis** — skill frequency across all analyzed jobs, surfacing high-demand gaps
- **AI insights** — Gemini-generated strengths, weaknesses, and resume improvement suggestions, grounded in the calculated scores (never overriding them)
- **Authentication** — JWT-based signup/login with bcrypt password hashing
- **Saved history** — logged-in users can save analyses to MongoDB and revisit them from a "My Analyses" dashboard

## Architecture

React (Vite) SPA ──HTTP/JSON──► FastAPI backend
│
┌────────────┼─────────────┐
│ │ │
PDF Parser ML Pipeline Gemini Service
(PyMuPDF) (embeddings, (structured JSON,
similarity, Pydantic-validated,
scoring) never sets the score)
│ │ │
└────────────┴──────────────┘
│
MongoDB (auth + saved analyses)


## Tech Stack

**Backend:** FastAPI, Sentence Transformers, scikit-learn/NumPy, Google Gemini API, MongoDB (Motor), PyJWT/python-jose, bcrypt, Pydantic, pytest

**Frontend:** React, Vite, Tailwind CSS, Axios, lucide-react

## Machine Learning Methodology

Skill extraction uses regex-based whole-word matching against a curated, categorized skill dictionary, with a normalization layer collapsing known synonyms (e.g. `sklearn` → `scikit-learn`) into canonical forms. Semantic similarity is computed by encoding resume and job text into 384-dimensional embeddings via `all-MiniLM-L6-v2`, then measuring cosine similarity between them — chosen for being lightweight and CPU-friendly while still capturing genuine semantic relationships that keyword matching misses. The final Job Fit Score is a deliberately transparent weighted sum:

Final Score = Semantic Similarity × 50% + Skill Match × 30% + Requirement Match × 10% + Keyword Match × 10%


Every component is independently computed, testable, and explainable — no black-box scoring.

## LLM Methodology

Gemini receives only already-computed structured data (scores, matched/missing skills, market frequency) — never raw resume/job text alone deciding a score. Output is constrained to a strict JSON schema and validated with Pydantic before use; malformed responses are caught explicitly rather than silently trusted. The LLM's role is strictly qualitative: summaries, strengths/weaknesses, resume suggestions — it cannot alter the underlying numeric score.

## Evaluation

The scoring engine is covered by a 20-test suite: unit tests for skill extraction, normalization, cosine similarity math, and weighted scoring; plus a small hand-labeled evaluation set (5 resume/job pairs) verifying that "strong match" pairs score meaningfully higher than "weak match" pairs. This is an appropriately-scoped evaluation for a portfolio project — not a claim of large-scale, statistically robust benchmarking.

## Project Structure

ai-job-intelligence/
├── backend/
│ ├── app/
│ │ ├── routes/ # API endpoints
│ │ ├── services/ # Core business logic (scoring, ML, auth, etc.)
│ │ ├── models/ # Pydantic schemas
│ │ └── config/ # Skill taxonomy, env config
│ └── tests/ # Unit + evaluation tests
└── frontend/
└── src/
├── pages/ # Login, Signup, Analyze, Dashboard, History
├── components/ # Reusable UI pieces
├── context/ # Auth state
└── services/ # API client


## Installation

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `backend/.env` with:

GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_random_secret_key


## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload and parse a resume PDF |
| POST | `/api/jobs/rank` | Score and rank jobs against a resume |
| POST | `/api/jobs/market-analysis` | Skill frequency across analyzed jobs |
| POST | `/api/insights/generate` | Generate Gemini qualitative insights |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Authenticate and receive a JWT |
| POST | `/api/analyses/save` | Save an analysis (auth required) |
| GET | `/api/analyses/history` | List saved analyses (auth required) |
| GET | `/api/analyses/{id}` | Fetch a full saved analysis (auth required) |

## Limitations

Skill extraction is rule-based and limited to a curated dictionary — it will miss skills phrased outside its known vocabulary. The evaluation set is small (5 pairs), appropriate for demonstrating methodology rather than production-grade statistical validation. Market demand analysis reflects only the jobs a given user has analyzed, not the broader job market.

## Ethical Considerations

The system never encourages fabricating skills or experience; resume improvement suggestions explicitly frame missing skills as things to genuinely learn, not claim. Compatibility scores are presented as AI-assisted estimates, not guarantees of interviews, offers, or employment outcomes.

## Future Improvements

- RAG-based career guidance grounded in real learning resources
- Larger, more diverse evaluation dataset with precision/recall metrics
- Expanded skill taxonomy with fuzzy/embedding-based matching
- Resume rewriting assistant
- External live job-market data integration

## Disclaimer

This tool provides AI-assisted estimates for educational and portfolio purposes. It is not a guarantee of job compatibility, interview success, or employment outcomes.