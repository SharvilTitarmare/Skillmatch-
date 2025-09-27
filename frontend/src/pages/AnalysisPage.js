import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Paper,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Work as WorkIcon,
  School as EducationIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resumeAPI, analysisAPI } from '../services/api';

const steps = ['Select Resume', 'Enter Job Details', 'Run Analysis'];

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeIdFromUrl = searchParams.get('resumeId');

  const [activeStep, setActiveStep] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(resumeIdFromUrl || '');
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    raw_text: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
    if (resumeIdFromUrl) {
      setActiveStep(1);
    }
  }, [resumeIdFromUrl]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeAPI.getResumes();
      setResumes(data);
    } catch (err) {
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedResume) {
      setError('Please select a resume first');
      return;
    }
    if (activeStep === 1 && !jobData.raw_text.trim()) {
      setError('Please enter a job description');
      return;
    }
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedResume || !jobData.raw_text.trim()) {
      setError('Please complete all steps before analyzing');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const result = await analysisAPI.analyzeResume(parseInt(selectedResume), jobData);
      // Navigate to results page
      navigate(`/results/${result.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedResumeData = resumes.find(r => r.id.toString() === selectedResume);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Select Resume to Analyze
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : resumes.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <WorkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No resumes found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    You need to upload a resume before you can analyze it.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/upload')}
                  >
                    Upload Resume
                  </Button>
                </Paper>
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Select Resume</InputLabel>
                  <Select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    label="Select Resume"
                  >
                    {resumes.map((resume) => (
                      <MenuItem key={resume.id} value={resume.id.toString()}>
                        <Box>
                          <Typography variant="subtitle1">
                            {resume.filename}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Uploaded: {new Date(resume.created_at).toLocaleDateString()}
                            {resume.extracted_skills && (
                              <Chip 
                                label={`${resume.extracted_skills.length} skills`} 
                                size="small" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {selectedResumeData && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="primary.dark" gutterBottom>
                    Selected Resume Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>File:</strong> {selectedResumeData.filename}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {selectedResumeData.file_type.toUpperCase()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Skills:</strong> {selectedResumeData.extracted_skills?.length || 0}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Uploaded:</strong> {new Date(selectedResumeData.created_at).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Enter Job Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={jobData.company}
                    onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                    placeholder="e.g., Google, Microsoft"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    label="Job Description *"
                    value={jobData.raw_text}
                    onChange={(e) => setJobData({ ...jobData, raw_text: e.target.value })}
                    placeholder="Paste the complete job description here...\n\nInclude:\n• Job responsibilities\n• Required skills and qualifications\n• Experience requirements\n• Education requirements\n• Any specific technologies or tools"
                    required
                  />
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Tip:</strong> Include the complete job description for better analysis. 
                  The more detailed the description, the more accurate the skill matching will be.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Review & Analyze
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      📄 Resume Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>File:</strong> {selectedResumeData?.filename}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Skills Extracted:</strong> {selectedResumeData?.extracted_skills?.length || 0}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Upload Date:</strong> {selectedResumeData && new Date(selectedResumeData.created_at).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      💼 Job Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>Position:</strong> {jobData.title || 'Not specified'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Company:</strong> {jobData.company || 'Not specified'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description Length:</strong> {jobData.raw_text.length} characters
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Ready to Analyze
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Our AI will analyze your resume against this job description and provide:
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingIcon color="primary" sx={{ mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Match Score
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon color="success" sx={{ mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Skill Analysis
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <EducationIcon color="info" sx={{ mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Learning Recommendations
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <WorkIcon color="warning" sx={{ mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ATS Optimization
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  startIcon={analyzing ? <CircularProgress size={20} /> : <AnalyticsIcon />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {analyzing ? 'Analyzing...' : 'Start Analysis'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Job Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Analyze how well your resume matches a specific job description and get personalized recommendations.
      </Typography>

      {/* Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Step Content */}
      <Box sx={{ mb: 4 }}>
        {getStepContent(activeStep)}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading || (activeStep === 0 && resumes.length === 0)}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AnalysisPage;