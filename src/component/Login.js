import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import '../App.css';

const Login = () => {
  const [authState, setAuthState] = useState('login'); // 'login' or 'register'
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

  // Calculate password strength (0-4 scale)
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  // Update password strength on password change
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // Get color based on password strength
  const getStrengthColor = () => {
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
    return colors[passwordStrength - 1] || '#ecf0f1';
  };

  // Validate form fields
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
    
    if (authState === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const endpoint = authState === 'login' ? '/api/user/login' : '/api/user/register';
      const payload = authState === 'login' 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);
      
      if (data.success) {
        setFormData({ name: '', email: '', password: '' }); // Reset form
        setErrors({});
        setToken(data.token);
        setUser(data.user);
        setShowLogin(false);
        toast.success(
          authState === 'login' 
            ? 'Login successful!' 
            : 'Registration successful! Please verify your email.'
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         'Authentication failed. Please try again.';
      toast.error(errorMessage);
      
      // Set specific field errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle between login/register
  const toggleAuthState = () => {
    setAuthState(prev => prev === 'login' ? 'register' : 'login');
    setErrors({});
  };

  return (
    <div className="auth-container">
      <FiX 
        className="close-button" 
        size={24} 
        onClick={() => setShowLogin(false)}
        aria-label="Close login modal"
      />
      
      <h1 className="auth-title">
        {authState === 'login' ? 'Login' : 'Create Account'}
      </h1>
      
      <p className="auth-subtitle">
        {authState === 'login' 
          ? 'Welcome back! Please sign in to continue' 
          : 'Create an account to get started'}
      </p>
      
      <form 
        className="auth-form" 
        onSubmit={handleSubmit}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        noValidate
      >
        {authState === 'register' && (
          <div className={`input-group ${errors.name ? 'error-input' : ''}`}>
            <FiUser size={20} aria-hidden="true" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              aria-label="Full Name"
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
        )}
        
        <div className={`input-group ${errors.email ? 'error-input' : ''}`}>
          <FiMail size={20} aria-hidden="true" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
            aria-label="Email Address"
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className={`input-group ${errors.password ? 'error-input' : ''}`}>
          <FiLock size={20} aria-hidden="true" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete={authState === 'login' ? 'current-password' : 'new-password'}
            aria-label="Password"
            required
            minLength="8"
          />
          {showPassword ? (
            <FiEyeOff 
              size={20} 
              onClick={() => setShowPassword(false)}
              className="password-toggle"
              aria-label="Hide password"
            />
          ) : (
            <FiEye 
              size={20} 
              onClick={() => setShowPassword(true)}
              className="password-toggle"
              aria-label="Show password"
            />
          )}
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        
        {authState === 'register' && formData.password && (
          <div className="password-strength-container">
            <div className="password-strength">
              <div 
                className="strength-bar"
                style={{
                  width: `${(passwordStrength / 4) * 100}%`,
                  backgroundColor: getStrengthColor()
                }}
                aria-valuenow={passwordStrength}
                aria-valuemin="0"
                aria-valuemax="4"
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
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="spinner" aria-hidden="true"></span>
          ) : (
            authState === 'login' ? 'Login' : 'Create Account'
          )}
        </button>
        
        <p className="auth-link">
          {authState === 'login' ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={toggleAuthState}
                className="auth-state-toggle"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={toggleAuthState}
                className="auth-state-toggle"
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;