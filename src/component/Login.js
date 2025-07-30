import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import '../App.css';
import { FiMail, FiLock, FiUser, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [state, setState] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const getStrengthColor = () => {
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
    return colors[passwordStrength - 1] || '#ecf0f1';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (state === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  // ... existing try code ...
  e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const endpoint = state === 'login' ? '/api/user/login' : '/api/user/register';
      const payload = state === 'login' 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);
      
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
      setToken(data.token);
      setUser(data.user);
      setShowLogin(false);
      toast.success(
        state === 'login' 
          ? 'Login successful!' 
          : 'Registration successful! Please check your email to verify your account.'
      );
  } catch (error) {
    let errorMessage = 'Authentication failed. Please try again.';
    
    if (error.response) {
      // Handle specific HTTP error codes
      switch (error.response.status) {
        case 400:  // Bad Request
          errorMessage = 'Invalid request data. Please check your inputs.';
          if (error.response.data?.errors) {
            // Handle field-specific errors from server
            const serverErrors = {};
            error.response.data.errors.forEach(err => {
              serverErrors[err.field] = err.message;
            });
            setErrors(serverErrors);
          }
          break;
        case 401:  // Unauthorized
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:  // Forbidden
          errorMessage = 'Access denied. Invalid credentials or unverified account.';
          break;
        case 500:  // Internal Server Error
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Request failed with status ${error.response.status}`;
      }
      
      // If the server provides a specific error message
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }
    
    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <FiX 
          className="close-button" 
          size={24} 
          onClick={() => setShowLogin(false)} 
        />
        
        <h1 className="auth-title">
          {state === 'login' ? 'Login' : 'Create Account'}
        </h1>
        
        <p className="auth-subtitle">
          {state === 'login' 
            ? 'Welcome back! Please sign in to continue' 
            : 'Create an account to get started'}
        </p>
        
        <form 
          className="auth-form" 
          onSubmit={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        >
          {state === 'register' && (
            <div className={`input-group ${errors.name ? 'error-input' : ''}`}>
              <FiUser size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={isLoading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}
          
          <div className={`input-group ${errors.email ? 'error-input' : ''}`}>
            <FiMail size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className={`input-group ${errors.password ? 'error-input' : ''}`}>
            <FiLock size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={state === 'login' ? 'current-password' : 'new-password'}
              disabled={isLoading}
            />
            {showPassword ? (
              <FiEyeOff 
                size={20} 
                onClick={() => setShowPassword(false)}
                style={{ cursor: 'pointer', opacity: 0.7 }}
              />
            ) : (
              <FiEye 
                size={20} 
                onClick={() => setShowPassword(true)}
                style={{ cursor: 'pointer', opacity: 0.7 }}
              />
            )}
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
          
          {state === 'register' && formData.password && (
            <div className="password-strength-container">
              <div className="password-strength">
                <div 
                  className="strength-bar"
                  style={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getStrengthColor()
                  }}
                />
              </div>
              <div className="strength-text">
                {passwordStrength === 0 && 'Very Weak'}
                {passwordStrength === 1 && 'Weak'}
                {passwordStrength === 2 && 'Medium'}
                {passwordStrength === 3 && 'Strong'}
                {passwordStrength === 4 && 'Very Strong'}
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              state === 'login' ? 'Login' : 'Create Account'
            )}
          </button>
          
          <p className="auth-link">
            {state === 'login' ? (
              <>Don't have an account?{' '}
                <span onClick={() => !isLoading && setState('register')}>Sign up</span>
              </>
            ) : (
              <>Already have an account?{' '}
                <span onClick={() => !isLoading && setState('login')}>Login</span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;