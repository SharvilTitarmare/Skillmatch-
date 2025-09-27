import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  Description as FileIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { resumeAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UploadResumePage = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Load existing resumes on mount
  React.useEffect(() => {
    loadResumes();
  }, []);

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

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await resumeAPI.uploadResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSuccess(`Successfully uploaded ${file.name}`);
      await loadResumes(); // Refresh the list
      
      // Clear progress after delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeAPI.deleteResume(resumeId);
      setSuccess('Resume deleted successfully');
      await loadResumes();
    } catch (err) {
      setError('Failed to delete resume');
    }
  };

  const handleAnalyze = (resumeId) => {
    navigate(`/analyze?resumeId=${resumeId}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDropzoneColor = () => {
    if (isDragReject) return 'error.main';
    if (isDragActive) return 'primary.main';
    return 'grey.300';
  };

  const getDropzoneBackground = () => {
    if (isDragReject) return 'error.lighter';
    if (isDragActive) return 'primary.lighter';
    return 'grey.50';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Upload Resume
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload your resume to start analyzing your skills and matching with job opportunities.
      </Typography>

      {/* Upload Area */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            {...getRootProps()}
            sx={{
              border: 2,
              borderColor: getDropzoneColor(),
              borderStyle: 'dashed',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              bgcolor: getDropzoneBackground(),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: isDragReject ? 'error.lighter' : 'primary.lighter',
                borderColor: isDragReject ? 'error.main' : 'primary.main',
              }
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon 
              sx={{ 
                fontSize: 64, 
                color: getDropzoneColor(),
                mb: 2 
              }} 
            />
            
            {isDragActive ? (
              <Typography variant="h6" color="primary">
                Drop your resume here...
              </Typography>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Drag & drop your resume here, or click to select
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Supported formats: PDF, DOCX, TXT (Max 10MB)
                </Typography>
                <Button 
                  variant="contained" 
                  disabled={uploading}
                  startIcon={<CloudUploadIcon />}
                >
                  Choose File
                </Button>
              </>
            )}
          </Box>

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ mt: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <Typography variant="body2">
                  Uploading and processing...
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          {/* File Rejection Errors */}
          {fileRejections.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {fileRejections[0].errors[0].message}
            </Alert>
          )}

          {/* Success/Error Messages */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resume List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Your Resumes
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : resumes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
              <FileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No resumes uploaded yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your first resume to get started with skill analysis.
              </Typography>
            </Paper>
          ) : (
            <List>
              {resumes.map((resume) => (
                <ListItem
                  key={resume.id}
                  sx={{
                    border: 1,
                    borderColor: 'grey.200',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {resume.filename}
                        </Typography>
                        <Chip 
                          label={resume.file_type.toUpperCase()} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Uploaded: {new Date(resume.created_at).toLocaleDateString()}
                        </Typography>
                        {resume.extracted_skills && (
                          <Typography variant="body2" color="success.main">
                            <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {resume.extracted_skills.length} skills extracted
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAnalyze(resume.id)}
                      sx={{ mr: 1 }}
                    >
                      Analyze
                    </Button>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDelete(resume.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card sx={{ mt: 4, bgcolor: 'info.lighter' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="info.dark">
            💡 Tips for Better Results
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="info.dark">
                • Use a well-formatted resume with clear sections
              </Typography>
              <Typography variant="body2" color="info.dark">
                • Include specific skills and technologies
              </Typography>
              <Typography variant="body2" color="info.dark">
                • Mention years of experience for each skill
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="info.dark">
                • List relevant certifications and education
              </Typography>
              <Typography variant="body2" color="info.dark">
                • Use industry-standard terminology
              </Typography>
              <Typography variant="body2" color="info.dark">
                • Keep file size under 10MB for faster processing
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadResumePage;