# SkillMatch Development Startup Script
# This script provides instructions to start the development environment

Write-Host "=== SkillMatch Development Environment ===" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Green

Write-Host "PREREQUISITES:" -ForegroundColor Yellow
Write-Host "1. PostgreSQL database must be running" -ForegroundColor Yellow
Write-Host "2. Database: skillmatch, User: skillmatch_user, Password: skillmatch_password" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Green

Write-Host "INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Green

Write-Host "STEP 1: Start the backend server" -ForegroundColor Yellow
Write-Host "Open a new PowerShell terminal and run:" -ForegroundColor Green
Write-Host "  cd backend" -ForegroundColor Green
Write-Host "  python -m venv venv  # (if venv doesn't exist)" -ForegroundColor Green
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Green
Write-Host "  pip install -r requirements.txt  # (if dependencies not installed)" -ForegroundColor Green
Write-Host "  python main.py" -ForegroundColor Green
Write-Host "" -ForegroundColor Green

Write-Host "STEP 2: Start the frontend development server" -ForegroundColor Yellow
Write-Host "Open another PowerShell terminal and run:" -ForegroundColor Green
Write-Host "  cd frontend" -ForegroundColor Green
Write-Host "  npm install  # (if node_modules doesn't exist)" -ForegroundColor Green
Write-Host "  npm start" -ForegroundColor Green
Write-Host "" -ForegroundColor Green

Write-Host "STEP 3: Access the application" -ForegroundColor Yellow
Write-Host "Once both servers are running:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "  API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "" -ForegroundColor Green

Write-Host "Note: Make sure PostgreSQL is running with the correct database configuration." -ForegroundColor Yellow
Write-Host "Refer to START_HERE.md for detailed setup instructions." -ForegroundColor Yellow

Write-Host "" -ForegroundColor Green
Write-Host "=== End of Instructions ===" -ForegroundColor Cyan