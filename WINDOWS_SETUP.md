# 🪟 SkillMatch Setup Guide for Windows

This guide provides detailed instructions for setting up SkillMatch on Windows systems.

## 🔧 Prerequisites

### Required Software

1. **Python 3.8+**
   - Download from: https://www.python.org/downloads/
   - ✅ Make sure to check "Add Python to PATH" during installation
   - Verify installation: `python --version`

2. **Node.js 16+**
   - Download from: https://nodejs.org/
   - ✅ Choose the LTS version
   - Verify installation: `node --version` and `npm --version`

3. **Git**
   - Download from: https://git-scm.com/download/win
   - Verify installation: `git --version`

4. **PowerShell** (Usually pre-installed on Windows)
   - Run as Administrator for setup

### Optional but Recommended

- **Visual Studio Code**: https://code.visualstudio.com/
- **Docker Desktop**: https://www.docker.com/products/docker-desktop/

## 🚀 Quick Setup (Automated)

### Step 1: Clone the Repository

```powershell
git clone <repository-url>
cd skillmatchqoder
```

### Step 2: Run Automated Setup

**Open PowerShell as Administrator** and run:

```powershell
# Set execution policy (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run setup script
.\setup.ps1
```

This script will:
- ✅ Check Python and Node.js installation
- ✅ Create Python virtual environment
- ✅ Install all Python dependencies
- ✅ Download required NLP models
- ✅ Install Node.js dependencies
- ✅ Create necessary directories
- ✅ Copy configuration files

### Step 3: Start the Application

**Backend (in one PowerShell window):**
```powershell
cd backend
.\run.ps1
```

**Frontend (in another PowerShell window):**
```powershell
cd frontend
.\run.ps1
```

## 🛠️ Manual Setup (Step by Step)

If you prefer to set up manually or the automated script fails:

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Create virtual environment:**
   ```powershell
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

4. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Download spaCy model:**
   ```powershell
   python -m spacy download en_core_web_sm
   ```

6. **Create environment file:**
   ```powershell
   Copy-Item ".env.example" ".env"
   ```

7. **Create uploads directory:**
   ```powershell
   New-Item -ItemType Directory -Path "uploads" -Force
   ```

8. **Start the backend server:**
   ```powershell
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Open new PowerShell window and navigate to frontend:**
   ```powershell
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```powershell
   npm install
   ```

3. **Start the development server:**
   ```powershell
   npm start
   ```

## 🐳 Docker Setup (Alternative)

If you have Docker Desktop installed:

1. **Build and start containers:**
   ```powershell
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🌐 Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## ⚙️ Configuration

### Environment Variables

Edit the `.env` file in the backend directory:

```env
# Database (SQLite for development)
DATABASE_URL=sqlite:///./skillmatch.db

# JWT Settings (Change in production!)
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (Add your frontend URL)
ALLOWED_HOSTS=http://localhost:3000,http://127.0.0.1:3000

# File Upload Settings
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# NLP Models
SPACY_MODEL=en_core_web_sm
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. Python Module Not Found
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### 3. spaCy Model Download Fails
```powershell
# Try downloading manually
python -m spacy download en_core_web_sm
# Or install with pip
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl
```

#### 4. Node.js Dependencies Issues
```powershell
# Clear npm cache and reinstall
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

#### 5. Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :8000
# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>
```

#### 6. CORS Errors
- Ensure both frontend (port 3000) and backend (port 8000) are running
- Check that `ALLOWED_HOSTS` in `.env` includes your frontend URL

#### 7. File Upload Permission Errors
```powershell
# Ensure uploads directory exists and has write permissions
New-Item -ItemType Directory -Path "uploads" -Force
```

### Checking Logs

**Backend logs**: Check the PowerShell window where you ran the backend
**Frontend logs**: Check the browser console (F12) and PowerShell window

## 🔄 Development Workflow

### Making Changes

1. **Backend changes**: The server will auto-reload when you save files
2. **Frontend changes**: The browser will auto-refresh when you save files

### Stopping the Servers

- Press `Ctrl+C` in each PowerShell window to stop the servers

### Restarting

```powershell
# Backend
cd backend
.\run.ps1

# Frontend  
cd frontend
.\run.ps1
```

## 🧪 Testing

### Run Backend Tests
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest
```

### Run Frontend Tests
```powershell
cd frontend
npm test
```

## 📱 First Usage

1. **Open browser**: http://localhost:3000
2. **Register**: Create a new account
3. **Upload Resume**: Go to Upload page and upload a PDF/DOCX resume
4. **Analyze**: Paste a job description and run analysis
5. **View Results**: See match scores and recommendations

## 🎯 Performance Tips

- **Close unnecessary applications** to free up memory
- **Use SSD storage** for better performance
- **Disable antivirus real-time scanning** for project folders (if safe)
- **Increase virtual memory** if you encounter memory issues

## 📞 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Look at the main README.md
3. Check the console/terminal for error messages
4. Search or create GitHub issues
5. Ensure you're using the latest versions of Python and Node.js

---

**Happy coding! 🚀**