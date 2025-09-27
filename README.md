# SkillMatch - AI-Powered Resume Matcher & Skill Development Recommender

<div align="center">
  <h3>🚀 Optimize Your Resume • 📊 Analyze Skill Gaps • 🎯 Get Personalized Learning Recommendations</h3>
  <p>An intelligent platform that leverages AI to help job seekers match their skills with job requirements and accelerate career growth</p>
</div>

## ✨ Features

### 🔐 **User Authentication & Dashboard**
- Secure JWT-based authentication system
- Personalized dashboard with analytics and insights
- User profile management

### 📄 **Resume Processing Engine**
- Support for PDF, DOCX, and TXT file formats
- Advanced text extraction and normalization
- Contact information and structured data extraction

### 🧠 **AI-Powered Analysis**
- **Skill Extraction**: NLP-based skill identification using spaCy
- **Similarity Scoring**: TF-IDF vectorization and cosine similarity
- **Semantic Analysis**: Sentence Transformers for contextual understanding
- **Experience Matching**: Years of experience and role relevance analysis

### 📊 **Interactive Results Dashboard**
- Visual match score with circular progress indicators
- Side-by-side skill comparison tables
- Color-coded skill status (Found/Missing/Partial)
- Keyword density analysis and word clouds
- ATS optimization feedback

### 🎓 **Skill Recommender System**
- Personalized course recommendations from multiple providers
- Learning path creation for skill development
- Integration with Coursera, Udemy, YouTube, and free resources
- Trending skills and popular courses

### ⚡ **ATS Optimization**
- Resume formatting suggestions
- Keyword optimization recommendations
- Section completeness analysis
- Quantifiable achievement suggestions

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **NLP/ML**: spaCy, scikit-learn, sentence-transformers
- **Authentication**: JWT with bcrypt
- **File Processing**: PyPDF2, pdfplumber, python-docx

### Frontend
- **Framework**: React 18 with hooks
- **UI Library**: Material-UI (MUI)
- **Charts**: Chart.js, React-chartjs-2, Recharts
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for both frontend and backend
- **Production**: Multi-stage builds for optimization

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**For Windows (PowerShell):**
```powershell
# Run as Administrator
.\setup.ps1
```

**For macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Docker (Easiest)

```bash
# Clone the repository
git clone <repository-url>
cd skillmatch

# Start with Docker Compose
docker-compose up --build
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 3: Manual Setup

#### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- Git

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Copy environment file
cp .env.example .env

# Start the server
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 📁 Project Structure

```
skillmatch/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── core/              # Core configurations
│   │   │   ├── config.py      # Settings and environment
│   │   │   └── security.py    # Authentication utilities
│   │   ├── routers/           # API endpoints
│   │   │   ├── auth.py        # Authentication routes
│   │   │   ├── resume.py      # Resume management
│   │   │   ├── analysis.py    # Job analysis
│   │   │   └── recommendations.py # Course recommendations
│   │   ├── utils/             # Utility modules
│   │   │   ├── resume_processor.py    # File processing
│   │   │   ├── skill_extractor.py     # NLP skill extraction
│   │   │   ├── similarity_scorer.py   # Matching algorithms
│   │   │   └── course_recommender.py  # Learning recommendations
│   │   ├── models.py          # Database models
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── database.py        # Database configuration
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Container configuration
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── App.js          # Main app component
│   ├── package.json        # Node dependencies
│   └── Dockerfile         # Container configuration
├── docker-compose.yml      # Multi-container setup
├── setup.ps1              # Windows setup script
├── setup.sh               # Unix setup script
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=sqlite:///./skillmatch.db

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Settings
ALLOWED_HOSTS=http://localhost:3000,http://127.0.0.1:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# NLP Models
SPACY_MODEL=en_core_web_sm
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2

# External APIs (Optional)
COURSERA_API_KEY=your_coursera_api_key
UDEMY_API_KEY=your_udemy_api_key
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Upload Resume**: Upload your resume (PDF, DOCX, or TXT)
3. **Job Analysis**: Paste a job description for analysis
4. **View Results**: See match scores, skill gaps, and ATS feedback
5. **Get Recommendations**: Receive personalized learning suggestions
6. **Track Progress**: Monitor your improvement over time

## 🔍 API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/resume/upload` - Resume upload
- `POST /api/analysis/analyze` - Job matching analysis
- `GET /api/recommendations/analysis/{id}` - Get recommendations

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build
```

### Manual Production Deployment

1. **Backend**: Deploy to Google Cloud Run, AWS Lambda, or similar
2. **Frontend**: Deploy to Vercel, Netlify, or AWS S3
3. **Database**: Use PostgreSQL on AWS RDS, Google Cloud SQL, or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**spaCy model not found:**
```bash
python -m spacy download en_core_web_sm
```

**CORS errors:**
- Check that ALLOWED_HOSTS includes your frontend URL
- Ensure both frontend and backend are running

**File upload errors:**
- Check that uploads directory exists and has write permissions
- Verify MAX_FILE_SIZE setting

**Database errors:**
- For SQLite: Ensure the database file has write permissions
- For PostgreSQL: Check connection string and credentials

## 📄 License

This project is licensed under the MIT License

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Join our community discussions

## 🗺️ Roadmap

- [ ] Advanced skill taxonomy and categorization
- [ ] Integration with LinkedIn Learning API
- [ ] Resume template suggestions
- [ ] Interview preparation recommendations
- [ ] Salary insights and negotiation tips
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Advanced analytics and reporting - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- spaCy for NLP capabilities
- Sentence Transformers for semantic analysis
- Material-UI for the beautiful interface
- FastAPI for the high-performance backend
- React for the interactive frontend

---

<div align="center">
  <p>Made with ❤️ for job seekers worldwide</p>
  <p>Star ⭐ this repo if you find it helpful!</p>
</div>