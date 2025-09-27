# SkillMatch Application Starter Script for Windows

Write-Host "🚀 Starting SkillMatch Application..." -ForegroundColor Green

# Check if setup has been run
if (!(Test-Path "backend\venv") -or !(Test-Path "frontend\node_modules")) {
    Write-Host "❌ Setup not complete. Running setup first..." -ForegroundColor Red
    .\setup.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Setup failed. Please check the errors above." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Setup verified. Starting services..." -ForegroundColor Green

# Function to start services in new windows
function Start-ServiceInNewWindow {
    param($Title, $ScriptPath, $WorkingDirectory)
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkingDirectory'; .$ScriptPath" -WindowStyle Normal
    Write-Host "🔥 Started $Title in new window" -ForegroundColor Cyan
}

# Start backend
Start-ServiceInNewWindow "SkillMatch Backend" ".\run.ps1" "$PWD\backend"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Start-ServiceInNewWindow "SkillMatch Frontend" ".\run.ps1" "$PWD\frontend"

Write-Host ""
Write-Host "🌟 SkillMatch is starting up!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Please wait 30-60 seconds for services to fully start" -ForegroundColor Yellow
Write-Host "🌐 Your browser should open automatically to http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 To stop the application:" -ForegroundColor Cyan
Write-Host "   Close the backend and frontend PowerShell windows" -ForegroundColor White
Write-Host "   Or press Ctrl+C in each window" -ForegroundColor White