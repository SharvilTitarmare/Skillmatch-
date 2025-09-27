# SkillMatch Validation Script for Windows

Write-Host "🧪 SkillMatch Application Validation" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

$ErrorActionPreference = "Continue"
$testsPassed = 0
$totalTests = 0

function Test-Component {
    param($name, $testBlock)
    $totalTests++
    Write-Host "`n🔍 Testing $name..." -ForegroundColor Yellow
    
    try {
        $result = & $testBlock
        if ($result) {
            Write-Host "✅ $name: PASS" -ForegroundColor Green
            $script:testsPassed++
            return $true
        } else {
            Write-Host "❌ $name: FAIL" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $name: ERROR - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-FileStructure {
    $requiredFiles = @(
        "backend\main.py",
        "backend\requirements.txt",
        "backend\.env",
        "frontend\package.json",
        "frontend\src\App.js",
        "docker-compose.yml",
        "README.md"
    )
    
    foreach ($file in $requiredFiles) {
        if (!(Test-Path $file)) {
            Write-Host "Missing: $file" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

function Test-PythonEnvironment {
    Set-Location "backend"
    
    if (!(Test-Path "venv")) {
        Write-Host "Virtual environment not found" -ForegroundColor Red
        Set-Location ".."
        return $false
    }
    
    & ".\venv\Scripts\Activate.ps1"
    
    try {
        $imports = python -c "
import fastapi
import uvicorn
import sqlalchemy
print('All imports successful')
" 2>$null
        
        if ($imports -match "successful") {
            Set-Location ".."
            return $true
        } else {
            Set-Location ".."
            return $false
        }
    } catch {
        Set-Location ".."
        return $false
    }
}

function Test-NodeEnvironment {
    Set-Location "frontend"
    
    if (!(Test-Path "node_modules")) {
        Write-Host "Node modules not found" -ForegroundColor Red
        Set-Location ".."
        return $false
    }
    
    try {
        $packageCheck = npm list react 2>$null
        if ($packageCheck -match "react@") {
            Set-Location ".."
            return $true
        } else {
            Set-Location ".."
            return $false
        }
    } catch {
        Set-Location ".."
        return $false
    }
}

function Test-BackendSyntax {
    Set-Location "backend"
    & ".\venv\Scripts\Activate.ps1"
    
    try {
        $syntaxCheck = python -m py_compile main.py 2>$null
        if ($LASTEXITCODE -eq 0) {
            Set-Location ".."
            return $true
        } else {
            Set-Location ".."
            return $false
        }
    } catch {
        Set-Location ".."
        return $false
    }
}

function Test-FrontendSyntax {
    Set-Location "frontend"
    
    try {
        $syntaxCheck = npm run build 2>$null
        if ($LASTEXITCODE -eq 0) {
            Set-Location ".."
            return $true
        } else {
            Set-Location ".."
            return $false
        }
    } catch {
        Set-Location ".."
        return $false
    }
}

function Test-DatabaseConnection {
    Set-Location "backend"
    & ".\venv\Scripts\Activate.ps1"
    
    try {
        $dbTest = python -c "
from app.database import engine, Base
try:
    Base.metadata.create_all(bind=engine)
    print('Database connection successful')
except Exception as e:
    print(f'Database error: {e}')
" 2>$null
        
        if ($dbTest -match "successful") {
            Set-Location ".."
            return $true
        } else {
            Set-Location ".."
            return $false
        }
    } catch {
        Set-Location ".."
        return $false
    }
}

function Test-APIRoutes {
    Set-Location "backend"
    & ".\venv\Scripts\Activate.ps1"
    
    try {
        $routeTest = python -c "
from main import app
from fastapi.testclient import TestClient
client = TestClient(app)
response = client.get('/')
print(f'API status: {response.status_code}')
" 2>$null
        
        if ($routeTest -match "200") {
            Set-Location ".."
            return $true
        } else {
            Set-Location ".."
            return $false
        }
    } catch {
        Set-Location ".."
        return $false
    }
}

# Run all tests
Write-Host "🚀 Starting validation process..." -ForegroundColor Cyan

Test-Component "File Structure" { Test-FileStructure }
Test-Component "Python Environment" { Test-PythonEnvironment }
Test-Component "Node.js Environment" { Test-NodeEnvironment }
Test-Component "Backend Syntax" { Test-BackendSyntax }
Test-Component "Database Connection" { Test-DatabaseConnection }

# Summary
Write-Host "`n📋 Validation Summary" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed / $totalTests" -ForegroundColor $(if ($testsPassed -eq $totalTests) { "Green" } elseif ($testsPassed -ge ($totalTests * 0.7)) { "Yellow" } else { "Red" })

if ($testsPassed -eq $totalTests) {
    Write-Host "🎉 All validations passed! SkillMatch is ready to run." -ForegroundColor Green
    Write-Host "`n🚀 Quick Start Commands:" -ForegroundColor Cyan
    Write-Host "  .\start.ps1           # Start both backend and frontend" -ForegroundColor White
    Write-Host "  .\test-setup.ps1      # Run detailed system test" -ForegroundColor White
    Write-Host "`nOr start manually:" -ForegroundColor Cyan
    Write-Host "  Backend:  cd backend && .\run.ps1" -ForegroundColor White
    Write-Host "  Frontend: cd frontend && .\run.ps1" -ForegroundColor White
} elseif ($testsPassed -ge ($totalTests * 0.7)) {
    Write-Host "⚠️  Most validations passed, but some issues detected." -ForegroundColor Yellow
    Write-Host "   You can try running the application, but some features may not work." -ForegroundColor Yellow
    Write-Host "`n🔧 Try fixing issues with:" -ForegroundColor Cyan
    Write-Host "  .\setup.ps1           # Re-run setup" -ForegroundColor White
} else {
    Write-Host "❌ Several validations failed. Please fix the issues above." -ForegroundColor Red
    Write-Host "`n🔧 Recommended actions:" -ForegroundColor Cyan
    Write-Host "  1. Run .\setup.ps1" -ForegroundColor White
    Write-Host "  2. Check the error messages above" -ForegroundColor White
    Write-Host "  3. Refer to WINDOWS_SETUP.md for troubleshooting" -ForegroundColor White
}

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "  README.md           # Full project documentation" -ForegroundColor White
Write-Host "  WINDOWS_SETUP.md    # Windows-specific setup guide" -ForegroundColor White