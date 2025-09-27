# Complete Setup Guide for SkillMatch

This guide will help you set up PostgreSQL, troubleshoot Docker configuration, run backend and frontend services, and configure environment variables.

## Table of Contents
1. [Setting up PostgreSQL](#setting-up-postgresql)
2. [Troubleshooting Docker Configuration](#troubleshooting-docker-configuration)
3. [Running Backend and Frontend Services](#running-backend-and-frontend-services)
4. [Configuring Environment Variables](#configuring-environment-variables)

## Setting up PostgreSQL

### Option 1: Install PostgreSQL using the Installer (Recommended)

1. Download PostgreSQL from the official website: https://www.postgresql.org/download/
2. Run the installer and follow these settings during installation:
   - Choose installation directory (default is fine)
   - Select components: PostgreSQL Server, pgAdmin 4, Stack Builder (optional)
   - Set password for postgres user (remember this password)
   - Choose port (default 5432 is fine)
   - Locale: Default locale

3. After installation, add PostgreSQL to your system PATH:
   - Add `C:\Program Files\PostgreSQL\[version]\bin` to your system PATH

4. Verify installation:
   ```bash
   psql --version
   ```

### Option 2: Install PostgreSQL using Chocolatey (Windows)

1. Install Chocolatey if you haven't already:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. Install PostgreSQL:
   ```powershell
   choco install postgresql
   ```

### Creating the Required Database and User

1. Start PostgreSQL service (if not already running):
   - Open Services (services.msc)
   - Find "postgresql-x64-[version] - PostgreSQL Server"
   - Right-click and select "Start"

2. Open PostgreSQL command line:
   ```bash
   psql -U postgres
   ```
   (Enter the password you set during installation)

3. Run these commands to create the database and user:
   ```sql
   CREATE DATABASE skillmatch;
   CREATE USER skillmatch_user WITH PASSWORD 'skillmatch_password';
   ALTER ROLE skillmatch_user SET client_encoding TO 'utf8';
   ALTER ROLE skillmatch_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE skillmatch_user SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE skillmatch TO skillmatch_user;
   \q
   ```

## Troubleshooting Docker Configuration

### Issue 1: Docker Context

If Docker is configured for Linux containers instead of Windows:

1. Switch to the default context:
   ```powershell
   docker context use default
   ```

2. Verify the context:
   ```powershell
   docker context ls
   ```

### Issue 2: Docker Desktop Not Running

1. Start Docker Desktop:
   - Search for "Docker Desktop" in the Start menu
   - Run it with administrator privileges if needed

2. Wait for Docker Desktop to finish starting (check the system tray icon)

3. Verify Docker is running:
   ```powershell
   docker info
   ```

### Issue 3: Switching Between Windows and Linux Containers

1. Right-click on the Docker Desktop icon in the system tray
2. Select "Switch to Windows containers" or "Switch to Linux containers" as needed
3. Wait for the switch to complete

## Running Backend and Frontend Services

### Running the Backend Service

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   
   # Windows Command Prompt
   .\venv\Scripts\activate.bat
   ```

4. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

5. Download the spaCy language model:
   ```powershell
   python -m spacy download en_core_web_sm
   ```

6. Run the backend server:
   ```powershell
   python main.py
   ```

### Running the Frontend Service

1. Navigate to the frontend directory (in a new terminal):
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Run the frontend development server:
   ```powershell
   npm start
   ```

## Configuring Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```env
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=postgresql://skillmatch_user:skillmatch_password@localhost:5432/skillmatch
ALLOWED_HOSTS=http://localhost,http://localhost:3000,http://localhost:8000
COURSERA_API_KEY=your_coursera_api_key
UDEMY_API_KEY=your_udemy_api_key
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following content:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Docker Deployment (Alternative)

If you prefer to run the application in containers:

1. Make sure Docker Desktop is installed and running
2. Make sure Docker is configured for the correct context:
   ```powershell
   docker context use default
   ```

3. Run the deployment script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File deploy_windows.ps1
   ```

4. Access the application at: http://localhost

## Troubleshooting Common Issues

### Issue 1: Port Already in Use

If you get an error that port 8000 or 3000 is already in use:

1. Find the process using the port:
   ```powershell
   netstat -ano | findstr :8000
   ```

2. Kill the process:
   ```powershell
   taskkill /PID [process_id] /F
   ```

### Issue 2: Database Connection Errors

1. Verify PostgreSQL is running
2. Check that the database, user, and password match your configuration
3. Ensure PostgreSQL is accepting connections on localhost:5432

### Issue 3: Dependency Installation Issues

1. Make sure you've activated the virtual environment
2. Try upgrading pip:
   ```powershell
   python -m pip install --upgrade pip
   ```

3. Install Microsoft Visual C++ Build Tools if needed for some packages

## Accessing the Application

Once both servers are running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend API Documentation: http://localhost:8000/docs

## Next Steps

1. Register a new user account through the frontend
2. Upload a resume
3. Enter a job description to analyze
4. View the match score and recommendations

For any issues, check the console output in both terminals for error messages.