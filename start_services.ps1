# Start both backend and frontend services
# This script provides instructions to start both services

Write-Host "=== SkillMatch Services Startup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the SkillMatch application, you need to start both the backend and frontend services." -ForegroundColor Yellow
Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend service:" -ForegroundColor Yellow
Write-Host "   - Open a new PowerShell terminal" -ForegroundColor White
Write-Host "   - Navigate to the backend directory: cd backend" -ForegroundColor White
Write-Host "   - Activate the virtual environment: .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   - Start the backend server: python main.py" -ForegroundColor White
Write-Host ""
Write-Host "2. Start the frontend service:" -ForegroundColor Yellow
Write-Host "   - Open another PowerShell terminal" -ForegroundColor White
Write-Host "   - Navigate to the frontend directory: cd frontend" -ForegroundColor White
Write-Host "   - Start the frontend server: npm start" -ForegroundColor White
Write-Host ""
Write-Host "3. Access the application:" -ForegroundColor Yellow
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "   - Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "   - API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "NOTE: Make sure PostgreSQL is running with the correct database configuration." -ForegroundColor Yellow
Write-Host "Refer to COMPLETE_SETUP_GUIDE.md for detailed setup instructions." -ForegroundColor Yellow
Write-Host ""
Write-Host "=== End of Instructions ===" -ForegroundColor Cyan