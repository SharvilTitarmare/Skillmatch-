import requests
from typing import List, Dict, Any, Optional
import json
from app.core.config import settings

class CourseRecommender:
    def __init__(self):
        self.providers = {
            'coursera': self._get_coursera_courses,
            'udemy': self._get_udemy_courses,
            'youtube': self._get_youtube_courses,
            'free_resources': self._get_free_resources
        }
    
    def get_recommendations_for_skill(self, skill: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get course recommendations for a specific skill"""
        all_recommendations = []
        
        # Get recommendations from each provider
        for provider_name, provider_func in self.providers.items():
            try:
                courses = provider_func(skill, limit)
                all_recommendations.extend(courses)
            except Exception as e:
                print(f"Error getting courses from {provider_name}: {e}")
                continue
        
        # Sort by rating and relevance
        all_recommendations.sort(key=lambda x: (x.get('rating', 0), x.get('relevance_score', 0)), reverse=True)
        
        return all_recommendations[:limit]
    
    def get_recommendations_for_skills(self, skills: List[str], limit_per_skill: int = 3) -> Dict[str, List[Dict]]:
        """Get recommendations for multiple skills"""
        recommendations = {}
        
        for skill in skills:
            skill_recs = self.get_recommendations_for_skill(skill, limit_per_skill)
            if skill_recs:
                recommendations[skill] = skill_recs
        
        return recommendations
    
    def _get_coursera_courses(self, skill: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get Coursera courses (mock implementation - would use real API)"""
        # This would use the actual Coursera API
        # For now, returning mock data based on common skills
        
        coursera_courses = {
            'python': [
                {
                    'title': 'Python for Everybody Specialization',
                    'description': 'Learn to program and analyze data with Python',
                    'provider': 'Coursera',
                    'url': 'https://www.coursera.org/specializations/python',
                    'duration': '4 months',
                    'price': '$49/month',
                    'rating': 4.8,
                    'recommendation_type': 'course',
                    'relevance_score': 0.95
                }
            ],
            'machine learning': [
                {
                    'title': 'Machine Learning Course',
                    'description': 'Complete ML course by Andrew Ng',
                    'provider': 'Coursera',
                    'url': 'https://www.coursera.org/learn/machine-learning',
                    'duration': '11 weeks',
                    'price': '$79/month',
                    'rating': 4.9,
                    'recommendation_type': 'course',
                    'relevance_score': 0.98
                }
            ],
            'react': [
                {
                    'title': 'React Specialization',
                    'description': 'Build dynamic web applications with React',
                    'provider': 'Coursera',
                    'url': 'https://www.coursera.org/specializations/react',
                    'duration': '6 months',
                    'price': '$49/month',
                    'rating': 4.6,
                    'recommendation_type': 'course',
                    'relevance_score': 0.92
                }
            ]
        }
        
        skill_lower = skill.lower()
        for course_skill, courses in coursera_courses.items():
            if course_skill in skill_lower or skill_lower in course_skill:
                return courses
        
        # Generic course for unmatched skills
        return [{
            'title': f'{skill.title()} Fundamentals',
            'description': f'Learn the basics of {skill}',
            'provider': 'Coursera',
            'url': f'https://www.coursera.org/search?query={skill}',
            'duration': 'Variable',
            'price': '$49/month',
            'rating': 4.5,
            'recommendation_type': 'course',
            'relevance_score': 0.7
        }]
    
    def _get_udemy_courses(self, skill: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get Udemy courses (mock implementation)"""
        
        udemy_courses = {
            'python': [
                {
                    'title': 'Complete Python Bootcamp',
                    'description': 'Go from zero to hero in Python',
                    'provider': 'Udemy',
                    'url': 'https://www.udemy.com/course/complete-python-bootcamp/',
                    'duration': '22 hours',
                    'price': '$84.99',
                    'rating': 4.6,
                    'recommendation_type': 'course',
                    'relevance_score': 0.90
                }
            ],
            'javascript': [
                {
                    'title': 'The Complete JavaScript Course',
                    'description': 'Modern JavaScript from beginning to advanced',
                    'provider': 'Udemy',
                    'url': 'https://www.udemy.com/course/the-complete-javascript-course/',
                    'duration': '69 hours',
                    'price': '$84.99',
                    'rating': 4.7,
                    'recommendation_type': 'course',
                    'relevance_score': 0.93
                }
            ],
            'aws': [
                {
                    'title': 'AWS Certified Solutions Architect',
                    'description': 'Complete AWS SAA certification course',
                    'provider': 'Udemy',
                    'url': 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
                    'duration': '65 hours',
                    'price': '$84.99',
                    'rating': 4.5,
                    'recommendation_type': 'certification',
                    'relevance_score': 0.88
                }
            ]
        }
        
        skill_lower = skill.lower()
        for course_skill, courses in udemy_courses.items():
            if course_skill in skill_lower or skill_lower in course_skill:
                return courses
        
        return [{
            'title': f'{skill.title()} Complete Course',
            'description': f'Master {skill} with hands-on projects',
            'provider': 'Udemy',
            'url': f'https://www.udemy.com/courses/search/?q={skill}',
            'duration': 'Variable',
            'price': '$84.99',
            'rating': 4.4,
            'recommendation_type': 'course',
            'relevance_score': 0.7
        }]
    
    def _get_youtube_courses(self, skill: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Get YouTube course recommendations"""
        
        youtube_courses = {
            'python': [
                {
                    'title': 'Python Tutorial for Beginners - Programming with Mosh',
                    'description': 'Free comprehensive Python tutorial',
                    'provider': 'YouTube',
                    'url': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                    'duration': '6 hours',
                    'price': 'Free',
                    'rating': 4.8,
                    'recommendation_type': 'tutorial',
                    'relevance_score': 0.85
                }
            ],
            'react': [
                {
                    'title': 'React Tutorial for Beginners - Traversy Media',
                    'description': 'Learn React.js in this crash course',
                    'provider': 'YouTube',
                    'url': 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
                    'duration': '1.5 hours',
                    'price': 'Free',
                    'rating': 4.7,
                    'recommendation_type': 'tutorial',
                    'relevance_score': 0.82
                }
            ]
        }
        
        skill_lower = skill.lower()
        for course_skill, courses in youtube_courses.items():
            if course_skill in skill_lower or skill_lower in course_skill:
                return courses
        
        return [{
            'title': f'{skill.title()} Tutorial',
            'description': f'Free {skill} tutorial and guide',
            'provider': 'YouTube',
            'url': f'https://www.youtube.com/results?search_query={skill}+tutorial',
            'duration': 'Variable',
            'price': 'Free',
            'rating': 4.3,
            'recommendation_type': 'tutorial',
            'relevance_score': 0.6
        }]
    
    def _get_free_resources(self, skill: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Get free learning resources"""
        
        free_resources = {
            'python': [
                {
                    'title': 'Python.org Official Tutorial',
                    'description': 'Official Python documentation and tutorial',
                    'provider': 'Python.org',
                    'url': 'https://docs.python.org/3/tutorial/',
                    'duration': 'Self-paced',
                    'price': 'Free',
                    'rating': 4.7,
                    'recommendation_type': 'documentation',
                    'relevance_score': 0.95
                }
            ],
            'javascript': [
                {
                    'title': 'MDN JavaScript Guide',
                    'description': 'Comprehensive JavaScript documentation',
                    'provider': 'Mozilla',
                    'url': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
                    'duration': 'Self-paced',
                    'price': 'Free',
                    'rating': 4.8,
                    'recommendation_type': 'documentation',
                    'relevance_score': 0.93
                }
            ],
            'react': [
                {
                    'title': 'React Official Documentation',
                    'description': 'Learn React from the official docs',
                    'provider': 'React',
                    'url': 'https://react.dev/learn',
                    'duration': 'Self-paced',
                    'price': 'Free',
                    'rating': 4.6,
                    'recommendation_type': 'documentation',
                    'relevance_score': 0.90
                }
            ]
        }
        
        skill_lower = skill.lower()
        for resource_skill, resources in free_resources.items():
            if resource_skill in skill_lower or skill_lower in resource_skill:
                return resources
        
        return [{
            'title': f'Free {skill.title()} Resources',
            'description': f'Collection of free {skill} learning materials',
            'provider': 'Various',
            'url': f'https://www.google.com/search?q=free+{skill}+tutorial',
            'duration': 'Variable',
            'price': 'Free',
            'rating': 4.0,
            'recommendation_type': 'resource',
            'relevance_score': 0.5
        }]
    
    def create_learning_path(self, skills: List[str]) -> Dict[str, Any]:
        """Create a structured learning path for multiple skills"""
        
        # Categorize skills by type
        skill_categories = {
            'programming': ['python', 'java', 'javascript', 'c++', 'c#'],
            'web_development': ['html', 'css', 'react', 'angular', 'vue', 'nodejs'],
            'data_science': ['python', 'r', 'machine learning', 'data analysis', 'pandas', 'numpy'],
            'cloud': ['aws', 'azure', 'google cloud', 'docker', 'kubernetes'],
            'databases': ['sql', 'mysql', 'postgresql', 'mongodb']
        }
        
        # Prioritize skills
        categorized_skills = {}
        for category, category_skills in skill_categories.items():
            categorized_skills[category] = [
                skill for skill in skills 
                if any(cat_skill in skill.lower() for cat_skill in category_skills)
            ]
        
        # Create learning path with recommended order
        learning_path = {
            'total_skills': len(skills),
            'estimated_duration': f"{len(skills) * 2}-{len(skills) * 4} weeks",
            'categories': categorized_skills,
            'recommended_order': [],
            'learning_resources': {}
        }
        
        # Suggest learning order (fundamentals first)
        priority_order = ['programming', 'web_development', 'databases', 'cloud', 'data_science']
        
        for category in priority_order:
            if categorized_skills.get(category):
                learning_path['recommended_order'].extend(categorized_skills[category])
        
        # Add uncategorized skills
        categorized_flat = [skill for cat_skills in categorized_skills.values() for skill in cat_skills]
        uncategorized = [skill for skill in skills if skill not in categorized_flat]
        learning_path['recommended_order'].extend(uncategorized)
        
        # Get resources for top priority skills
        top_skills = learning_path['recommended_order'][:5]  # Top 5 skills
        for skill in top_skills:
            learning_path['learning_resources'][skill] = self.get_recommendations_for_skill(skill, 2)
        
        return learning_path

# Global instance
course_recommender = CourseRecommender()