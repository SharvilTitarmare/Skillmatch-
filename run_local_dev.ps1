# SkillMatch Local Development Setup Script
# This script runs the SkillMatch application locally without Docker

Write-Host "=== SkillMatch Local Development Setup ===" -ForegroundColor Cyan

# Check if required tools are installed
Write-Host "Checking if required tools are installed..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "Python is installed: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python is not installed. Please install Python 3.9+ and try again." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js 18+ and try again." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is installed and running
Write-Host "Note: You need to have PostgreSQL installed and running on your system." -ForegroundColor Yellow
Write-Host "The database should be configured with:" -ForegroundColor Yellow
Write-Host "  Database name: skillmatch" -ForegroundColor Yellow
Write-Host "  Username: skillmatch_user" -ForegroundColor Yellow
Write-Host "  Password: skillmatch_password" -ForegroundColor Yellow

# Setup backend
Write-Host "Setting up backend..." -ForegroundColor Yellow
Set-Location -Path "backend"

# Create virtual environment if it doesn't exist
if (!(Test-Path -Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "Virtual environment created." -ForegroundColor Green
} else {
    Write-Host "Virtual environment already exists." -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Download spaCy model if not already installed
Write-Host "Installing spaCy language model..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm

# Create .env file for development if it doesn't exist
if (!(Test-Path -Path ".env")) {
    Write-Host "Creating .env file for development..." -ForegroundColor Yellow
    $envContent = @"
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=postgresql://skillmatch_user:skillmatch_password@localhost:5432/skillmatch
ALLOWED_HOSTS=http://localhost,http://localhost:3000,http://localhost:8000
COURSERA_API_KEY=your_coursera_api_key
UDEMY_API_KEY=your_udemy_api_key
"@
    Set-Content -Path ".env" -Value $envContent
    Write-Host ".env file created. Please update it with your actual database credentials." -ForegroundColor Yellow
}

# Go back to root directory
Set-Location -Path ".."

# Setup frontend
Write-Host "Setting up frontend..." -ForegroundColor Yellow
Set-Location -Path "frontend"

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Create .env file for frontend if it doesn't exist
if (!(Test-Path -Path ".env")) {
    Write-Host "Creating .env file for frontend..." -ForegroundColor Yellow
    $envContent = "REACT_APP_API_URL=http://localhost:8000"
    Set-Content -Path ".env" -Value $envContent
    Write-Host "Frontend .env file created." -ForegroundColor Green
}

# Go back to root directory
Set-Location -Path ".."

Write-Host "Setup completed!" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host "To run the application:" -ForegroundColor Cyan
Write-Host "1. Make sure PostgreSQL is running with the correct database configuration" -ForegroundColor Cyan
Write-Host "2. Open a terminal and navigate to the backend directory:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "3. Activate the virtual environment:" -ForegroundColor Cyan
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "4. Run the backend:" -ForegroundColor Cyan
Write-Host "   python main.py" -ForegroundColor Cyan
Write-Host "5. Open another terminal and navigate to the frontend directory:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "6. Run the frontend:" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Green
Write-Host "The application will be available at:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "  Backend API docs: http://localhost:8000/docs" -ForegroundColor Green

Write-Host "=== Local Development Setup Completed ===" -ForegroundColor Cyan