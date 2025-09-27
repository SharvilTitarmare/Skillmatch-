from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Resume schemas
class ResumeBase(BaseModel):
    filename: str
    file_type: str

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: int
    user_id: int
    file_path: str
    raw_text: Optional[str]
    processed_text: Optional[str]
    extracted_skills: Optional[List[str]]
    extracted_experience: Optional[Dict[str, Any]]
    extracted_education: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Job Description schemas
class JobDescriptionBase(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    raw_text: str

class JobDescriptionCreate(JobDescriptionBase):
    pass

class JobDescription(JobDescriptionBase):
    id: int
    processed_text: Optional[str]
    required_skills: Optional[List[str]]
    preferred_skills: Optional[List[str]]
    experience_requirements: Optional[Dict[str, Any]]
    education_requirements: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Analysis schemas
class AnalysisRequest(BaseModel):
    resume_id: int
    job_description: JobDescriptionCreate

class SkillMatch(BaseModel):
    skill: str
    status: str  # "found", "missing", "partial"
    relevance_score: Optional[float] = None

class AnalysisResult(BaseModel):
    id: int
    overall_match_score: float
    technical_skills_score: float
    experience_score: float
    education_score: float
    semantic_similarity_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    skill_gaps: List[SkillMatch]
    keyword_density: Dict[str, float]
    ats_feedback: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Recommendation schemas
class RecommendationBase(BaseModel):
    skill_name: str
    recommendation_type: str
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    provider: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[str] = None
    rating: Optional[float] = None

class Recommendation(RecommendationBase):
    id: int
    analysis_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardData(BaseModel):
    user: User
    recent_analyses: List[AnalysisResult]
    total_resumes: int
    total_analyses: int
    average_match_score: Optional[float] = None

# Chat schemas
class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None