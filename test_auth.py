from app.database import get_db, engine, Base
from app.models import User
from app.core.security import verify_password, get_password_hash
from sqlalchemy.orm import Session
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_authentication():
    """Test the authentication system directly"""
    # Create database tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = next(get_db())
    
    # Test user
    test_email = "titarmaresharvil@gmail.com"
    test_password = "test123"
    
    # Find user by email
    user = db.query(User).filter(User.email == test_email).first()
    
    if not user:
        logger.error(f"User not found: {test_email}")
        return False
    
    logger.info(f"User found: {user.email}")
    
    # Verify password
    password_match = verify_password(test_password, user.hashed_password)
    
    if not password_match:
        logger.error("Password mismatch")
        return False
    
    logger.info("Password verified successfully")
    
    if not user.is_active:
        logger.error("User is inactive")
        return False
    
    logger.info("User is active")
    
    logger.info("Authentication successful!")
    return True

if __name__ == "__main__":
    test_authentication()