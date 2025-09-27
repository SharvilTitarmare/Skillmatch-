# SkillMatch Windows Deployment Script
# This script deploys the SkillMatch application for Windows with Docker Desktop

# Stop on any error
$ErrorActionPreference = "Stop"

Write-Host "=== SkillMatch Windows Deployment Script ===" -ForegroundColor Cyan

# Function to generate a random secure key
function Generate-SecureKey {
    $length = 50
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?'
    $bytes = New-Object Byte[] $length
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $result = ''
    for ($i = 0; $i -lt $length; $i++) {
        $result += $chars[$bytes[$i] % $chars.Length]
    }
    return $result
}

# Use localhost for local deployment
$domain = "localhost"

# Step 1: Check if Docker is installed
Write-Host "Checking if Docker is installed..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed. Please install Docker Desktop for Windows and try again." -ForegroundColor Red
    exit 1
}

# Step 2: Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info
    Write-Host "Docker is running." -ForegroundColor Green
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    Write-Host "Make sure Docker Desktop is running and configured for Windows containers." -ForegroundColor Yellow
    exit 1
}

# Step 3: Create SSL directory if it doesn't exist
Write-Host "Creating SSL directory..." -ForegroundColor Yellow
if (!(Test-Path -Path ".\ssl")) {
    New-Item -ItemType Directory -Path ".\ssl" | Out-Null
    Write-Host "SSL directory created." -ForegroundColor Green
} else {
    Write-Host "SSL directory already exists." -ForegroundColor Green
}

# Step 4: Update environment variables
Write-Host "Updating environment variables for local deployment..." -ForegroundColor Yellow

# Generate a secure key
$secretKey = Generate-SecureKey
Write-Host "Generated a secure SECRET_KEY." -ForegroundColor Green

# Update .env.production file for local deployment
$envContent = @"
# Production Environment Configuration (Local Windows)

SECRET_KEY=$secretKey
DATABASE_URL=postgresql://skillmatch_user:skillmatch_password@postgres:5432/skillmatch
ALLOWED_HOSTS=http://localhost,http://localhost:3000,http://localhost:8000,https://localhost

# External API Keys (Optional)
COURSERA_API_KEY=your_coursera_api_key
UDEMY_API_KEY=your_udemy_api_key

# Frontend Environment
REACT_APP_API_URL=http://localhost:8000
"@

Set-Content -Path ".\.env.production" -Value $envContent
Write-Host ".env.production file updated for local deployment." -ForegroundColor Green

# Step 5: Update nginx.conf with localhost
Write-Host "Updating nginx.conf with localhost..." -ForegroundColor Yellow
$nginxContent = Get-Content -Path ".\nginx.conf" -Raw
$nginxContent = $nginxContent -replace "yourdomain\.com", $domain
Set-Content -Path ".\nginx.conf" -Value $nginxContent
Write-Host "nginx.conf updated with localhost." -ForegroundColor Green

# Step 6: Build and deploy with Docker Compose
Write-Host "Building and deploying with Docker Compose..." -ForegroundColor Yellow

try {
    Write-Host "Building Docker containers..." -ForegroundColor Yellow
    # Use the docker compose plugin syntax for Docker Desktop
    docker compose -f docker-compose.prod.yml build --no-cache
    
    Write-Host "Starting Docker containers..." -ForegroundColor Yellow
    docker compose -f docker-compose.prod.yml up -d
    
    Write-Host "Checking container status..." -ForegroundColor Yellow
    docker compose -f docker-compose.prod.yml ps
    
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your application should be available at: http://localhost" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost" -ForegroundColor Cyan
    Write-Host "Backend API: http://localhost/api" -ForegroundColor Cyan
    Write-Host "Backend API docs: http://localhost/docs" -ForegroundColor Cyan
} catch {
    Write-Host "Error during deployment: $_" -ForegroundColor Red
    Write-Host "Please make sure Docker Desktop is running and configured properly." -ForegroundColor Yellow
    exit 1
}

Write-Host "=== Windows Deployment Script Completed ===" -ForegroundColor Cyan