import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { WelcomeScreen } from './components/pages/WelcomeScreen';
import { TimelinePage } from './components/pages/TimelinePage';
import { ProfilePage } from './components/pages/ProfilePage';
import { UploadFlow } from './components/UploadFlow/UploadFlow';
import { FullScreenGallery } from './components/FullScreenGallery/FullScreenGallery';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/timeline" replace /> : <WelcomeScreen />
        } 
      />
      <Route
        path="/timeline"
        element={
          <ProtectedRoute>
            <PostProvider>
              <TimelinePage />
            </PostProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <PostProvider>
              <UploadFlow />
            </PostProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <PostProvider>
              <ProfilePage />
            </PostProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/:postId"
        element={
          <ProtectedRoute>
            <PostProvider>
              <FullScreenGallery />
            </PostProvider>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
