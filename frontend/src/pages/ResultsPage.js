import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as MissingIcon,
  Warning as PartialIcon,
  TrendingUp as TrendingIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { analysisAPI, recommendationsAPI } from '../services/api';
import 'react-circular-progressbar/dist/styles.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ResultsPage = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (analysisId) {
      loadAnalysisResults();
    }
  }, [analysisId]);

  const loadAnalysisResults = async () => {
    try {
      setLoading(true);
      const [analysisData, recommendationsData] = await Promise.all([
        analysisAPI.getAnalysis(analysisId),
        recommendationsAPI.getRecommendationsForAnalysis(analysisId)
      ]);
      setAnalysis(analysisData);
      setRecommendations(recommendationsData);
    } catch (err) {
      setError('Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score) => Math.round(score * 100);

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#4caf50';
    if (score >= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getSkillStatusIcon = (status) => {
    switch (status) {
      case 'found':
        return <CheckIcon color="success" />;
      case 'missing':
        return <MissingIcon color="error" />;
      case 'partial':
        return <PartialIcon color="warning" />;
      default:
        return <CheckIcon color="success" />;
    }
  };

  const getSkillStatusColor = (status) => {
    switch (status) {
      case 'found':
        return 'success';
      case 'missing':
        return 'error';
      case 'partial':
        return 'warning';
      default:
        return 'success';
    }
  };

  // Chart data preparation
  const skillsChartData = {
    labels: ['Found Skills', 'Missing Skills'],
    datasets: [
      {
        data: [
          analysis?.matching_skills?.length || 0,
          analysis?.missing_skills?.length || 0,
        ],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 0,
      },
    ],
  };

  const scoresChartData = {
    labels: ['Technical Skills', 'Experience', 'Education', 'Semantic Match'],
    datasets: [
      {
        label: 'Match Scores (%)',
        data: [
          formatScore(analysis?.technical_skills_score || 0),
          formatScore(analysis?.experience_score || 0),
          formatScore(analysis?.education_score || 0),
          formatScore(analysis?.semantic_similarity_score || 0),
        ],
        backgroundColor: ['#2196f3', '#ff9800', '#9c27b0', '#00bcd4'],
        borderRadius: 4,
      },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !analysis) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button onClick={() => navigate('/analyze')}>Go Back</Button>
        }
      >
        {error || 'Analysis not found'}
      </Alert>
    );
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="start" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Analysis Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analysis completed on {new Date(analysis.created_at).toLocaleDateString()}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={loadAnalysisResults} title="Refresh">
            <RefreshIcon />
          </IconButton>
          <IconButton 
            title="Share Results" 
            onClick={() => {
              const shareUrl = window.location.href;
              if (navigator.share) {
                navigator.share({
                  title: 'SkillMatch Analysis Results',
                  text: `Check out my job match analysis: ${formatScore(analysis.overall_match_score)}% match!`,
                  url: shareUrl,
                })
                .catch((error) => console.log('Error sharing:', error));
              } else {
                navigator.clipboard.writeText(shareUrl)
                  .then(() => alert('Link copied to clipboard!'))
                  .catch((error) => console.log('Error copying link:', error));
              }
            }}
          >
            <ShareIcon />
          </IconButton>
          <IconButton 
            title="Download Report" 
            onClick={() => {
              // Create report content
              const reportContent = `
SkillMatch Analysis Report
=========================
Date: ${new Date(analysis.created_at).toLocaleDateString()}
Overall Match: ${formatScore(analysis.overall_match_score)}%

Score Breakdown:
- Technical Skills: ${formatScore(analysis.technical_skills_score)}%
- Experience: ${formatScore(analysis.experience_score)}%
- Education: ${formatScore(analysis.education_score)}%
- Semantic Match: ${formatScore(analysis.semantic_similarity_score)}%

Matching Skills (${analysis.matching_skills?.length || 0}):
${analysis.matching_skills?.join(', ') || 'None'}

Missing Skills (${analysis.missing_skills?.length || 0}):
${analysis.missing_skills?.join(', ') || 'None'}

ATS Feedback:
${analysis.ats_feedback?.join('\n') || 'No feedback available'}

Recommendations:
${recommendations.map(rec => `- ${rec.title}: ${rec.description}`).join('\n') || 'No recommendations available'}
              `;
              
              // Create blob and download
              const blob = new Blob([reportContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `skillmatch-report-${analysisId}.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Overall Score */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', textAlign: 'center', py: 4 }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ maxWidth: 200, mx: 'auto' }}>
                <CircularProgressbar
                  value={formatScore(analysis.overall_match_score)}
                  text={`${formatScore(analysis.overall_match_score)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: '#ffffff',
                    textColor: '#ffffff',
                    trailColor: 'rgba(255,255,255,0.3)',
                  })}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                {formatScore(analysis.overall_match_score)}% Match
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                {analysis.overall_match_score >= 0.8 ? 'Excellent Match!' :
                 analysis.overall_match_score >= 0.6 ? 'Good Match' :
                 'Needs Improvement'}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Your resume shows a {formatScore(analysis.overall_match_score)}% compatibility with this job. 
                {analysis.missing_skills?.length > 0 && 
                  `Focus on developing ${analysis.missing_skills.length} missing skills to improve your match.`
                }
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Detailed Results Tabs */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Skills Analysis" icon={<AssessmentIcon />} />
            <Tab label="Score Breakdown" icon={<TrendingIcon />} />
            <Tab label="ATS Feedback" icon={<WorkIcon />} />
            <Tab label="Recommendations" icon={<SchoolIcon />} />
          </Tabs>

          {/* Skills Analysis Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Skills Distribution
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Doughnut 
                    data={skillsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Skills Comparison
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Skill</strong></TableCell>
                        <TableCell align="center"><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysis.matching_skills?.slice(0, 5).map((skill, index) => (
                        <TableRow key={index}>
                          <TableCell>{skill}</TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={<CheckIcon />}
                              label="Found"
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {analysis.missing_skills?.slice(0, 5).map((skill, index) => (
                        <TableRow key={`missing-${index}`}>
                          <TableCell>{skill}</TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={<MissingIcon />}
                              label="Missing"
                              color="error"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {(analysis.matching_skills?.length > 5 || analysis.missing_skills?.length > 5) && (
                  <Button 
                    size="small" 
                    sx={{ mt: 1 }}
                    onClick={() => {/* Show all skills modal */}}
                  >
                    View All Skills
                  </Button>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Score Breakdown Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Detailed Score Breakdown
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={scoresChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Score Details
                </Typography>
                
                {[
                  { label: 'Technical Skills', score: analysis.technical_skills_score, icon: '💻' },
                  { label: 'Experience', score: analysis.experience_score, icon: '💼' },
                  { label: 'Education', score: analysis.education_score, icon: '🎓' },
                  { label: 'Semantic Match', score: analysis.semantic_similarity_score, icon: '🧠' },
                ].map((item, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.icon} {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatScore(item.score)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={formatScore(item.score)} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getScoreColor(item.score)
                        }
                      }}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          </TabPanel>

          {/* ATS Feedback Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              ATS Optimization Recommendations
            </Typography>
            
            {analysis.ats_feedback && analysis.ats_feedback.length > 0 ? (
              <List>
                {analysis.ats_feedback.map((feedback, index) => (
                  <ListItem key={index} sx={{ bgcolor: 'grey.50', mb: 1, borderRadius: 1 }}>
                    <ListItemIcon>
                      <TrendingIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feedback}
                      secondary="Implementing this suggestion will improve your ATS compatibility"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                No specific ATS recommendations available. Your resume appears to be well-optimized!
              </Alert>
            )}
          </TabPanel>

          {/* Recommendations Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Learning Recommendations
            </Typography>
            
            {recommendations.length > 0 ? (
              <Grid container spacing={3}>
                {recommendations.slice(0, 6).map((rec, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined" className="hover-card">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          {rec.title}
                        </Typography>
                        <Chip 
                          label={rec.skill_name} 
                          size="small" 
                          color="primary" 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {rec.description?.substring(0, 100)}...
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {rec.provider} • {rec.duration}
                          </Typography>
                          <Button 
                            size="small" 
                            href={rec.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Learn More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                Great job! Your skills align well with this position. No immediate learning recommendations.
              </Alert>
            )}
            
            {recommendations.length > 6 && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/recommendations/${analysisId}`)}
                >
                  View All Recommendations
                </Button>
              </Box>
            )}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/analyze')}
          startIcon={<AssessmentIcon />}
        >
          Analyze Another Job
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/dashboard')}
          startIcon={<TrendingIcon />}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsPage;