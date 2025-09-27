# SkillMatch Backend Run Script for Windows

Write-Host "🚀 Starting SkillMatch Backend..." -ForegroundColor Green

# Check if virtual environment exists
if (!(Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "❌ Virtual environment not found. Please run setup.ps1 first." -ForegroundColor Red
    exit 1
}

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Using default configuration." -ForegroundColor Yellow
    Write-Host "   Consider copying .env.example to .env and updating settings." -ForegroundColor Yellow
}

# Create uploads directory if it doesn't exist
if (!(Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads"
    Write-Host "📁 Created uploads directory" -ForegroundColor Green
}

Write-Host "🔥 Starting FastAPI server..." -ForegroundColor Cyan
Write-Host "   API: http://localhost:8000" -ForegroundColor White
Write-Host "   Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload