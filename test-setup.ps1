# SkillMatch System Test Script for Windows

Write-Host "🧪 SkillMatch System Test" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

$testsPassed = 0
$totalTests = 0

function Test-Requirement {
    param($name, $command, $expectedPattern)
    $totalTests++
    Write-Host "Testing $name..." -ForegroundColor Yellow
    
    try {
        $result = Invoke-Expression $command 2>$null
        if ($result -match $expectedPattern) {
            Write-Host "✅ $name: PASS" -ForegroundColor Green
            $script:testsPassed++
        } else {
            Write-Host "❌ $name: FAIL - $result" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $name: FAIL - Not found" -ForegroundColor Red
    }
}

function Test-File {
    param($name, $path)
    $totalTests++
    Write-Host "Testing $name..." -ForegroundColor Yellow
    
    if (Test-Path $path) {
        Write-Host "✅ $name: PASS" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host "❌ $name: FAIL - File not found: $path" -ForegroundColor Red
    }
}

function Test-Port {
    param($name, $port)
    $totalTests++
    Write-Host "Testing $name..." -ForegroundColor Yellow
    
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "✅ $name: PASS - Port $port is accessible" -ForegroundColor Green
            $script:testsPassed++
        } else {
            Write-Host "❌ $name: FAIL - Port $port is not accessible" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $name: FAIL - Cannot test port $port" -ForegroundColor Red
    }
}

Write-Host "`n🔍 Testing Prerequisites..." -ForegroundColor Cyan

# Test prerequisites
Test-Requirement "Python" "python --version" "Python 3\."
Test-Requirement "Node.js" "node --version" "v\d+\."
Test-Requirement "npm" "npm --version" "\d+\."
Test-Requirement "Git" "git --version" "git version"

Write-Host "`n📁 Testing Project Structure..." -ForegroundColor Cyan

# Test project structure
Test-File "Backend main.py" "backend\main.py"
Test-File "Frontend package.json" "frontend\package.json"
Test-File "Requirements file" "backend\requirements.txt"
Test-File "Docker Compose" "docker-compose.yml"

Write-Host "`n🐍 Testing Python Environment..." -ForegroundColor Cyan

if (Test-Path "backend\venv") {
    Test-File "Virtual Environment" "backend\venv\Scripts\Activate.ps1"
    
    # Test spaCy model
    if (Test-Path "backend\venv") {
        Push-Location "backend"
        & ".\venv\Scripts\Activate.ps1"
        
        try {
            $spacyTest = python -c "import spacy; nlp = spacy.load('en_core_web_sm'); print('OK')" 2>$null
            if ($spacyTest -eq "OK") {
                Write-Host "✅ spaCy Model: PASS" -ForegroundColor Green
                $testsPassed++
            } else {
                Write-Host "❌ spaCy Model: FAIL" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ spaCy Model: FAIL - Cannot test" -ForegroundColor Red
        }
        $totalTests++
        
        Pop-Location
    }
} else {
    Write-Host "❌ Virtual Environment: FAIL - Not found" -ForegroundColor Red
    $totalTests++
}

Write-Host "`n📦 Testing Node.js Dependencies..." -ForegroundColor Cyan

if (Test-Path "frontend\node_modules") {
    Test-File "Node Modules" "frontend\node_modules"
    Test-File "React Scripts" "frontend\node_modules\.bin\react-scripts.cmd"
} else {
    Write-Host "❌ Node Modules: FAIL - Not found" -ForegroundColor Red
    $totalTests += 2
}

Write-Host "`n🌐 Testing Services (if running)..." -ForegroundColor Cyan

# Test if services are running (optional)
Test-Port "Backend API" 8000
Test-Port "Frontend Server" 3000

Write-Host "`n📋 Test Summary" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed / $totalTests" -ForegroundColor $(if ($testsPassed -eq $totalTests) { "Green" } else { "Yellow" })

if ($testsPassed -eq $totalTests) {
    Write-Host "🎉 All tests passed! Your SkillMatch setup is ready." -ForegroundColor Green
} elseif ($testsPassed -ge ($totalTests * 0.8)) {
    Write-Host "⚠️  Most tests passed. Check the failed items above." -ForegroundColor Yellow
} else {
    Write-Host "❌ Many tests failed. Please run setup.ps1 again." -ForegroundColor Red
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start Backend: cd backend && .\run.ps1" -ForegroundColor White
Write-Host "2. Start Frontend: cd frontend && .\run.ps1" -ForegroundColor White
Write-Host "3. Open: http://localhost:3000" -ForegroundColor White