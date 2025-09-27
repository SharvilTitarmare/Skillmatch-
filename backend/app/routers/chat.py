from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
import re

from app.database import get_db
from app.models import User, Analysis, Resume
from app.routers.auth import get_current_active_user
from app.schemas import ChatMessage, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])

class SkillAdvisor:
    """AI-powered chat-based skill advisor"""
    
    def __init__(self):
        self.skill_categories = {
            "programming": ["Python", "JavaScript", "Java", "C++", "Go", "Rust", "TypeScript"],
            "web_development": ["React", "Vue.js", "Angular", "Node.js", "Django", "Flask", "Express"],
            "data_science": ["Machine Learning", "Data Analysis", "SQL", "Pandas", "NumPy", "TensorFlow"],
            "cloud": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "DevOps"],
            "design": ["UI/UX", "Figma", "Adobe Creative Suite", "Sketch", "Prototyping"],
            "mobile": ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin"]
        }
        
        self.career_paths = {
            "software_engineer": ["Python", "JavaScript", "React", "Node.js", "Git", "SQL"],
            "data_scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "TensorFlow"],
            "frontend_developer": ["JavaScript", "React", "CSS", "HTML", "TypeScript", "Vue.js"],
            "backend_developer": ["Python", "Node.js", "SQL", "API Development", "Docker", "AWS"],
            "fullstack_developer": ["JavaScript", "React", "Node.js", "SQL", "Python", "Git"],
            "devops_engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"],
            "mobile_developer": ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin"],
            "ui_ux_designer": ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Wireframing"]
        }

    def generate_response(self, message: str, user_context: Dict[str, Any]) -> ChatResponse:
        """Generate intelligent response based on user message and context"""
        message_lower = message.lower()
        
        # Skill recommendation queries
        if any(word in message_lower for word in ["recommend", "suggestion", "learn", "skill"]):
            return self._handle_skill_recommendations(message_lower, user_context)
        
        # Career path queries
        elif any(word in message_lower for word in ["career", "path", "job", "role"]):
            return self._handle_career_guidance(message_lower, user_context)
        
        # Analysis insights
        elif any(word in message_lower for word in ["analysis", "result", "score", "match"]):
            return self._handle_analysis_insights(message_lower, user_context)
        
        # General questions
        elif any(word in message_lower for word in ["help", "how", "what", "explain"]):
            return self._handle_general_questions(message_lower, user_context)
        
        else:
            return self._handle_default_response(user_context)

    def _handle_skill_recommendations(self, message: str, context: Dict[str, Any]) -> ChatResponse:
        """Handle skill recommendation requests"""
        user_skills = context.get("user_skills", [])
        missing_skills = context.get("missing_skills", [])
        
        if "beginner" in message or "start" in message:
            response = "For beginners, I recommend starting with these foundational skills:\n\n"
            beginner_skills = ["Python", "JavaScript", "HTML/CSS", "Git", "SQL"]
            response += "\n".join([f"• {skill}" for skill in beginner_skills])
            response += "\n\nThese skills are in high demand and great for building a strong foundation!"
            
            suggestions = [
                "Show me Python learning resources",
                "What's the best way to learn JavaScript?",
                "Help me create a learning plan"
            ]
        
        elif missing_skills:
            response = f"Based on your recent job analysis, I recommend focusing on these missing skills:\n\n"
            response += "\n".join([f"• {skill}" for skill in missing_skills[:5]])
            response += "\n\nThese skills will significantly improve your job match scores!"
            
            suggestions = [
                f"Find courses for {missing_skills[0] if missing_skills else 'Python'}",
                "Create a learning roadmap",
                "Show me similar job requirements"
            ]
        
        else:
            response = "I'd be happy to recommend skills! What's your current experience level or career goal?"
            suggestions = [
                "I'm a beginner looking to start coding",
                "I want to become a data scientist",
                "Show me trending skills in tech"
            ]
        
        return ChatResponse(response=response, suggestions=suggestions)

    def _handle_career_guidance(self, message: str, context: Dict[str, Any]) -> ChatResponse:
        """Handle career path guidance"""
        if "data scientist" in message:
            career_skills = self.career_paths["data_scientist"]
            response = "To become a Data Scientist, focus on these key skills:\n\n"
            response += "\n".join([f"• {skill}" for skill in career_skills])
            response += "\n\nStart with Python and SQL, then move to machine learning frameworks!"
        
        elif "frontend" in message or "front-end" in message:
            career_skills = self.career_paths["frontend_developer"]
            response = "Frontend Developer path requires these essential skills:\n\n"
            response += "\n".join([f"• {skill}" for skill in career_skills])
            response += "\n\nBegin with HTML, CSS, and JavaScript fundamentals!"
        
        elif "fullstack" in message or "full-stack" in message:
            career_skills = self.career_paths["fullstack_developer"]
            response = "Full-Stack Developer is a great choice! Master these skills:\n\n"
            response += "\n".join([f"• {skill}" for skill in career_skills])
            response += "\n\nThis path gives you flexibility to work on both frontend and backend!"
        
        else:
            response = "I can help you explore different career paths in tech! What interests you most?"
            
        suggestions = [
            "Show me a learning roadmap",
            "What jobs can I get with these skills?",
            "Find courses for career transition"
        ]
        
        return ChatResponse(response=response, suggestions=suggestions)

    def _handle_analysis_insights(self, message: str, context: Dict[str, Any]) -> ChatResponse:
        """Handle questions about analysis results"""
        recent_score = context.get("recent_match_score", 0)
        missing_skills = context.get("missing_skills", [])
        
        if recent_score:
            if recent_score >= 0.8:
                response = f"Great job! Your {recent_score*100:.0f}% match score is excellent. "
                response += "You're well-qualified for similar positions!"
            elif recent_score >= 0.6:
                response = f"Your {recent_score*100:.0f}% match score shows good potential. "
                response += "Focus on the missing skills to boost your score!"
            else:
                response = f"Your {recent_score*100:.0f}% match score has room for improvement. "
                response += "Let's work on building the key skills you're missing!"
            
            if missing_skills:
                response += f"\n\nTop priority skills to develop:\n"
                response += "\n".join([f"• {skill}" for skill in missing_skills[:3]])
        else:
            response = "Upload a resume and run a job analysis to get personalized insights!"
        
        suggestions = [
            "How can I improve my match score?",
            "Show me skill gap analysis",
            "Find courses for missing skills"
        ]
        
        return ChatResponse(response=response, suggestions=suggestions)

    def _handle_general_questions(self, message: str, context: Dict[str, Any]) -> ChatResponse:
        """Handle general help questions"""
        if "how" in message and "work" in message:
            response = """Here's how SkillMatch works:

1. **Upload Resume** - Upload your PDF, DOCX, or TXT resume
2. **Job Analysis** - Paste a job description you're interested in
3. **AI Analysis** - Our AI extracts skills and calculates match scores
4. **Get Results** - See your compatibility score and skill gaps
5. **Learn & Improve** - Get personalized course recommendations

I'm here to help you understand your results and guide your learning!"""
        
        elif "improve" in message:
            response = """To improve your job match scores:

• **Focus on missing skills** from your analysis results
• **Add quantifiable achievements** to your resume
• **Use industry keywords** from job descriptions
• **Take relevant courses** and add certifications
• **Practice with multiple job postings** to identify patterns

Would you like specific recommendations for your situation?"""
        
        else:
            response = """I'm your AI skill advisor! I can help you with:

• **Skill recommendations** based on your goals
• **Career path guidance** for different tech roles
• **Analysis insights** to understand your results
• **Learning strategies** to improve your skills

What would you like to know more about?"""
        
        suggestions = [
            "How do I improve my resume?",
            "What skills should I learn next?",
            "Explain my analysis results"
        ]
        
        return ChatResponse(response=response, suggestions=suggestions)

    def _handle_default_response(self, context: Dict[str, Any]) -> ChatResponse:
        """Handle default/unclear messages"""
        response = """I'm here to help with your skill development journey! I can assist with:

• **Skill recommendations** for your career goals
• **Learning path creation** based on job requirements
• **Analysis insights** from your resume and job matches
• **Career guidance** for different tech roles

What would you like to explore today?"""
        
        suggestions = [
            "I want to learn new skills",
            "Help me understand my analysis",
            "What career path should I choose?"
        ]
        
        return ChatResponse(response=response, suggestions=suggestions)

