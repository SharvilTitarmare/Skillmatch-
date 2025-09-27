from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import os
from contextlib import asynccontextmanager

from app.database import engine, get_db
from app.models import Base
from app.routers import auth, resume, analysis, recommendations, chat
from app.core.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting SkillMatch API...")
    yield
    # Shutdown
    print("Shutting down SkillMatch API...")

app = FastAPI(
    title="SkillMatch API",
    description="AI-Powered Resume Matcher & Skill Development Recommender",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_hosts_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(chat.router, tags=["chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to SkillMatch API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)