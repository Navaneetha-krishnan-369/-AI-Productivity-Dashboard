import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setMessage('');
    setIsError(false);
    
    const endpoint = isLoginMode ? '/login' : '/register';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isLoginMode) {
          onLogin(); // Proceed to dashboard
        } else {
          setMessage('Registration successful! Please sign in.');
          setIsError(false);
          setIsLoginMode(true);
          setPassword(''); // clear password for safety
        }
      } else {
        setMessage(data.message || 'An error occurred');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Network error. Is the server running?');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="login-subtitle">
          {isLoginMode ? 'Sign in to access your dashboard' : 'Sign up to start tracking your productivity'}
        </p>

        {message && (
          <div className={`auth-message ${isError ? 'error-text' : 'success-text'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn login-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="toggle-auth-mode">
          <p>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="text-btn toggle-btn" 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setMessage('');
                setIsError(false);
              }}
            >
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
