from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import uuid
import os
from pathlib import Path

from app.database import get_db
from app.models import User, Resume
from app.schemas import Resume as ResumeSchema, ResumeCreate
from app.core.security import get_current_active_user
from app.core.config import settings
from app.utils.resume_processor import resume_processor

router = APIRouter()

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
MAX_FILE_SIZE = settings.MAX_FILE_SIZE

def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@router.post("/upload", response_model=ResumeSchema)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload and process a resume file"""
    
    # Validate file
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected"
        )
    
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    # Reset file pointer
    await file.seek(0)
    
    # Generate unique filename
    file_extension = file.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Process resume
    try:
        processed_data = resume_processor.process_resume(file_path, file_extension)
        
        # Create resume record
        db_resume = Resume(
            user_id=current_user.id,
            filename=file.filename,
            file_path=file_path,
            file_type=file_extension,
            raw_text=processed_data['raw_text'],
            processed_text=processed_data['processed_text'],
            extracted_experience=processed_data['experience'],
            extracted_education=processed_data['education']
        )
        
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        return db_resume
        
    except Exception as e:
        # Clean up file if processing failed
        if os.path.exists(file_path):
            os.remove(file_path)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process resume: {str(e)}"
        )

@router.get("/", response_model=List[ResumeSchema])
async def get_user_resumes(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all resumes for the current user"""
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeSchema)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific resume"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    return resume

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Delete file from filesystem
    if os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception as e:
            print(f"Failed to delete file {resume.file_path}: {e}")
    
    # Delete from database
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}

@router.put("/{resume_id}/reprocess", response_model=ResumeSchema)
async def reprocess_resume(
    resume_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Reprocess an existing resume"""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    if not os.path.exists(resume.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found on disk"
        )
    
    try:
        # Reprocess the resume
        processed_data = resume_processor.process_resume(resume.file_path, resume.file_type)
        
        # Update resume record
        resume.raw_text = processed_data['raw_text']
        resume.processed_text = processed_data['processed_text']
        resume.extracted_experience = processed_data['experience']
        resume.extracted_education = processed_data['education']
        
        db.commit()
        db.refresh(resume)
        
        return resume
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reprocess resume: {str(e)}"
        )