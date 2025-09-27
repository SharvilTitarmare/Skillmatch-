# SkillMatch Frontend Run Script for Windows

Write-Host "🚀 Starting SkillMatch Frontend..." -ForegroundColor Green

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "❌ Dependencies not installed. Please run 'npm install' first." -ForegroundColor Red
    exit 1
}

Write-Host "🔥 Starting React development server..." -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "The browser will open automatically" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the development server
npm start