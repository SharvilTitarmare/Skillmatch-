from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import User, Analysis, Recommendation
from app.schemas import Recommendation as RecommendationSchema
from app.core.security import get_current_active_user
from app.utils.course_recommender import course_recommender

router = APIRouter()

@router.get("/analysis/{analysis_id}", response_model=List[RecommendationSchema])
async def get_recommendations_for_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get course recommendations for a specific analysis"""
    
    # Verify analysis belongs to user
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Check if recommendations already exist
    existing_recs = db.query(Recommendation).filter(
        Recommendation.analysis_id == analysis_id
    ).all()
    
    if existing_recs:
        return existing_recs
    
    # Generate new recommendations
    missing_skills = analysis.missing_skills or []
    
    if not missing_skills:
        return []
    
    try:
        # Get recommendations for missing skills
        skill_recommendations = course_recommender.get_recommendations_for_skills(
            missing_skills[:10],  # Limit to top 10 missing skills
            limit_per_skill=3
        )
        
        # Store recommendations in database
        db_recommendations = []
        for skill, recommendations in skill_recommendations.items():
            for rec in recommendations:
                db_rec = Recommendation(
                    analysis_id=analysis_id,
                    skill_name=skill,
                    recommendation_type=rec.get('recommendation_type', 'course'),
                    title=rec.get('title', ''),
                    description=rec.get('description', ''),
                    url=rec.get('url', ''),
                    provider=rec.get('provider', ''),
                    duration=rec.get('duration', ''),
                    price=rec.get('price', ''),
                    rating=rec.get('rating', 0.0)
                )
                db.add(db_rec)
                db_recommendations.append(db_rec)
        
        db.commit()
        
        # Refresh all records
        for rec in db_recommendations:
            db.refresh(rec)
        
        return db_recommendations
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate recommendations: {str(e)}"
        )

@router.get("/skills/{skill_name}")
async def get_recommendations_for_skill(
    skill_name: str,
    limit: int = 5,
    current_user: User = Depends(get_current_active_user)
):
    """Get course recommendations for a specific skill"""
    
    try:
        recommendations = course_recommender.get_recommendations_for_skill(skill_name, limit)
        return {
            "skill": skill_name,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendations: {str(e)}"
        )

@router.post("/learning-path")
async def create_learning_path(
    skills: List[str],
    current_user: User = Depends(get_current_active_user)
):
    """Create a personalized learning path for multiple skills"""
    
    if not skills:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one skill is required"
        )
    
    try:
        learning_path = course_recommender.create_learning_path(skills)
        return learning_path
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create learning path: {str(e)}"
        )

@router.get("/user/all")
async def get_user_recommendations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    limit: int = 50
):
    """Get all recommendations for the current user"""
    
    # Get user's analyses
    user_analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).all()
    
    if not user_analyses:
        return []
    
    # Get recommendations for all analyses
    analysis_ids = [analysis.id for analysis in user_analyses]
    recommendations = db.query(Recommendation).filter(
        Recommendation.analysis_id.in_(analysis_ids)
    ).limit(limit).all()
    
    return recommendations

@router.delete("/analysis/{analysis_id}")
async def delete_analysis_recommendations(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete all recommendations for an analysis"""
    
    # Verify analysis belongs to user
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Delete recommendations
    deleted_count = db.query(Recommendation).filter(
        Recommendation.analysis_id == analysis_id
    ).delete()
    
    db.commit()
    
    return {"message": f"Deleted {deleted_count} recommendations"}

@router.get("/popular-skills")
async def get_popular_skills(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get popular skills based on user recommendations"""
    
    # Get skill frequency from recommendations
    recommendations = db.query(Recommendation).all()
    
    skill_counts = {}
    for rec in recommendations:
        skill = rec.skill_name
        skill_counts[skill] = skill_counts.get(skill, 0) + 1
    
    # Sort by frequency
    popular_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    
    return {
        "popular_skills": [
            {"skill": skill, "count": count} 
            for skill, count in popular_skills[:20]
        ]
    }

@router.get("/trending")
async def get_trending_courses(
    current_user: User = Depends(get_current_active_user)
):
    """Get trending courses across all categories"""
    
    trending_skills = [
        'python', 'javascript', 'react', 'machine learning', 'aws',
        'data science', 'artificial intelligence', 'kubernetes', 'docker'
    ]
    
    try:
        trending_courses = {}
        for skill in trending_skills[:5]:  # Limit to top 5
            courses = course_recommender.get_recommendations_for_skill(skill, 2)
            if courses:
                trending_courses[skill] = courses
        
        return {
            "trending_courses": trending_courses
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trending courses: {str(e)}"
        )