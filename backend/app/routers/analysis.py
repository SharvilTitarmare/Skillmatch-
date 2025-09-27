from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import User, Resume, JobDescription, Analysis
from app.schemas import (
    AnalysisRequest, AnalysisResult, JobDescriptionCreate, 
    JobDescription as JobDescriptionSchema
)
from app.core.security import get_current_active_user
from app.utils.skill_extractor import skill_extractor
from app.utils.similarity_scorer import similarity_scorer

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume_job_match(
    analysis_request: AnalysisRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Analyze resume against job description"""
    
    # Get resume
    resume = db.query(Resume).filter(
        Resume.id == analysis_request.resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Create or get job description
    job_desc_data = analysis_request.job_description
    
    # Check if similar job description already exists
    existing_job = db.query(JobDescription).filter(
        JobDescription.raw_text == job_desc_data.raw_text
    ).first()
    
    if existing_job:
        job_description = existing_job
    else:
        # Create new job description
        job_description = JobDescription(
            title=job_desc_data.title,
            company=job_desc_data.company,
            raw_text=job_desc_data.raw_text,
            processed_text=job_desc_data.raw_text  # Will be processed below
        )
        db.add(job_description)
        db.commit()
        db.refresh(job_description)
    
    try:
        # Extract skills from resume (if not already done)
        if not resume.extracted_skills:
            resume_skills_data = skill_extractor.extract_all_skills(resume.processed_text or resume.raw_text)
            resume.extracted_skills = resume_skills_data.get('all_skills', [])
            db.commit()
        
        # Extract skills from job description
        job_skills_data = skill_extractor.extract_all_skills(job_description.raw_text)
        job_skills = job_skills_data.get('all_skills', [])
        
        # Update job description with extracted data
        job_description.required_skills = job_skills
        job_description.processed_text = job_description.raw_text
        db.commit()
        
        # Perform similarity analysis
        match_analysis = similarity_scorer.calculate_overall_match(
            resume_text=resume.processed_text or resume.raw_text,
            job_text=job_description.raw_text,
            resume_skills=resume.extracted_skills or [],
            job_skills=job_skills,
            resume_experience=resume.extracted_experience or {},
            job_requirements={}  # Could be enhanced to extract requirements from job text
        )
        
        # Generate ATS feedback
        ats_feedback = generate_ats_feedback(
            resume_text=resume.processed_text or resume.raw_text,
            job_text=job_description.raw_text,
            missing_keywords=match_analysis['detailed_analysis']['keyword_analysis']['missing_keywords']
        )
        
        # Create analysis record
        analysis = Analysis(
            user_id=current_user.id,
            resume_id=resume.id,
            job_description_id=job_description.id,
            overall_match_score=match_analysis['overall_match_score'],
            technical_skills_score=match_analysis['component_scores']['skill_match'],
            experience_score=match_analysis['component_scores']['experience_match'],
            education_score=0.8,  # Placeholder - could be enhanced
            semantic_similarity_score=match_analysis['component_scores']['semantic_similarity'],
            matching_skills=match_analysis['detailed_analysis']['skill_analysis']['matched_skills'],
            missing_skills=match_analysis['detailed_analysis']['skill_analysis']['missing_skills'],
            skill_gaps=create_skill_gaps_data(match_analysis['detailed_analysis']['skill_analysis']),
            keyword_density=format_keyword_density(match_analysis['detailed_analysis']['keyword_analysis']),
            ats_feedback=ats_feedback
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        return analysis
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.get("/", response_model=List[AnalysisResult])
async def get_user_analyses(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get user's analysis history"""
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).limit(limit).all()
    
    return analyses

@router.get("/{analysis_id}", response_model=AnalysisResult)
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific analysis"""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis

@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete analysis"""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    db.delete(analysis)
    db.commit()
    
    return {"message": "Analysis deleted successfully"}

def generate_ats_feedback(resume_text: str, job_text: str, missing_keywords: List[Dict]) -> List[str]:
    """Generate ATS optimization feedback"""
    feedback = []
    
    # Check for missing important keywords
    high_importance_missing = [kw for kw in missing_keywords[:10] if kw.get('importance') == 'high']
    if high_importance_missing:
        feedback.append(
            f"Add these important keywords: {', '.join([kw['keyword'] for kw in high_importance_missing[:5]])}"
        )
    
    # Check resume length
    word_count = len(resume_text.split())
    if word_count < 300:
        feedback.append("Resume might be too short. Consider adding more detail to your experience and skills.")
    elif word_count > 1000:
        feedback.append("Resume might be too long. Consider condensing to 1-2 pages.")
    
    # Check for common sections
    resume_lower = resume_text.lower()
    if 'experience' not in resume_lower and 'work history' not in resume_lower:
        feedback.append("Consider adding a clear 'Experience' or 'Work History' section.")
    
    if 'skills' not in resume_lower:
        feedback.append("Consider adding a dedicated 'Skills' section.")
    
    if 'education' not in resume_lower:
        feedback.append("Consider adding an 'Education' section if applicable.")
    
    # Check for quantifiable achievements
    numbers_pattern = r'\b\d+%|\b\d+\s*(?:million|thousand|k\b)|\$\d+'
    if not any(num in resume_text for num in ['%', '$', 'increase', 'decrease', 'improved']):
        feedback.append("Add quantifiable achievements (percentages, dollar amounts, metrics).")
    
    # Action verbs check
    action_verbs = ['managed', 'led', 'developed', 'created', 'implemented', 'achieved', 'increased', 'decreased']
    found_verbs = [verb for verb in action_verbs if verb in resume_lower]
    if len(found_verbs) < 3:
        feedback.append("Use more action verbs to describe your accomplishments.")
    
    return feedback[:5]  # Limit to top 5 suggestions

def create_skill_gaps_data(skill_analysis: Dict) -> List[Dict]:
    """Create detailed skill gaps data"""
    skill_gaps = []
    
    # Add matched skills
    for skill in skill_analysis['matched_skills']:
        skill_gaps.append({
            'skill': skill,
            'status': 'found',
            'relevance_score': 1.0
        })
    
    # Add missing skills with priority
    for skill in skill_analysis['missing_skills']:
        skill_gaps.append({
            'skill': skill,
            'status': 'missing',
            'relevance_score': 0.0
        })
    
    return skill_gaps

def format_keyword_density(keyword_analysis: Dict) -> Dict[str, float]:
    """Format keyword density for storage"""
    keyword_density = {}
    
    # Get top keywords from matching and missing
    for kw_data in keyword_analysis.get('matching_keywords', [])[:10]:
        keyword_density[kw_data['keyword']] = kw_data['combined_score']
    
    for kw_data in keyword_analysis.get('missing_keywords', [])[:10]:
        keyword_density[kw_data['keyword']] = -kw_data['job_score']  # Negative for missing
    
    return keyword_density