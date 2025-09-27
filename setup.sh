#!/bin/bash

# SkillMatch Setup Script

echo "🚀 Setting up SkillMatch Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please update it with your settings."
fi

cd ..

# Setup Frontend
echo "🔧 Setting up frontend..."
cd frontend

# Install dependencies
npm install

cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "🔥 To start the application:"
echo "   Backend: cd backend && ./run.sh"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "📚 Or use Docker: docker-compose up"