# SkillMatch Deployment Script
# This script automates the deployment process for the SkillMatch application

# Stop on any error
$ErrorActionPreference = "Stop"

Write-Host "=== SkillMatch Deployment Script ===" -ForegroundColor Cyan

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

# Step 1: Check if Docker is installed
Write-Host "Checking if Docker is installed..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker and try again." -ForegroundColor Red
    exit 1
}
Write-Host "Docker is installed." -ForegroundColor Green

# Step 2: Check if Docker Compose is installed
Write-Host "Checking if Docker Compose is installed..." -ForegroundColor Yellow
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Compose is not installed. Please install Docker Compose and try again." -ForegroundColor Red
    exit 1
}
Write-Host "Docker Compose is installed." -ForegroundColor Green

# Step 3: Create SSL directory if it doesn't exist
Write-Host "Creating SSL directory..." -ForegroundColor Yellow
if (!(Test-Path -Path ".\ssl")) {
    New-Item -ItemType Directory -Path ".\ssl" | Out-Null
    Write-Host "SSL directory created." -ForegroundColor Green
} else {
    Write-Host "SSL directory already exists." -ForegroundColor Green
}

# Step 4: Update environment variables
Write-Host "Updating environment variables..." -ForegroundColor Yellow

# Ask for domain name
$domain = Read-Host -Prompt "Enter your domain name (e.g., example.com)"
if ([string]::IsNullOrWhiteSpace($domain)) {
    $domain = "localhost"
    Write-Host "Using default domain: $domain" -ForegroundColor Yellow
}

# Generate a secure key if needed
$secretKey = Generate-SecureKey
Write-Host "Generated a secure SECRET_KEY." -ForegroundColor Green

# Update .env.production file
$envContent = @"
# Production Environment Configuration

SECRET_KEY=$secretKey
DATABASE_URL=postgresql://skillmatch_user:skillmatch_password@postgres:5432/skillmatch
ALLOWED_HOSTS=https://$domain,https://www.$domain

# External API Keys (Optional)
COURSERA_API_KEY=your_coursera_api_key
UDEMY_API_KEY=your_udemy_api_key

# Frontend Environment
REACT_APP_API_URL=https://api.$domain
"@

Set-Content -Path ".\.env.production" -Value $envContent
Write-Host ".env.production file updated." -ForegroundColor Green

# Step 5: Update nginx.conf with the domain
Write-Host "Updating nginx.conf with your domain..." -ForegroundColor Yellow
$nginxContent = Get-Content -Path ".\nginx.conf" -Raw
$nginxContent = $nginxContent -replace "yourdomain\.com", $domain
Set-Content -Path ".\nginx.conf" -Value $nginxContent
Write-Host "nginx.conf updated with domain: $domain" -ForegroundColor Green

# Step 6: Check for SSL certificates
Write-Host "Checking for SSL certificates..." -ForegroundColor Yellow
$sslFullchain = ".\ssl\fullchain.pem"
$sslPrivkey = ".\ssl\privkey.pem"

if (!(Test-Path -Path $sslFullchain) -or !(Test-Path -Path $sslPrivkey)) {
    Write-Host "SSL certificates not found. For production deployment, you need valid SSL certificates." -ForegroundColor Yellow
    Write-Host "For testing purposes, would you like to generate self-signed certificates? (y/n)" -ForegroundColor Yellow
    $generateSsl = Read-Host
    
    if ($generateSsl -eq "y") {
        Write-Host "Generating self-signed certificates..." -ForegroundColor Yellow
        
        # Check if OpenSSL is installed
        if (!(Get-Command openssl -ErrorAction SilentlyContinue)) {
            Write-Host "OpenSSL is not installed. Please install OpenSSL and try again, or manually add SSL certificates to the ssl directory." -ForegroundColor Red
            Write-Host "You can continue deployment without SSL for testing, but it won't work in production." -ForegroundColor Yellow
        } else {
            # Generate self-signed certificates
            $opensslCmd = "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $sslPrivkey -out $sslFullchain -subj `"/CN=$domain`""
            Invoke-Expression $opensslCmd
            Write-Host "Self-signed certificates generated." -ForegroundColor Green
        }
    } else {
        Write-Host "Continuing without SSL certificates. You'll need to add them manually before production deployment." -ForegroundColor Yellow
    }
}

# Step 7: Build and deploy with Docker Compose
Write-Host "Building and deploying with Docker Compose..." -ForegroundColor Yellow
Write-Host "Would you like to build and deploy now? (y/n)" -ForegroundColor Yellow
$deploy = Read-Host

if ($deploy -eq "y") {
    Write-Host "Building Docker containers..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml build
    
    Write-Host "Starting Docker containers..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml up -d
    
    Write-Host "Checking container status..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml ps
    
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your application should be available at: https://$domain" -ForegroundColor Cyan
    Write-Host "Note: DNS propagation may take up to 48 hours if you've just configured your domain." -ForegroundColor Yellow
} else {
    Write-Host "Deployment preparation completed. Run the following commands when you're ready to deploy:" -ForegroundColor Yellow
    Write-Host "docker-compose -f docker-compose.prod.yml build" -ForegroundColor Cyan
    Write-Host "docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor Cyan
}

Write-Host "=== Deployment Script Completed ===" -ForegroundColor Cyan