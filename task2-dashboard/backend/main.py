"""
FastAPI Backend for AI Feedback System
Handles review submissions, AI summaries, and recommended actions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import sqlite3
import json
from datetime import datetime
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="AI Feedback System API", version="1.0.0")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set")

client = Groq(api_key=GROQ_API_KEY)

# Database setup
DATABASE_PATH = "feedback.db"


def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_rating INTEGER NOT NULL,
            user_review TEXT NOT NULL,
            ai_response TEXT,
            ai_summary TEXT,
            recommended_actions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


# Initialize database on startup
init_db()


# Pydantic models
class SubmissionRequest(BaseModel):
    user_rating: int
    user_review: str


class SubmissionResponse(BaseModel):
    id: int
    user_rating: int
    user_review: str
    ai_response: str
    ai_summary: str
    recommended_actions: str
    created_at: str


class SubmissionList(BaseModel):
    submissions: List[SubmissionResponse]
    total: int


# Groq API functions
def generate_ai_response(review: str, rating: int) -> str:
    """Generate AI response to user review"""
    prompt = f"""You are a helpful customer service representative. 
A customer left a {rating}-star review:

"{review}"

Generate a brief, professional response acknowledging their feedback and addressing their concerns if any.
Keep response to 2-3 sentences."""

    try:
        message = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=200
        )
        return message.content[0].text.strip()
    except Exception as e:
        return f"Error generating response: {str(e)}"


def generate_ai_summary(review: str) -> str:
    """Generate AI summary of review"""
    prompt = f"""Summarize this Yelp review in 1-2 sentences, highlighting the main points:

"{review}"

Summary:"""

    try:
        message = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="mixtral-8x7b-32768",
            temperature=0.3,
            max_tokens=100
        )
        return message.content[0].text.strip()
    except Exception as e:
        return f"Error generating summary: {str(e)}"


def generate_recommended_actions(review: str, rating: int) -> str:
    """Generate recommended actions based on review"""
    prompt = f"""Based on this {rating}-star review, suggest 1-2 specific actionable steps the business should take:

"{review}"

Return as a simple numbered list."""

    try:
        message = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=150
        )
        return message.content[0].text.strip()
    except Exception as e:
        return f"Error generating actions: {str(e)}"


# Database functions
def save_submission(user_rating: int, user_review: str, ai_response: str, 
                   ai_summary: str, recommended_actions: str) -> int:
    """Save submission to database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO submissions (user_rating, user_review, ai_response, ai_summary, recommended_actions)
        VALUES (?, ?, ?, ?, ?)
    """, (user_rating, user_review, ai_response, ai_summary, recommended_actions))
    conn.commit()
    submission_id = cursor.lastrowid
    conn.close()
    return submission_id


def get_submission_by_id(submission_id: int) -> Optional[dict]:
    """Get submission by ID"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM submissions WHERE id = ?", (submission_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "id": row[0],
            "user_rating": row[1],
            "user_review": row[2],
            "ai_response": row[3],
            "ai_summary": row[4],
            "recommended_actions": row[5],
            "created_at": row[6]
        }
    return None


def get_all_submissions(limit: int = 100, offset: int = 0) -> tuple:
    """Get all submissions with pagination"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Get total count
    cursor.execute("SELECT COUNT(*) FROM submissions")
    total = cursor.fetchone()[0]
    
    # Get paginated results (newest first)
    cursor.execute("""
        SELECT * FROM submissions 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    """, (limit, offset))
    
    rows = cursor.fetchall()
    conn.close()
    
    submissions = []
    for row in rows:
        submissions.append({
            "id": row[0],
            "user_rating": row[1],
            "user_review": row[2],
            "ai_response": row[3],
            "ai_summary": row[4],
            "recommended_actions": row[5],
            "created_at": row[6]
        })
    
    return submissions, total


# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Feedback System API",
        "version": "1.0.0",
        "endpoints": {
            "submit": "/submit",
            "submissions": "/submissions",
            "health": "/health"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/submit", response_model=SubmissionResponse)
async def submit_review(request: SubmissionRequest):
    """
    Submit a user review and get AI-generated response
    
    Args:
        user_rating: Rating 1-5
        user_review: Review text
    
    Returns:
        Submission with AI response, summary, and recommended actions
    """
    # Validate input
    if not 1 <= request.user_rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    if len(request.user_review.strip()) < 10:
        raise HTTPException(status_code=400, detail="Review must be at least 10 characters")
    
    if len(request.user_review) > 5000:
        raise HTTPException(status_code=400, detail="Review must be less than 5000 characters")
    
    # Generate AI outputs
    ai_response = generate_ai_response(request.user_review, request.user_rating)
    ai_summary = generate_ai_summary(request.user_review)
    recommended_actions = generate_recommended_actions(request.user_review, request.user_rating)
    
    # Save to database
    submission_id = save_submission(
        request.user_rating,
        request.user_review,
        ai_response,
        ai_summary,
        recommended_actions
    )
    
    # Get created submission
    submission = get_submission_by_id(submission_id)
    
    return SubmissionResponse(**submission)


@app.get("/submissions", response_model=SubmissionList)
async def get_submissions(limit: int = 100, offset: int = 0):
    """
    Get all submissions for admin dashboard
    
    Args:
        limit: Number of submissions to return (default 100)
        offset: Pagination offset (default 0)
    
    Returns:
        List of submissions with metadata
    """
    if limit > 500:
        limit = 500
    
    submissions, total = get_all_submissions(limit, offset)
    
    return SubmissionList(
        submissions=[SubmissionResponse(**s) for s in submissions],
        total=total
    )


@app.get("/submissions/{submission_id}", response_model=SubmissionResponse)
async def get_submission(submission_id: int):
    """Get a specific submission by ID"""
    submission = get_submission_by_id(submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return SubmissionResponse(**submission)


@app.get("/stats")
async def get_statistics():
    """Get statistics for admin dashboard"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Total submissions
    cursor.execute("SELECT COUNT(*) FROM submissions")
    total = cursor.fetchone()[0]
    
    # Average rating
    cursor.execute("SELECT AVG(user_rating) FROM submissions")
    avg_rating = cursor.fetchone()[0]
    
    # Rating distribution
    cursor.execute("SELECT user_rating, COUNT(*) FROM submissions GROUP BY user_rating ORDER BY user_rating")
    rating_dist = dict(cursor.fetchall())
    
    conn.close()
    
    return {
        "total_submissions": total,
        "average_rating": round(avg_rating, 2) if avg_rating else 0,
        "rating_distribution": rating_dist
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
