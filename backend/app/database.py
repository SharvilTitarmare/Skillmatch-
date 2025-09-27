from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
import hashlib

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()