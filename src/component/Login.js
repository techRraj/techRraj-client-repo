import React, { useContext, useState } from 'react';
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setIsLoading(true);
  
  try {
    const { data } = await axios.post(`${backendUrl}/api/user/login`, {
      email: formData.email,
      password: formData.password
    });
    
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      setShowLogin(false);
      toast.success('Login successful!');
    }
  } catch (error) {
    if (error.response) {
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.response.status) {
        case 401:
          errorMessage = 'Invalid email or password';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Request failed with status ${error.response.status}`;
      }
      
      toast.error(errorMessage);
    } else {
      toast.error('Network error. Please check your connection.');
    }
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
        
        <h1 className="auth-title">Login</h1>
        
        <p className="auth-subtitle">
          Welcome back! Please sign in to continue
        </p>
        
        <form 
          className="auth-form" 
          onSubmit={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        >
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
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
          
          <div className={`input-group ${errors.password ? 'error-input' : ''}`}>
            <FiLock size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
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
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Login'
            )}
          </button>
          
          <p className="auth-link">
            Don't have an account?{' '}
            <span onClick={() => !isLoading && setShowLogin('register')}>
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;