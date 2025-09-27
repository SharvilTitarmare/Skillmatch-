# SkillMatch - Getting Started Guide

## Prerequisites

Before running the application, make sure you have installed:

1. **Python 3.9+** (You have Python 3.11.9)
2. **Node.js 18+** (You have Node.js v23.10.0)
3. **PostgreSQL** database server
4. **Docker** (optional, for containerized deployment)

## Database Setup

You need to set up a PostgreSQL database with the following configuration:

- Database name: `skillmatch`
- Username: `skillmatch_user`
- Password: `skillmatch_password`

Create the database and user with these commands in PostgreSQL:

```sql
CREATE DATABASE skillmatch;
CREATE USER skillmatch_user WITH PASSWORD 'skillmatch_password';
ALTER ROLE skillmatch_user SET client_encoding TO 'utf8';
ALTER ROLE skillmatch_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE skillmatch_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE skillmatch TO skillmatch_user;
```

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   
   # Windows Command Prompt
   .\venv\Scripts\activate.bat
   ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Download the spaCy language model:
   ```
   python -m spacy download en_core_web_sm
   ```

6. Create a `.env` file in the backend directory with the following content:
   ```
   SECRET_KEY=your-secret-key-here-change-in-production
   DATABASE_URL=postgresql://skillmatch_user:skillmatch_password@localhost:5432/skillmatch
   ALLOWED_HOSTS=http://localhost,http://localhost:3000,http://localhost:8000
   COURSERA_API_KEY=your_coursera_api_key
   UDEMY_API_KEY=your_udemy_api_key
   ```

7. Run the backend server:
   ```
   python main.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Run the frontend development server:
   ```
   npm start
   ```

## Accessing the Application

Once both servers are running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend API Documentation: http://localhost:8000/docs

## Docker Deployment (Alternative)

If you prefer to run the application in containers:

1. Make sure Docker Desktop is installed and running
2. Run the deployment script:
   ```
   powershell -ExecutionPolicy Bypass -File deploy_windows.ps1
   ```

3. Access the application at: http://localhost

## Troubleshooting

### Docker Issues

If you encounter Docker connection issues:
1. Make sure Docker Desktop is running
2. Check if Docker is configured for Windows containers (not Linux)
3. Restart Docker Desktop if needed

### Database Connection Issues

If you get database connection errors:
1. Verify PostgreSQL is running
2. Check that the database, user, and password match your configuration
3. Ensure PostgreSQL is accepting connections on localhost:5432

### Dependency Installation Issues

If you encounter issues installing Python dependencies:
1. Make sure you've activated the virtual environment
2. Try upgrading pip: `python -m pip install --upgrade pip`
3. Install Microsoft Visual C++ Build Tools if needed for some packages