import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  updateUser: async (userData) => {
    const response = await api.put('/api/auth/me', userData);
    return response.data;
  },
};

// Resume API
export const resumeAPI = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getResumes: async () => {
    const response = await api.get('/api/resume/');
    return response.data;
  },

  getResume: async (resumeId) => {
    const response = await api.get(`/api/resume/${resumeId}`);
    return response.data;
  },

  deleteResume: async (resumeId) => {
    const response = await api.delete(`/api/resume/${resumeId}`);
    return response.data;
  },

  reprocessResume: async (resumeId) => {
    const response = await api.put(`/api/resume/${resumeId}/reprocess`);
    return response.data;
  },
};

// Analysis API
export const analysisAPI = {
  analyzeResume: async (resumeId, jobDescription) => {
    const response = await api.post('/api/analysis/analyze', {
      resume_id: resumeId,
      job_description: jobDescription,
    });
    return response.data;
  },

  getAnalyses: async (limit = 10) => {
    const response = await api.get(`/api/analysis/?limit=${limit}`);
    return response.data;
  },

  getAnalysis: async (analysisId) => {
    const response = await api.get(`/api/analysis/${analysisId}`);
    return response.data;
  },

  deleteAnalysis: async (analysisId) => {
    const response = await api.delete(`/api/analysis/${analysisId}`);
    return response.data;
  },
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendationsForAnalysis: async (analysisId) => {
    const response = await api.get(`/api/recommendations/analysis/${analysisId}`);
    return response.data;
  },

  getRecommendationsForSkill: async (skillName, limit = 5) => {
    const response = await api.get(`/api/recommendations/skills/${skillName}?limit=${limit}`);
    return response.data;
  },

  createLearningPath: async (skills) => {
    const response = await api.post('/api/recommendations/learning-path', skills);
    return response.data;
  },

  getUserRecommendations: async (limit = 50) => {
    const response = await api.get(`/api/recommendations/user/all?limit=${limit}`);
    return response.data;
  },

  getTrendingCourses: async () => {
    const response = await api.get('/api/recommendations/trending');
    return response.data;
  },

  getPopularSkills: async () => {
    const response = await api.get('/api/recommendations/popular-skills');
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboardData: async () => {
    const [resumes, analyses] = await Promise.all([
      resumeAPI.getResumes(),
      analysisAPI.getAnalyses(5),
    ]);

    const averageScore = analyses.length > 0 
      ? analyses.reduce((sum, analysis) => sum + analysis.overall_match_score, 0) / analyses.length
      : 0;

    return {
      resumes,
      recent_analyses: analyses,
      total_resumes: resumes.length,
      total_analyses: analyses.length,
      average_match_score: averageScore,
    };
  },
};

// Chat API
export const chatAPI = {
  askAdvisor: async (message, context = {}) => {
    const response = await api.post('/api/chat/ask', {
      message,
      context,
    });
    return response.data;
  },

  getSuggestions: async () => {
    const response = await api.get('/api/chat/suggestions');
    return response.data;
  },
};

export default api;