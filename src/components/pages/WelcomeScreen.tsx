import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const { signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    
    try {
      await signIn();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <h1 className="welcome-title">social post app</h1>
        
        {error && (
          <div className="welcome-error">
            {error}
          </div>
        )}

        <Button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="welcome-button"
        >
          {isSigningIn ? (
            <>
              <LoadingSpinner size="small" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span className="google-icon">G</span>
              <span>sign in with google</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
