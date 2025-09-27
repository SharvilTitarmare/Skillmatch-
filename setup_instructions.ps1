# Setup Instructions for SkillMatch
# This script provides step-by-step instructions for setting up the project

Write-Host "=== SkillMatch Setup Instructions ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "PREREQUISITES CHECK:" -ForegroundColor Yellow
Write-Host ""

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✓ Python is installed: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python is not installed. Please install Python 3.9+ and try again." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js 18+ and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== STEP-BY-STEP SETUP INSTRUCTIONS ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. SET UP POSTGRESQL DATABASE" -ForegroundColor Yellow
Write-Host "   a. Download and install PostgreSQL from https://www.postgresql.org/download/" -ForegroundColor White
Write-Host "   b. During installation, set password to 'skillmatch_password'" -ForegroundColor White
Write-Host "   c. After installation, open PostgreSQL command line (psql)" -ForegroundColor White
Write-Host "   d. Run these commands:" -ForegroundColor White
Write-Host "      CREATE DATABASE skillmatch;" -ForegroundColor Cyan
Write-Host "      CREATE USER skillmatch_user WITH PASSWORD 'skillmatch_password';" -ForegroundColor Cyan
Write-Host "      ALTER ROLE skillmatch_user SET client_encoding TO 'utf8';" -ForegroundColor Cyan
Write-Host "      ALTER ROLE skillmatch_user SET default_transaction_isolation TO 'read committed';" -ForegroundColor Cyan
Write-Host "      ALTER ROLE skillmatch_user SET timezone TO 'UTC';" -ForegroundColor Cyan
Write-Host "      GRANT ALL PRIVILEGES ON DATABASE skillmatch TO skillmatch_user;" -ForegroundColor Cyan
Write-Host "      \q" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. TROUBLESHOOT DOCKER CONFIGURATION" -ForegroundColor Yellow
Write-Host "   a. Start Docker Desktop" -ForegroundColor White
Write-Host "   b. Right-click Docker icon in system tray and select 'Switch to Windows containers'" -ForegroundColor White
Write-Host "   c. Verify Docker is working:" -ForegroundColor White
Write-Host "      docker info" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. SET UP BACKEND SERVICE" -ForegroundColor Yellow
Write-Host "   a. Open a new PowerShell terminal" -ForegroundColor White
Write-Host "   b. Navigate to backend directory:" -ForegroundColor White
Write-Host "      cd backend" -ForegroundColor Cyan
Write-Host "   c. Create virtual environment:" -ForegroundColor White
Write-Host "      python -m venv venv" -ForegroundColor Cyan
Write-Host "   d. Activate virtual environment:" -ForegroundColor White
Write-Host "      .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "   e. Install dependencies:" -ForegroundColor White
Write-Host "      pip install -r requirements.txt" -ForegroundColor Cyan
Write-Host "   f. Download spaCy model:" -ForegroundColor White
Write-Host "      python -m spacy download en_core_web_sm" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. SET UP FRONTEND SERVICE" -ForegroundColor Yellow
Write-Host "   a. Open another PowerShell terminal" -ForegroundColor White
Write-Host "   b. Navigate to frontend directory:" -ForegroundColor White
Write-Host "      cd frontend" -ForegroundColor Cyan
Write-Host "   c. Install dependencies:" -ForegroundColor White
Write-Host "      npm install" -ForegroundColor Cyan
Write-Host ""

Write-Host "5. CONFIGURE ENVIRONMENT VARIABLES" -ForegroundColor Yellow
Write-Host "   a. Create backend\.env file with content:" -ForegroundColor White
Write-Host "      SECRET_KEY=your-secret-key-here-change-in-production" -ForegroundColor Cyan
Write-Host "      DATABASE_URL=postgresql://skillmatch_user:skillmatch_password@localhost:5432/skillmatch" -ForegroundColor Cyan
Write-Host "      ALLOWED_HOSTS=http://localhost,http://localhost:3000,http://localhost:8000" -ForegroundColor Cyan
Write-Host "      COURSERA_API_KEY=your_coursera_api_key" -ForegroundColor Cyan
Write-Host "      UDEMY_API_KEY=your_udemy_api_key" -ForegroundColor Cyan
Write-Host "   b. Create frontend\.env file with content:" -ForegroundColor White
Write-Host "      REACT_APP_API_URL=http://localhost:8000" -ForegroundColor Cyan
Write-Host ""

Write-Host "6. RUN THE SERVICES" -ForegroundColor Yellow
Write-Host "   a. In the backend terminal, run:" -ForegroundColor White
Write-Host "      python main.py" -ForegroundColor Cyan
Write-Host "   b. In the frontend terminal, run:" -ForegroundColor White
Write-Host "      npm start" -ForegroundColor Cyan
Write-Host ""

Write-Host "7. ACCESS THE APPLICATION" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "   API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

Write-Host "For detailed instructions, refer to COMPLETE_SETUP_GUIDE.md" -ForegroundColor Yellow
Write-Host "=== End of Instructions ===" -ForegroundColor Cyan