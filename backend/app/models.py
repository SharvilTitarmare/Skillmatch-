from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    resumes = relationship("Resume", back_populates="user")
    analyses = relationship("Analysis", back_populates="user")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, docx, txt
    raw_text = Column(Text)
    processed_text = Column(Text)
    extracted_skills = Column(JSON)  # List of skills
    extracted_experience = Column(JSON)  # Experience data
    extracted_education = Column(JSON)  # Education data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume")

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    company = Column(String)
    raw_text = Column(Text, nullable=False)
    processed_text = Column(Text)
    required_skills = Column(JSON)  # List of required skills
    preferred_skills = Column(JSON)  # List of preferred skills
    experience_requirements = Column(JSON)
    education_requirements = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    analyses = relationship("Analysis", back_populates="job_description")

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id"))
    
    # Match scores
    overall_match_score = Column(Float)
    technical_skills_score = Column(Float)
    experience_score = Column(Float)
    education_score = Column(Float)
    semantic_similarity_score = Column(Float)
    
    # Detailed analysis
    matching_skills = Column(JSON)  # Skills that match
    missing_skills = Column(JSON)  # Skills that are missing
    skill_gaps = Column(JSON)  # Detailed skill gap analysis
    keyword_density = Column(JSON)  # Keyword frequency analysis
    ats_feedback = Column(JSON)  # ATS optimization suggestions
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job_description = relationship("JobDescription", back_populates="analyses")
    recommendations = relationship("Recommendation", back_populates="analysis")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"))
    skill_name = Column(String, nullable=False)
    recommendation_type = Column(String)  # course, tutorial, article, certification
    title = Column(String)
    description = Column(Text)
    url = Column(String)
    provider = Column(String)  # coursera, udemy, youtube, etc.
    duration = Column(String)
    price = Column(String)
    rating = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    analysis = relationship("Analysis", back_populates="recommendations")