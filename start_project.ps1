# Start SkillMatch Project
# This script starts both the backend and frontend services

Write-Host "=== Starting SkillMatch Project ===" -ForegroundColor Cyan
Write-Host ""

# Start Backend Service
Write-Host "Starting Backend Service..." -ForegroundColor Yellow
Write-Host "Please run the following commands manually in a new PowerShell terminal:" -ForegroundColor White
Write-Host "  cd backend" -ForegroundColor Cyan
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "  python main.py" -ForegroundColor Cyan
Write-Host ""

# Start Frontend Service
Write-Host "Starting Frontend Service..." -ForegroundColor Yellow
Write-Host "Please run the following commands manually in another PowerShell terminal:" -ForegroundColor White
Write-Host "  cd frontend" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== Services Started ===" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Green