import re
from typing import List, Dict, Any, Set, Tuple
from collections import Counter
import json
from pathlib import Path

# Load spaCy model
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except (ImportError, OSError):
    print("spaCy English model not found. Using simplified text processing.")
    nlp = None

class SkillExtractor:
    def __init__(self):
        self.technical_skills = self._load_technical_skills()
        self.soft_skills = self._load_soft_skills()
        self.programming_languages = self._load_programming_languages()
        self.frameworks_tools = self._load_frameworks_tools()
        
    def _load_technical_skills(self) -> Set[str]:
        """Load predefined technical skills"""
        return {
            # Programming Languages
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'c', 'go', 'rust',
            'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'shell',
            'bash', 'powershell', 'sql', 'html', 'css', 'xml', 'json', 'yaml',
            
            # Web Technologies
            'react', 'angular', 'vue', 'nodejs', 'express', 'fastapi', 'django', 'flask',
            'spring', 'asp.net', 'bootstrap', 'tailwind', 'jquery', 'webpack', 'vite',
            
            # Databases
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
            'oracle', 'sql server', 'dynamodb', 'cassandra', 'neo4j',
            
            # Cloud & DevOps
            'aws', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'jenkins',
            'terraform', 'ansible', 'puppet', 'chef', 'vagrant', 'git', 'github',
            'gitlab', 'bitbucket', 'circleci', 'travis ci',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'artificial intelligence', 'data science',
            'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras',
            'matplotlib', 'seaborn', 'plotly', 'jupyter', 'apache spark', 'hadoop',
            
            # Mobile Development
            'ios', 'android', 'react native', 'flutter', 'xamarin', 'ionic',
            
            # Testing
            'unit testing', 'integration testing', 'test driven development', 'tdd',
            'pytest', 'junit', 'jest', 'selenium', 'cypress',
            
            # Others
            'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'kanban',
            'ci/cd', 'linux', 'unix', 'windows', 'macos'
        }
    
    def _load_soft_skills(self) -> Set[str]:
        """Load predefined soft skills"""
        return {
            'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
            'analytical thinking', 'creativity', 'innovation', 'adaptability', 'flexibility',
            'time management', 'project management', 'organization', 'attention to detail',
            'multitasking', 'collaboration', 'interpersonal skills', 'presentation skills',
            'public speaking', 'written communication', 'negotiation', 'conflict resolution',
            'emotional intelligence', 'empathy', 'patience', 'persistence', 'reliability',
            'accountability', 'initiative', 'self-motivation', 'work ethic', 'professionalism'
        }
    
    def _load_programming_languages(self) -> Set[str]:
        """Load programming languages with common variations"""
        return {
            'python', 'java', 'javascript', 'js', 'typescript', 'ts', 'c++', 'cpp',
            'c#', 'csharp', 'c', 'go', 'golang', 'rust', 'ruby', 'php', 'swift',
            'kotlin', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash', 'powershell',
            'sql', 'html', 'css', 'xml', 'json', 'yaml', 'markdown'
        }
    
    def _load_frameworks_tools(self) -> Set[str]:
        """Load frameworks and tools"""
        return {
            'react', 'reactjs', 'angular', 'angularjs', 'vue', 'vuejs', 'nodejs', 'node.js',
            'express', 'expressjs', 'fastapi', 'django', 'flask', 'spring', 'spring boot',
            'asp.net', 'bootstrap', 'tailwind', 'tailwindcss', 'jquery', 'webpack', 'vite',
            'docker', 'kubernetes', 'k8s', 'jenkins', 'terraform', 'ansible', 'git',
            'github', 'gitlab', 'pandas', 'numpy', 'scikit-learn', 'sklearn', 'tensorflow',
            'pytorch', 'keras', 'matplotlib', 'seaborn', 'plotly', 'jupyter'
        }
    
    def extract_skills_pattern_matching(self, text: str) -> Dict[str, List[str]]:
        """Extract skills using pattern matching"""
        text_lower = text.lower()
        
        found_skills = {
            'technical': [],
            'soft': [],
            'programming': [],
            'frameworks_tools': []
        }
        
        # Extract technical skills
        for skill in self.technical_skills:
            if self._find_skill_in_text(skill, text_lower):
                found_skills['technical'].append(skill)
        
        # Extract soft skills
        for skill in self.soft_skills:
            if self._find_skill_in_text(skill, text_lower):
                found_skills['soft'].append(skill)
        
        # Extract programming languages
        for skill in self.programming_languages:
            if self._find_skill_in_text(skill, text_lower):
                found_skills['programming'].append(skill)
        
        # Extract frameworks and tools
        for skill in self.frameworks_tools:
            if self._find_skill_in_text(skill, text_lower):
                found_skills['frameworks_tools'].append(skill)
        
        # Remove duplicates and sort
        for category in found_skills:
            found_skills[category] = sorted(list(set(found_skills[category])))
        
        return found_skills
    
    def _find_skill_in_text(self, skill: str, text: str) -> bool:
        """Find skill in text with word boundaries"""
        # Handle multi-word skills
        if ' ' in skill:
            return skill in text
        else:
            # Use word boundaries for single words
            pattern = r'\b' + re.escape(skill) + r'\b'
            return bool(re.search(pattern, text, re.IGNORECASE))
    
    def extract_skills_nlp(self, text: str) -> Dict[str, List[str]]:
        """Extract skills using NLP (spaCy)"""
        if not nlp:
            return {"error": "spaCy model not available"}
        
        doc = nlp(text)
        
        # Extract named entities that might be technologies
        tech_entities = []
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "GPE"]:  # Organizations, products, places
                # Filter for technology-related terms
                ent_text = ent.text.lower()
                if any(tech in ent_text for tech in ['tech', 'soft', 'system', 'platform', 'framework']):
                    tech_entities.append(ent.text)
        
        # Extract noun phrases that might be skills
        skill_candidates = []
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.lower().strip()
            # Filter relevant noun phrases
            if (len(chunk_text.split()) <= 3 and 
                any(word in chunk_text for word in ['development', 'programming', 'analysis', 'management', 'design'])):
                skill_candidates.append(chunk_text)
        
        return {
            'tech_entities': tech_entities,
            'skill_candidates': skill_candidates
        }
    
    def extract_certifications(self, text: str) -> List[str]:
        """Extract certifications and professional qualifications"""
        certifications = []
        
        # Common certification patterns
        cert_patterns = [
            r'\b(?:AWS|Amazon)\s+(?:Certified\s+)?(?:Solutions\s+Architect|Developer|SysOps|DevOps)\b',
            r'\bMicrosoft\s+(?:Certified\s+)?(?:Azure|Office|SQL)\s+[\w\s]+\b',
            r'\bGoogle\s+(?:Cloud\s+)?(?:Certified\s+)?[\w\s]+\b',
            r'\bCisco\s+(?:Certified\s+)?(?:CCNA|CCNP|CCIE)\b',
            r'\bCompTIA\s+(?:A\+|Network\+|Security\+|Linux\+)\b',
            r'\b(?:PMP|PRINCE2|Scrum\s+Master|Product\s+Owner)\b',
            r'\b(?:CPA|CFA|FRM|CRM)\b',
            r'\b(?:Six\s+Sigma|Lean\s+Six\s+Sigma)\s+(?:Green\s+Belt|Black\s+Belt)\b'
        ]
        
        for pattern in cert_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            certifications.extend(matches)
        
        return list(set(certifications))
    
    def extract_years_experience(self, text: str) -> Dict[str, Any]:
        """Extract years of experience information"""
        experience_data = {
            'total_years': None,
            'skill_years': [],
            'experience_mentions': []
        }
        
        # Patterns for years of experience
        year_patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'(\d+)\+?\s*(?:yrs?|years?)\s+(?:of\s+)?(?:experience|exp)',
            r'experience\s+(?:of\s+)?(\d+)\+?\s*(?:yrs?|years?)',
            r'(\d+)\+?\s*years?\s+(?:in|with|of)',
            r'(\d+)\+?\s*(?:yrs?|years?)\s+(?:in|with|of)'
        ]
        
        for pattern in year_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                years = [int(match) for match in matches if match.isdigit()]
                if years:
                    experience_data['total_years'] = max(years)
                    experience_data['experience_mentions'].extend(years)
        
        # Extract skill-specific experience
        skill_exp_patterns = [
            r'(\d+)\+?\s*(?:yrs?|years?)\s+(?:of\s+)?(\w+(?:\s+\w+)*)',
            r'(\w+(?:\s+\w+)*)\s*[:\-]\s*(\d+)\+?\s*(?:yrs?|years?)'
        ]
        
        for pattern in skill_exp_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(match) == 2:
                    years, skill = match
                    if years.isdigit():
                        experience_data['skill_years'].append({
                            'skill': skill.strip(),
                            'years': int(years)
                        })
        
        return experience_data
    
    def combine_extracted_skills(self, pattern_skills: Dict, nlp_skills: Dict) -> Dict[str, Any]:
        """Combine skills from different extraction methods"""
        combined = {
            'all_skills': [],
            'technical_skills': pattern_skills.get('technical', []),
            'soft_skills': pattern_skills.get('soft', []),
            'programming_languages': pattern_skills.get('programming', []),
            'frameworks_tools': pattern_skills.get('frameworks_tools', []),
            'nlp_entities': nlp_skills.get('tech_entities', []),
            'skill_candidates': nlp_skills.get('skill_candidates', [])
        }
        
        # Create comprehensive skill list
        all_skills = []
        for category in ['technical_skills', 'programming_languages', 'frameworks_tools']:
            all_skills.extend(combined[category])
        
        combined['all_skills'] = sorted(list(set(all_skills)))
        
        return combined
    
    def extract_all_skills(self, text: str) -> Dict[str, Any]:
        """Main method to extract all skills from text"""
        # Pattern-based extraction
        pattern_skills = self.extract_skills_pattern_matching(text)
        
        # NLP-based extraction
        nlp_skills = self.extract_skills_nlp(text)
        
        # Extract certifications
        certifications = self.extract_certifications(text)
        
        # Extract experience data
        experience_data = self.extract_years_experience(text)
        
        # Combine all results
        result = self.combine_extracted_skills(pattern_skills, nlp_skills)
        result['certifications'] = certifications
        result['experience'] = experience_data
        
        return result

# Global instance
skill_extractor = SkillExtractor()