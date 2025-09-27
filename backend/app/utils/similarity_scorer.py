import re
from typing import Dict, List, Any, Tuple
from collections import Counter

# Import ML libraries
try:
    import numpy as np
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("ML libraries not available. Using simplified text matching.")

# Sentence transformer placeholder
sentence_model = None

class SimilarityScorer:
    def __init__(self):
        if ML_AVAILABLE:
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=5000,
                stop_words='english',
                ngram_range=(1, 2),
                lowercase=True,
                min_df=1,
                max_df=0.95
            )
        else:
            self.tfidf_vectorizer = None
        
    def preprocess_text(self, text: str) -> str:
        """Preprocess text for analysis"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)]', ' ', text)
        
        return text.strip()
    
    def calculate_keyword_overlap(self, resume_text: str, job_text: str) -> Dict[str, Any]:
        """Calculate keyword overlap between resume and job description"""
        resume_clean = self.preprocess_text(resume_text)
        job_clean = self.preprocess_text(job_text)
        
        if not resume_clean or not job_clean:
            return {
                'overlap_score': 0.0,
                'matching_keywords': [],
                'missing_keywords': [],
                'keyword_frequency': {}
            }
        
        if not ML_AVAILABLE or not self.tfidf_vectorizer:
            return self._simple_keyword_overlap(resume_clean, job_clean)
        
        # Fit TF-IDF on both texts
        corpus = [resume_clean, job_clean]
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(corpus)
        
        # Get feature names (keywords)
        feature_names = self.tfidf_vectorizer.get_feature_names_out()
        
        # Get TF-IDF scores for each document
        resume_scores = tfidf_matrix[0].toarray().flatten()
        job_scores = tfidf_matrix[1].toarray().flatten()
        
        # Find keywords present in both documents
        matching_keywords = []
        missing_keywords = []
        keyword_frequency = {}
        
        for i, keyword in enumerate(feature_names):
            resume_score = resume_scores[i]
            job_score = job_scores[i]
            
            keyword_frequency[keyword] = {
                'resume_score': float(resume_score),
                'job_score': float(job_score)
            }
            
            if resume_score > 0 and job_score > 0:
                matching_keywords.append({
                    'keyword': keyword,
                    'resume_score': float(resume_score),
                    'job_score': float(job_score),
                    'combined_score': float(resume_score * job_score)
                })
            elif job_score > 0 and resume_score == 0:
                missing_keywords.append({
                    'keyword': keyword,
                    'job_score': float(job_score),
                    'importance': 'high' if job_score > 0.1 else 'medium' if job_score > 0.05 else 'low'
                })
        
        # Sort by importance
        matching_keywords.sort(key=lambda x: x['combined_score'], reverse=True)
        missing_keywords.sort(key=lambda x: x['job_score'], reverse=True)
        
        # Calculate overall overlap score
        if len(feature_names) > 0:
            overlap_score = len([k for k in matching_keywords]) / len(feature_names)
        else:
            overlap_score = 0.0
        
        return {
            'overlap_score': float(overlap_score),
            'matching_keywords': matching_keywords[:20],  # Top 20
            'missing_keywords': missing_keywords[:20],    # Top 20
            'keyword_frequency': dict(list(keyword_frequency.items())[:50])  # Top 50
        }
    
    def _simple_keyword_overlap(self, resume_text: str, job_text: str) -> Dict[str, Any]:
        """Simple keyword overlap when ML libraries are not available"""
        # Split into words
        resume_words = set(word.lower().strip() for word in re.findall(r'\b\w+\b', resume_text) if len(word) > 2)
        job_words = set(word.lower().strip() for word in re.findall(r'\b\w+\b', job_text) if len(word) > 2)
        
        # Find common and missing words
        common_words = resume_words.intersection(job_words)
        missing_words = job_words - resume_words
        
        # Calculate overlap score
        overlap_score = len(common_words) / len(job_words) if job_words else 0.0
        
        # Format results
        matching_keywords = [{'keyword': word, 'resume_score': 1.0, 'job_score': 1.0, 'combined_score': 1.0} 
                           for word in sorted(common_words)[:20]]
        missing_keywords = [{'keyword': word, 'job_score': 1.0, 'importance': 'medium'} 
                          for word in sorted(missing_words)[:20]]
        
        return {
            'overlap_score': float(overlap_score),
            'matching_keywords': matching_keywords,
            'missing_keywords': missing_keywords,
            'keyword_frequency': {}
        }
    
    def calculate_tfidf_similarity(self, resume_text: str, job_text: str) -> float:
        """Calculate TF-IDF cosine similarity"""
        resume_clean = self.preprocess_text(resume_text)
        job_clean = self.preprocess_text(job_text)
        
        if not resume_clean or not job_clean:
            return 0.0
        
        if not ML_AVAILABLE or not self.tfidf_vectorizer:
            return self._simple_text_similarity(resume_clean, job_clean)
        
        # Create TF-IDF vectors
        corpus = [resume_clean, job_clean]
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(corpus)
        
        # Calculate cosine similarity
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        
        return float(similarity_matrix[0][0])
    
    def _simple_text_similarity(self, text1: str, text2: str) -> float:
        """Simple text similarity when ML libraries are not available"""
        words1 = set(word.lower() for word in re.findall(r'\b\w+\b', text1) if len(word) > 2)
        words2 = set(word.lower() for word in re.findall(r'\b\w+\b', text2) if len(word) > 2)
        
        if not words1 or not words2:
            return 0.0
        
        # Jaccard similarity
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        return intersection / union if union > 0 else 0.0
    
    def calculate_semantic_similarity(self, resume_text: str, job_text: str) -> Dict[str, Any]:
        """Calculate semantic similarity using sentence transformers"""
        if not sentence_model:
            return {
                'overall_similarity': 0.0,
                'sentence_similarities': [],
                'error': 'Sentence transformer model not available'
            }
        
        resume_clean = self.preprocess_text(resume_text)
        job_clean = self.preprocess_text(job_text)
        
        if not resume_clean or not job_clean:
            return {
                'overall_similarity': 0.0,
                'sentence_similarities': []
            }
        
        # Split texts into sentences
        resume_sentences = self._split_into_sentences(resume_clean)
        job_sentences = self._split_into_sentences(job_clean)
        
        if not resume_sentences or not job_sentences:
            return {
                'overall_similarity': 0.0,
                'sentence_similarities': []
            }
        
        # Calculate embeddings
        resume_embeddings = sentence_model.encode(resume_sentences)
        job_embeddings = sentence_model.encode(job_sentences)
        
        # Calculate overall similarity (mean of document embeddings)
        resume_doc_embedding = np.mean(resume_embeddings, axis=0).reshape(1, -1)
        job_doc_embedding = np.mean(job_embeddings, axis=0).reshape(1, -1)
        
        overall_similarity = float(cosine_similarity(resume_doc_embedding, job_doc_embedding)[0][0])
        
        # Calculate sentence-level similarities
        sentence_similarities = []
        for i, resume_sent in enumerate(resume_sentences[:10]):  # Limit to first 10 sentences
            max_sim = 0.0
            best_match = ""
            
            for j, job_sent in enumerate(job_sentences):
                sim = float(cosine_similarity(
                    resume_embeddings[i].reshape(1, -1),
                    job_embeddings[j].reshape(1, -1)
                )[0][0])
                
                if sim > max_sim:
                    max_sim = sim
                    best_match = job_sent[:100] + "..." if len(job_sent) > 100 else job_sent
            
            if max_sim > 0.3:  # Only include meaningful similarities
                sentence_similarities.append({
                    'resume_sentence': resume_sent[:100] + "..." if len(resume_sent) > 100 else resume_sent,
                    'job_sentence': best_match,
                    'similarity': max_sim
                })
        
        return {
            'overall_similarity': overall_similarity,
            'sentence_similarities': sorted(sentence_similarities, key=lambda x: x['similarity'], reverse=True)[:10]
        }
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
        return sentences
    
    def calculate_skill_match_score(self, resume_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
        """Calculate skill-specific match score"""
        if not resume_skills or not job_skills:
            return {
                'match_score': 0.0,
                'matched_skills': [],
                'missing_skills': job_skills if job_skills else [],
                'extra_skills': resume_skills if resume_skills else []
            }
        
        # Normalize skills (lowercase, strip)
        resume_skills_norm = [skill.lower().strip() for skill in resume_skills]
        job_skills_norm = [skill.lower().strip() for skill in job_skills]
        
        # Find exact matches
        matched_skills = list(set(resume_skills_norm) & set(job_skills_norm))
        missing_skills = list(set(job_skills_norm) - set(resume_skills_norm))
        extra_skills = list(set(resume_skills_norm) - set(job_skills_norm))
        
        # Calculate match score
        match_score = len(matched_skills) / len(job_skills_norm) if job_skills_norm else 0.0
        
        return {
            'match_score': float(match_score),
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'extra_skills': extra_skills,
            'total_job_skills': len(job_skills_norm),
            'total_resume_skills': len(resume_skills_norm),
            'matched_count': len(matched_skills)
        }
    
    def calculate_experience_score(self, resume_experience: Dict, job_requirements: Dict) -> Dict[str, Any]:
        """Calculate experience match score"""
        score_data = {
            'experience_score': 0.0,
            'years_match': False,
            'position_match': False,
            'industry_match': False,
            'details': {}
        }
        
        # Check years of experience
        resume_years = resume_experience.get('total_years', 0)
        required_years = job_requirements.get('min_years', 0)
        
        if required_years > 0:
            if resume_years >= required_years:
                score_data['years_match'] = True
                score_data['experience_score'] += 0.4
            else:
                # Partial credit for having some experience
                score_data['experience_score'] += 0.2 * (resume_years / required_years)
        else:
            score_data['experience_score'] += 0.4  # No requirement specified
        
        score_data['details']['resume_years'] = resume_years
        score_data['details']['required_years'] = required_years
        
        # Check position/role relevance (simplified)
        resume_positions = resume_experience.get('positions', [])
        required_positions = job_requirements.get('positions', [])
        
        if required_positions and resume_positions:
            position_overlap = any(
                any(req_pos.lower() in res_pos.lower() for req_pos in required_positions)
                for res_pos in resume_positions
            )
            if position_overlap:
                score_data['position_match'] = True
                score_data['experience_score'] += 0.3
        else:
            score_data['experience_score'] += 0.3  # No specific requirements
        
        # Industry match (simplified)
        score_data['experience_score'] += 0.3  # Default assumption
        
        # Cap at 1.0
        score_data['experience_score'] = min(1.0, score_data['experience_score'])
        
        return score_data
    
    def calculate_overall_match(
        self,
        resume_text: str,
        job_text: str,
        resume_skills: List[str],
        job_skills: List[str],
        resume_experience: Dict,
        job_requirements: Dict
    ) -> Dict[str, Any]:
        """Calculate comprehensive match score"""
        
        # TF-IDF similarity
        tfidf_score = self.calculate_tfidf_similarity(resume_text, job_text)
        
        # Keyword overlap
        keyword_analysis = self.calculate_keyword_overlap(resume_text, job_text)
        
        # Semantic similarity
        semantic_analysis = self.calculate_semantic_similarity(resume_text, job_text)
        
        # Skill match
        skill_analysis = self.calculate_skill_match_score(resume_skills, job_skills)
        
        # Experience match
        experience_analysis = self.calculate_experience_score(resume_experience, job_requirements)
        
        # Calculate weighted overall score
        weights = {
            'tfidf': 0.25,
            'keywords': 0.20,
            'semantic': 0.20,
            'skills': 0.25,
            'experience': 0.10
        }
        
        overall_score = (
            tfidf_score * weights['tfidf'] +
            keyword_analysis['overlap_score'] * weights['keywords'] +
            semantic_analysis['overall_similarity'] * weights['semantic'] +
            skill_analysis['match_score'] * weights['skills'] +
            experience_analysis['experience_score'] * weights['experience']
        )
        
        return {
            'overall_match_score': float(overall_score),
            'component_scores': {
                'tfidf_similarity': float(tfidf_score),
                'keyword_overlap': float(keyword_analysis['overlap_score']),
                'semantic_similarity': float(semantic_analysis['overall_similarity']),
                'skill_match': float(skill_analysis['match_score']),
                'experience_match': float(experience_analysis['experience_score'])
            },
            'detailed_analysis': {
                'keyword_analysis': keyword_analysis,
                'semantic_analysis': semantic_analysis,
                'skill_analysis': skill_analysis,
                'experience_analysis': experience_analysis
            }
        }

# Global instance
similarity_scorer = SimilarityScorer()