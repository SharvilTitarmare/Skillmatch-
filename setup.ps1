# SkillMatch Setup Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "🚀 Setting up SkillMatch Application..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    } else {
        throw "Python not found"
    }
} catch {
    Write-Host "❌ Python 3 is not installed. Please install Python 3.8+ and try again." -ForegroundColor Red
    Write-Host "Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ and try again." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Setup Backend
Write-Host "🔧 Setting up backend..." -ForegroundColor Cyan
Set-Location backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Download spaCy model
Write-Host "📦 Downloading spaCy model..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm

# Copy environment file
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Created .env file. Please update it with your settings." -ForegroundColor Yellow
}

# Create uploads directory
if (!(Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads"
    Write-Host "📁 Created uploads directory" -ForegroundColor Green
}

Set-Location ..

# Setup Frontend
Write-Host "🔧 Setting up frontend..." -ForegroundColor Cyan
Set-Location frontend

# Install dependencies
Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

Set-Location ..

Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔥 To start the application:" -ForegroundColor Cyan
Write-Host "   Backend: cd backend && .\run.ps1" -ForegroundColor White
Write-Host "   Frontend: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "📚 Or use Docker: docker-compose up" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Application will be available at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White