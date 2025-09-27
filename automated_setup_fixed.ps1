# Automated Setup Script for SkillMatch
# This script helps automate parts of the setup process

Write-Host "=== SkillMatch Automated Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-CommandExists {
    param ([string]$command)
    try {
        $exists = Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to check if a path exists
function Test-PathExists {
    param ([string]$path)
    return Test-Path $path
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Python
if (Test-CommandExists "python") {
    $pythonVersion = python --version
    Write-Host "✓ Python is installed: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python is not installed. Please install Python 3.9+ and try again." -ForegroundColor Red
    exit 1
}

# Check Node.js
if (Test-CommandExists "node") {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed. Please install Node.js 18+ and try again." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is installed
$pgPath = "C:\Program Files\PostgreSQL"
if (Test-PathExists $pgPath) {
    Write-Host "✓ PostgreSQL installation directory found" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL not found in standard location. You may need to install it." -ForegroundColor Yellow
}

# Check Docker
if (Test-CommandExists "docker") {
    Write-Host "✓ Docker is installed" -ForegroundColor Green
    try {
        # Try to switch to default context
        docker context use default | Out-Null
        Write-Host "✓ Docker context switched to default" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Could not switch Docker context. You may need to do this manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ Docker is not installed. You can continue with local setup." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Options ===" -ForegroundColor Cyan
Write-Host "1. Setup backend environment" -ForegroundColor White
Write-Host "2. Setup frontend environment" -ForegroundColor White
Write-Host "3. Create environment files" -ForegroundColor White
Write-Host "4. Run backend server" -ForegroundColor White
Write-Host "5. Run frontend server" -ForegroundColor White
Write-Host "6. Run both servers" -ForegroundColor White
Write-Host "0. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select an option (0-6)"

switch ($choice) {
    "1" {
        Write-Host "Setting up backend environment..." -ForegroundColor Yellow
        Set-Location -Path "backend"
        
        # Create virtual environment if it doesn't exist
        if (-not (Test-PathExists "venv")) {
            Write-Host "Creating virtual environment..." -ForegroundColor Yellow
            python -m venv venv
            Write-Host "✓ Virtual environment created" -ForegroundColor Green
        } else {
            Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
        }
        
        # Activate virtual environment
        Write-Host "Activating virtual environment..." -ForegroundColor Yellow
        & .\venv\Scripts\Activate.ps1
        
        # Upgrade pip
        Write-Host "Upgrading pip..." -ForegroundColor Yellow
        python -m pip install --upgrade pip
        
        # Install dependencies
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        pip install -r requirements.txt
        
        # Download spaCy model
        Write-Host "Installing spaCy language model..." -ForegroundColor Yellow
        python -m spacy download en_core_web_sm
        
        Write-Host "✓ Backend environment setup complete" -ForegroundColor Green
        Set-Location -Path ".."
    }
    
    "2" {
        Write-Host "Setting up frontend environment..." -ForegroundColor Yellow
        Set-Location -Path "frontend"
        
        # Install dependencies
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host "✓ Frontend environment setup complete" -ForegroundColor Green
        Set-Location -Path ".."
    }
    
    "3" {
        Write-Host "Creating environment files..." -ForegroundColor Yellow
        
        # Backend .env file
        if (-not (Test-PathExists "backend\.env")) {
            Write-Host "Creating backend .env file..." -ForegroundColor Yellow
            $backendEnvContent = @"
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=postgresql://skillmatch_user:skillmatch_password@localhost:5432/skillmatch
ALLOWED_HOSTS=http://localhost,http://localhost:3000,http://localhost:8000
COURSERA_API_KEY=your_coursera_api_key
UDEMY_API_KEY=your_udemy_api_key
"@
            Set-Content -Path "backend\.env" -Value $backendEnvContent
            Write-Host "✓ Backend .env file created" -ForegroundColor Green
        } else {
            Write-Host "✓ Backend .env file already exists" -ForegroundColor Green
        }
        
        # Frontend .env file
        if (-not (Test-PathExists "frontend\.env")) {
            Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
            $frontendEnvContent = "REACT_APP_API_URL=http://localhost:8000"
            Set-Content -Path "frontend\.env" -Value $frontendEnvContent
            Write-Host "✓ Frontend .env file created" -ForegroundColor Green
        } else {
            Write-Host "✓ Frontend .env file already exists" -ForegroundColor Green
        }
    }
    
    "4" {
        Write-Host "Starting backend server..." -ForegroundColor Yellow
        Write-Host "Please run the following commands manually:" -ForegroundColor Yellow
        Write-Host "  cd backend" -ForegroundColor Cyan
        Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
        Write-Host "  python main.py" -ForegroundColor Cyan
    }
    
    "5" {
        Write-Host "Starting frontend server..." -ForegroundColor Yellow
        Write-Host "Please run the following commands manually:" -ForegroundColor Yellow
        Write-Host "  cd frontend" -ForegroundColor Cyan
        Write-Host "  npm start" -ForegroundColor Cyan
    }
    
    "6" {
        Write-Host "To run both servers:" -ForegroundColor Yellow
        Write-Host "1. Open a terminal and run:" -ForegroundColor Cyan
        Write-Host "   cd backend" -ForegroundColor Cyan
        Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
        Write-Host "   python main.py" -ForegroundColor Cyan
        Write-Host "2. Open another terminal and run:" -ForegroundColor Cyan
        Write-Host "   cd frontend" -ForegroundColor Cyan
        Write-Host "   npm start" -ForegroundColor Cyan
    }
    
    "0" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host "Invalid option. Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== Script Completed ===" -ForegroundColor Cyan
Write-Host "For detailed instructions, refer to COMPLETE_SETUP_GUIDE.md" -ForegroundColor Yellow