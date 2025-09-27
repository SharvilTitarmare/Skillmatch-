import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { dashboardAPI } from '../services/api';
import Loading from '../components/Loading';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <IconButton onClick={loadDashboardData}>
            <RefreshIcon />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  const {
    resumes = [],
    recent_analyses = [],
    total_resumes = 0,
    total_analyses = 0,
    average_match_score = 0,
  } = dashboardData || {};

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#4caf50';
    if (score >= 0.6) return '#ff9800';
    return '#f44336';
  };

  const formatScore = (score) => Math.round(score * 100);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's your career optimization overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <UploadIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Resumes
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                {total_resumes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uploaded files
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Analyses
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                {total_analyses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Job matches completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Avg. Score
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box width={60} height={60} mr={2}>
                  <CircularProgressbar
                    value={formatScore(average_match_score)}
                    text={`${formatScore(average_match_score)}%`}
                    styles={buildStyles({
                      textSize: '24px',
                      pathColor: getScoreColor(average_match_score),
                      textColor: getScoreColor(average_match_score),
                    })}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Match rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Learning
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                {recent_analyses.reduce((acc, analysis) => 
                  acc + (analysis.missing_skills?.length || 0), 0
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Skills to learn
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => navigate('/upload')}
                    sx={{ py: 2 }}
                  >
                    Upload Resume
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    onClick={() => navigate('/analyze')}
                    sx={{ py: 2 }}
                  >
                    Analyze Job Match
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Progress Overview
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Resume Upload
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={total_resumes > 0 ? 100 : 0} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Job Analysis
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={total_analyses > 0 ? Math.min(total_analyses * 20, 100) : 0} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Analyses */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Analyses
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/analyze')}
                >
                  View All
                </Button>
              </Box>

              {recent_analyses.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <AnalyticsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No analyses yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Upload a resume and analyze it against job descriptions to get started.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => navigate('/upload')}
                  >
                    Upload Resume
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {recent_analyses.slice(0, 3).map((analysis) => (
                    <Grid item xs={12} md={4} key={analysis.id}>
                      <Card variant="outlined" className="hover-card">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Analysis #{analysis.id}
                            </Typography>
                            <Chip
                              label={`${formatScore(analysis.overall_match_score)}%`}
                              color={
                                analysis.overall_match_score >= 0.8 ? 'success' :
                                analysis.overall_match_score >= 0.6 ? 'warning' : 'error'
                              }
                              size="small"
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Skills Match: {formatScore(analysis.technical_skills_score)}%
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Missing Skills: {analysis.missing_skills?.length || 0}
                          </Typography>

                          <Box mt={2}>
                            <Button
                              size="small"
                              onClick={() => navigate(`/results/${analysis.id}`)}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;