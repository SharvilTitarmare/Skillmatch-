from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./skillmatch.db"
    
    # JWT
    SECRET_KEY: str = "skillmatch-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Use string instead of List for easier env configuration
    ALLOWED_HOSTS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Upload settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "./uploads"
    
    # NLP Models
    SPACY_MODEL: str = "en_core_web_sm"
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    
    # External APIs
    COURSERA_API_KEY: str = ""
    UDEMY_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
    
    @property
    def allowed_hosts_list(self) -> List[str]:
        """Convert ALLOWED_HOSTS string to list"""
        return [host.strip() for host in self.ALLOWED_HOSTS.split(",") if host.strip()]

settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)