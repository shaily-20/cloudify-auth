import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import "./LoginPage.css";
import WelcomePage from "./WelcomePage";

// Constants for authentication state management
const AUTH_STORAGE_KEY = 'auth_state';
const SYNC_TIMESTAMP_KEY = 'auth_sync_timestamp';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Check auth status on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setCheckingAuth(true);
      try {
        console.log('Checking auth status with server...');
        const res = await axios.get("http://localhost:5000/check-auth", { 
          withCredentials: true 
        });
        console.log('Auth status response:', res.data);
        
        if (res.data.isAuthenticated) {
          console.log('User is authenticated');
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          console.log('User is not authenticated');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log('Error checking auth status or not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    // Check immediately on load
    checkAuthStatus();
    
    // Then check periodically
    const intervalId = setInterval(() => {
      checkAuthStatus();
    }, 5000); // Check every 5 seconds
    
    // Also check when window regains focus
    window.addEventListener('focus', checkAuthStatus);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", 
        { username, password }, 
        { withCredentials: true }
      );
      
      setMessage("Login successful!");
      setMessageType("success");
      setIsAuthenticated(true);
      setUser(res.data.user);
      setUsername("");
      setPassword("");
    } catch (err) {
      if (err.response?.data?.isNewUser) {
        setIsNewUser(true);
        setMessage("User not found. Would you like to sign up?");
        setMessageType("info");
      } else {
        setMessage(err.response?.data?.message || "Login failed");
        setMessageType("error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/google", {
        token: credentialResponse.credential
      }, { withCredentials: true });
      
      setMessage("Google login successful!");
      setMessageType("success");
      setIsAuthenticated(true);
      setUser(res.data.user);
    } catch (error) {
      setMessage("Google Login Failed");
      setMessageType("error");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      setMessage("Logged out successfully!");
      setMessageType("success");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      setMessage("Error during logout");
      setMessageType("error");
    }
  };

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/signup", 
        { 
          username, 
          email: username,
          password 
        }, 
        { withCredentials: true }
      );
      
      setMessage("Account created successfully!");
      setMessageType("success");
      setIsAuthenticated(true);
      setUser(res.data.user);
      setUsername("");
      setPassword("");
      setIsNewUser(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Sign up failed");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // If still checking auth status, show loading
  if (checkingAuth) {
    return (
      <div className="login-container">
        <div className="login-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show welcome page
  if (isAuthenticated && user) {
    return <WelcomePage user={user} onLogout={handleLogout} />;
  }

  // Login form for non-authenticated users
  return (
    <GoogleOAuthProvider clientId="GOOGLE_OAUTH_CLIENT_ID">
      <div className="login-container">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Please sign in to continue</p>
          
          <form onSubmit={isNewUser ? handleSignUp : handleLogin} className="login-form">
            <div className="form-group">
              <input
                type="text"
                placeholder={isNewUser ? "Choose Username" : "Username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={isNewUser ? "Choose Password" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Please wait..." : (isNewUser ? "Sign Up" : "Sign In")}
            </button>
          </form>

          {isNewUser ? (
            <div className="switch-auth-mode">
              <button 
                onClick={() => {
                  setIsNewUser(false);
                  setMessage("");
                }} 
                className="text-button"
              >
                Already have an account? Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="divider">
                <span>OR</span>
              </div>

              <div className="google-login">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    setMessage("Google Login Failed");
                    setMessageType("error");
                  }}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  width="300"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="left"
                />
              </div>

              <div className="switch-auth-mode">
                <button 
                  onClick={() => {
                    setIsNewUser(true);
                    setMessage("");
                  }} 
                  className="text-button"
                >
                  New user? Create an account
                </button>
              </div>
            </>
          )}

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
