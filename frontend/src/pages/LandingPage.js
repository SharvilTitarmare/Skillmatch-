import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  TrendingUp as TrendingIcon,
  School as EducationIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <AIIcon />,
    title: 'AI-Powered Analysis',
    description: 'Advanced NLP algorithms analyze your resume against job descriptions for precise matching.',
  },
  {
    icon: <TrendingIcon />,
    title: 'Skill Gap Analysis',
    description: 'Identify missing skills and get actionable insights to improve your resume.',
  },
  {
    icon: <EducationIcon />,
    title: 'Personalized Learning',
    description: 'Get course recommendations tailored to your skill gaps and career goals.',
  },
  {
    icon: <SpeedIcon />,
    title: 'ATS Optimization',
    description: 'Optimize your resume for Applicant Tracking Systems to increase visibility.',
  },
];

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Match Your Skills,
                <br />
                Land Your Dream Job
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                AI-powered resume analysis that helps you understand skill gaps, 
                optimize for ATS systems, and get personalized learning recommendations.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.9),
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: alpha('#ffffff', 0.1),
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: alpha('#ffffff', 0.1),
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${alpha('#ffffff', 0.3)}`,
                  }}
                >
                  <Typography variant="h6" sx={{ opacity: 0.7 }}>
                    Demo Preview Coming Soon
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Why Choose SkillMatch?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Leverage cutting-edge AI technology to optimize your job search 
            and accelerate your career growth.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                className="hover-card"
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: 'none',
                }}
              >
                <Box
                  sx={{
                    color: 'primary.main',
                    mb: 2,
                    fontSize: '3rem',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Ready to Optimize Your Resume?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Join thousands of job seekers who have improved their hiring chances with SkillMatch.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 6, py: 2 }}
          >
            Start Your Analysis
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;