# Initialize the advisor
skill_advisor = SkillAdvisor()

@router.post("/ask", response_model=ChatResponse)
async def ask_advisor(
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Chat with the AI skill advisor"""
    try:
        # Get user context from recent analyses and resumes
        recent_analysis = db.query(Analysis).filter(
            Analysis.user_id == current_user.id
        ).order_by(Analysis.created_at.desc()).first()
        
        user_resumes = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).all()
        
        # Build context
        context = {
            "user_id": current_user.id,
            "user_skills": [],
            "missing_skills": [],
            "recent_match_score": None
        }
        
        if recent_analysis:
            context["recent_match_score"] = recent_analysis.overall_match_score
            context["missing_skills"] = recent_analysis.missing_skills or []
        
        if user_resumes:
            all_skills = []
            for resume in user_resumes:
                if resume.extracted_skills:
                    all_skills.extend(resume.extracted_skills)
            context["user_skills"] = list(set(all_skills))
        
        # Add any additional context from the message
        if chat_message.context:
            context.update(chat_message.context)
        
        # Generate response
        response = skill_advisor.generate_response(chat_message.message, context)
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat processing failed: {str(e)}"
        )

@router.get("/suggestions")
async def get_chat_suggestions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get suggested chat prompts based on user data"""
    try:
        # Check user's recent activity
        recent_analysis = db.query(Analysis).filter(
            Analysis.user_id == current_user.id
        ).order_by(Analysis.created_at.desc()).first()
        
        user_resumes = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).count()
        
        suggestions = []
        
        if recent_analysis:
            suggestions.extend([
                "Explain my latest analysis results",
                "How can I improve my match score?",
                "What skills should I focus on next?"
            ])
        
        if user_resumes == 0:
            suggestions.extend([
                "How do I get started with SkillMatch?",
                "What should I include in my resume?"
            ])
        
        # Always include general suggestions
        suggestions.extend([
            "I want to become a data scientist",
            "Show me trending tech skills",
            "Help me plan my learning path"
        ])
        
        return {"suggestions": suggestions[:6]}  # Limit to 6 suggestions
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get suggestions: {str(e)}"
        )