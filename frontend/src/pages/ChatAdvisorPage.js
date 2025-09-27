import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  TipsAndUpdates as TipsIcon,
} from '@mui/icons-material';
import { chatAPI } from '../services/api';

const ChatAdvisorPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your AI Skill Advisor. I can help you with career guidance, skill recommendations, and understanding your analysis results. How can I assist you today?",
      suggestions: [
        "How do I improve my resume?",
        "What skills should I learn next?",
        "Explain my analysis results"
      ],
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = async () => {
    try {
      const data = await chatAPI.getSuggestions();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await chatAPI.askAdvisor(message);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.response,
        suggestions: response.suggestions || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: "Chat cleared! How can I help you with your skill development journey?",
        suggestions: suggestions.slice(0, 3),
        timestamp: new Date()
      }
    ]);
  };

  const formatMessage = (text) => {
    // Convert markdown-like formatting to React elements
    return text.split('\n').map((line, index) => {
      if (line.startsWith('• ')) {
        return (
          <Box key={index} component="li" sx={{ ml: 2, mb: 0.5 }}>
            {line.substring(2)}
          </Box>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Typography key={index} variant="subtitle2" sx={{ fontWeight: 600, mt: 1, mb: 0.5 }}>
            {line.substring(2, line.length - 2)}
          </Typography>
        );
      }
      return line ? (
        <Typography key={index} variant="body2" paragraph={index < text.split('\n').length - 1}>
          {line}
        </Typography>
      ) : (
        <br key={index} />
      );
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            AI Skill Advisor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get personalized guidance for your career development journey.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={clearChat}
          size="small"
        >
          Clear Chat
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Chat Messages */}
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 2 }}>
        <CardContent sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          <List sx={{ py: 0 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                  py: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '80%',
                    width: message.type === 'user' ? 'auto' : '100%'
                  }}
                >
                  {message.type === 'bot' && (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                  )}
                  
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: message.type === 'user' ? 'primary.main' : 'grey.100',
                      color: message.type === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      flex: 1
                    }}
                  >
                    <Box>{formatMessage(message.text)}</Box>
                    
                    {/* Message suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Quick suggestions:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {message.suggestions.map((suggestion, index) => (
                            <Chip
                              key={index}
                              label={suggestion}
                              size="small"
                              variant="outlined"
                              onClick={() => handleSuggestionClick(suggestion)}
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                  
                  {message.type === 'user' && (
                    <Avatar sx={{ bgcolor: 'grey.400', width: 32, height: 32 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
                
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </ListItem>
            ))}
            
            {isLoading && (
              <ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <BotIcon fontSize="small" />
                  </Avatar>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Thinking...
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </ListItem>
            )}
          </List>
          <div ref={messagesEndRef} />
        </CardContent>
        
        {/* Input Area */}
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* Quick suggestions when chat is empty */}
          {messages.length === 1 && suggestions.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                <TipsIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                Try asking about:
              </Typography>
              <Grid container spacing={1}>
                {suggestions.slice(0, 6).map((suggestion, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Chip
                      label={suggestion}
                      variant="outlined"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{ 
                        cursor: 'pointer',
                        width: '100%',
                        '& .MuiChip-label': {
                          display: 'block',
                          whiteSpace: 'normal',
                          textAlign: 'center'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Ask me about skills, career paths, or your analysis results..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ChatAdvisorPage;