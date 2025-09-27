import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, dashboardAPI } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyReports: false,
    skillRecommendations: true,
    jobAlerts: false,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardAPI.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await authAPI.updateUser(profileData);
      updateUser(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setProfileData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({ ...prev, [setting]: event.target.checked }));
  };

  const getATSScore = () => {
    if (!dashboardData?.recent_analyses?.length) return 0;
    const latestAnalysis = dashboardData.recent_analyses[0];
    // Calculate ATS score based on various factors
    const baseScore = latestAnalysis.overall_match_score * 0.4;
    const keywordScore = (latestAnalysis.matching_skills?.length || 0) / 10 * 0.3;
    const feedbackScore = latestAnalysis.ats_feedback?.length ? (5 - latestAnalysis.ats_feedback.length) / 5 * 0.3 : 0.3;
    return Math.min(1, baseScore + keywordScore + feedbackScore);
  };

  const getATSRecommendations = () => {
    const recommendations = [
      {
        title: 'Use Industry Keywords',
        description: 'Include relevant keywords from job descriptions in your resume.',
        priority: 'high',
        completed: dashboardData?.average_match_score > 0.7
      },
      {
        title: 'Standard Section Headers',
        description: 'Use standard headers like "Experience", "Education", "Skills".',
        priority: 'medium',
        completed: true
      },
      {
        title: 'Quantify Achievements',
        description: 'Include numbers, percentages, and metrics in your accomplishments.',
        priority: 'high',
        completed: false
      },
      {
        title: 'Consistent Formatting',
        description: 'Maintain consistent fonts, spacing, and bullet points.',
        priority: 'medium',
        completed: true
      },
      {
        title: 'Skills Section',
        description: 'Include a dedicated skills section with relevant technologies.',
        priority: 'high',
        completed: dashboardData?.resumes?.some(r => r.extracted_skills?.length > 0)
      }
    ];
    return recommendations;
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Profile & Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account information and optimize your resume for ATS systems.
      </Typography>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Profile" icon={<PersonIcon />} />
          <Tab label="ATS Optimization" icon={<AssessmentIcon />} />
          <Tab label="Settings" icon={<SettingsIcon />} />
        </Tabs>
      </Paper>

      {/* Profile Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={
                    {
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '3rem'
                    }
                  }
                >
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {user?.full_name || user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Chip 
                  label="Active User" 
                  color="success" 
                  variant="outlined" 
                  sx={{ mt: 1 }}
                />
                
                {dashboardData && (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                      <Grid item xs={4}>
                        <Typography variant="h6" color="primary">
                          {dashboardData.total_resumes}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Resumes
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" color="primary">
                          {dashboardData.total_analyses}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Analyses
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" color="primary">
                          {Math.round((dashboardData.average_match_score || 0) * 100)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Avg Score
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Profile Information
                </Typography>
                
                <form onSubmit={handleProfileUpdate}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profileData.full_name}
                        onChange={handleInputChange('full_name')}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={profileData.username}
                        onChange={handleInputChange('username')}
                        InputProps={
                          {
                            startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                          }
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange('email')}
                        InputProps={
                          {
                            startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                          }
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                          {loading ? 'Updating...' : 'Update Profile'}
                        </Button>
                        <Button variant="outlined" type="button">
                          Change Password
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ATS Optimization Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📊 ATS Compatibility Score
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: '100%', mr: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={getATSScore() * 100}
                      sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getATSScore() >= 0.8 ? '#4caf50' : getATSScore() >= 0.6 ? '#ff9800' : '#f44336'
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {Math.round(getATSScore() * 100)}%
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {getATSScore() >= 0.8 ? 'Excellent! Your resume is well-optimized for ATS systems.' :
                   getATSScore() >= 0.6 ? 'Good compatibility. A few improvements could help.' :
                   'Your resume needs optimization for better ATS compatibility.'}
                </Typography>
                
                <Button variant="outlined" size="small">
                  Learn More About ATS
                </Button>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  🎯 Quick Stats
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                      <Typography variant="h4" color="primary.dark">
                        {dashboardData?.total_analyses || 0}
                      </Typography>
                      <Typography variant="body2" color="primary.dark">
                        Jobs Analyzed
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                      <Typography variant="h4" color="success.dark">
                        {Math.round((dashboardData?.average_match_score || 0) * 100)}%
                      </Typography>
                      <Typography variant="body2" color="success.dark">
                        Avg Match Score
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  ✅ ATS Optimization Checklist
                </Typography>
                
                <List>
                  {getATSRecommendations().map((rec, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {rec.completed ? (
                          <CheckIcon color="success" />
                        ) : (
                          <WarningIcon color={rec.priority === 'high' ? 'error' : 'warning'} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: rec.completed ? 400 : 600,
                                textDecoration: rec.completed ? 'line-through' : 'none',
                                color: rec.completed ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {rec.title}
                            </Typography>
                            <Chip 
                              label={rec.priority} 
                              size="small" 
                              color={rec.priority === 'high' ? 'error' : 'warning'}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={rec.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Notification Preferences
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications about analysis results and recommendations"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
                    />
                  }
                  label=""
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <TrendingIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Weekly Reports"
                  secondary="Get weekly summaries of your progress and new opportunities"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.weeklyReports}
                      onChange={handleSettingChange('weeklyReports')}
                    />
                  }
                  label=""
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Skill Recommendations"
                  secondary="Receive personalized course and learning recommendations"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.skillRecommendations}
                      onChange={handleSettingChange('skillRecommendations')}
                    />
                  }
                  label=""
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Job Alerts"
                  secondary="Get notified about job opportunities that match your skills"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.jobAlerts}
                      onChange={handleSettingChange('jobAlerts')}
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 3 }} />
            
            <Button variant="contained" sx={{ mr: 2 }}>
              Save Settings
            </Button>
            <Button variant="outlined">
              Reset to Default
            </Button>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default ProfilePage;