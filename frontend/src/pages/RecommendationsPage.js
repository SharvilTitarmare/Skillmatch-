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
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  Rating,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  MonetizationOn as PriceIcon,
  Launch as LaunchIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { recommendationsAPI } from '../services/api';

const RecommendationsPage = () => {
  const { analysisId } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');

  useEffect(() => {
    loadRecommendations();
    loadTrendingCourses();
  }, [analysisId]);

  const loadRecommendations = async () => {
    if (!analysisId) return;
    
    try {
      setLoading(true);
      const data = await recommendationsAPI.getRecommendationsForAnalysis(analysisId);
      setRecommendations(data);
    } catch (err) {
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingCourses = async () => {
    try {
      const data = await recommendationsAPI.getTrendingCourses();
      setTrendingCourses(data.trending_courses || {});
    } catch (err) {
      console.error('Failed to load trending courses:', err);
    }
  };

  const getProviderColor = (provider) => {
    const colors = {
      'coursera': '#0056d3',
      'udemy': '#a435f0',
      'youtube': '#ff0000',
      'edx': '#02262b',
      'linkedin': '#0077b5',
      'pluralsight': '#f15b2a',
    };
    return colors[provider.toLowerCase()] || '#666';
  };

  const getProviderLogo = (provider) => {
    return provider.charAt(0).toUpperCase();
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.skill_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || rec.recommendation_type === filterType;
    const matchesProvider = filterProvider === 'all' || 
                           rec.provider.toLowerCase() === filterProvider.toLowerCase();
    
    return matchesSearch && matchesType && matchesProvider;
  });

  const groupedRecommendations = filteredRecommendations.reduce((acc, rec) => {
    if (!acc[rec.skill_name]) {
      acc[rec.skill_name] = [];
    }
    acc[rec.skill_name].push(rec);
    return acc;
  }, {});

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const CourseCard = ({ course, skill = null }) => (
    <Card className="hover-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Avatar 
            sx={{ 
              bgcolor: getProviderColor(course.provider),
              width: 40,
              height: 40,
              fontSize: '1rem'
            }}
          >
            {getProviderLogo(course.provider)}
          </Avatar>
          <Chip 
            label={course.recommendation_type || 'course'} 
            size="small" 
            variant="outlined"
          />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {course.title}
        </Typography>

        {skill && (
          <Chip 
            label={skill} 
            color="primary" 
            size="small" 
            sx={{ mb: 2 }}
          />
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
          {course.description?.substring(0, 120)}...
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {course.duration || 'Self-paced'}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PriceIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {course.price || 'Free'}
            </Typography>
          </Box>

          {course.rating && (
            <Box display="flex" alignItems="center" gap={1}>
              <Rating 
                value={course.rating} 
                readOnly 
                size="small" 
                precision={0.1}
              />
              <Typography variant="body2" color="text.secondary">
                ({course.rating})
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Provider: {course.provider}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<LaunchIcon />}
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            bgcolor: getProviderColor(course.provider),
            '&:hover': {
              bgcolor: getProviderColor(course.provider),
              opacity: 0.9
            }
          }}
        >
          Start Learning
        </Button>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Learning Recommendations
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Personalized course recommendations to help you develop missing skills and advance your career.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab 
            label={`Your Recommendations (${recommendations.length})`} 
            icon={<SchoolIcon />} 
          />
          <Tab 
            label="Trending Courses" 
            icon={<TrendingIcon />} 
          />
        </Tabs>
      </Paper>

      {/* Your Recommendations Tab */}
      <TabPanel value={activeTab} index={0}>
        {recommendations.length === 0 ? (
          <Alert severity="info">
            No specific recommendations available. This usually means your skills align well with the job requirements!
          </Alert>
        ) : (
          <>
            {/* Filters */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      placeholder="Search courses or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Course Type</InputLabel>
                      <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        label="Course Type"
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="course">Courses</MenuItem>
                        <MenuItem value="tutorial">Tutorials</MenuItem>
                        <MenuItem value="certification">Certifications</MenuItem>
                        <MenuItem value="documentation">Documentation</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Provider</InputLabel>
                      <Select
                        value={filterProvider}
                        onChange={(e) => setFilterProvider(e.target.value)}
                        label="Provider"
                      >
                        <MenuItem value="all">All Providers</MenuItem>
                        <MenuItem value="coursera">Coursera</MenuItem>
                        <MenuItem value="udemy">Udemy</MenuItem>
                        <MenuItem value="youtube">YouTube</MenuItem>
                        <MenuItem value="edx">edX</MenuItem>
                        <MenuItem value="linkedin">LinkedIn Learning</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recommendations by Skill */}
            {Object.entries(groupedRecommendations).map(([skill, courses]) => (
              <Box key={skill} sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <SchoolIcon color="primary" />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {skill}
                  </Typography>
                  <Chip 
                    label={`${courses.length} course${courses.length > 1 ? 's' : ''}`} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
                
                <Grid container spacing={3}>
                  {courses.map((course, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
                
                {skill !== Object.keys(groupedRecommendations)[Object.keys(groupedRecommendations).length - 1] && (
                  <Divider sx={{ mt: 4 }} />
                )}
              </Box>
            ))}
          </>
        )}
      </TabPanel>

      {/* Trending Courses Tab */}
      <TabPanel value={activeTab} index={1}>
        {Object.keys(trendingCourses).length === 0 ? (
          <Alert severity="info">
            Trending courses data is not available at the moment.
          </Alert>
        ) : (
          Object.entries(trendingCourses).map(([skill, courses]) => (
            <Box key={skill} sx={{ mb: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <TrendingIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </Typography>
                <Chip 
                  label="Trending" 
                  color="secondary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Grid container spacing={3}>
                {courses.map((course, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <CourseCard course={course} />
                  </Grid>
                ))}
              </Grid>
              
              {skill !== Object.keys(trendingCourses)[Object.keys(trendingCourses).length - 1] && (
                <Divider sx={{ mt: 4 }} />
              )}
            </Box>
          ))
        )}
      </TabPanel>
    </Box>
  );
};

export default RecommendationsPage;