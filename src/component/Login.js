import React, { useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import '../App.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);

  // Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    const { email, password } = formData;
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      }, {
        timeout: 10000 // 10 second timeout
      });
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setShowLogin(false);
        toast.success('Login successful!');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid request data';
            break;
          case 401:
            errorMessage = 'Invalid email or password';
            break;
          case 403:
            errorMessage = 'Account not verified. Please check your email.';
            break;
          case 429:
            errorMessage = 'Too many attempts. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Request failed with status ${error.response.status}`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <FiX 
          className="close-button" 
          size={24} 
          onClick={() => !isLoading && setShowLogin(false)}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && setShowLogin(false)}
          aria-label="Close login"
        />
        
        <h1 className="auth-title">Login</h1>
        
        <p className="auth-subtitle">
          Welcome back! Please sign in to continue
        </p>
        
        <form 
          className="auth-form" 
          onSubmit={handleSubmit}
          noValidate
          aria-label="Login form"
        >
          <div className={`input-group ${errors.email ? 'error-input' : ''}`}>
            <FiMail size={20} className="input-icon" aria-hidden="true" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="username"
              disabled={isLoading}
              aria-label="Email address"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <span id="email-error" className="error-text" role="alert">
              {errors.email}
            </span>
          )}
          
          <div className={`input-group ${errors.password ? 'error-input' : ''}`}>
            <FiLock size={20} className="input-icon" aria-hidden="true" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              disabled={isLoading}
              aria-label="Password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <FiEyeOff size={20} aria-hidden="true" />
              ) : (
                <FiEye size={20} aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <span id="password-error" className="error-text" role="alert">
              {errors.password}
            </span>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="sr-only">Loading...</span>
                <div className="spinner" aria-hidden="true"></div>
              </>
            ) : (
              'Login'
            )}
          </button>
          
          <p className="auth-link">
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-link-button"
              onClick={() => !isLoading && setShowLogin('register')}
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;