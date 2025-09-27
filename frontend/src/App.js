import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Loading from './components/Loading';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadResumePage from './pages/UploadResumePage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ProfilePage from './pages/ProfilePage';
import ChatAdvisorPage from './pages/ChatAdvisorPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    return !user ? children : <Navigate to="/dashboard" />;
  };

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <Layout>
                <UploadResumePage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analyze" 
          element={
            <ProtectedRoute>
              <Layout>
                <AnalysisPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results/:analysisId" 
          element={
            <ProtectedRoute>
              <Layout>
                <ResultsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recommendations/:analysisId" 
          element={
            <ProtectedRoute>
              <Layout>
                <RecommendationsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Layout>
                <ChatAdvisorPage />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;