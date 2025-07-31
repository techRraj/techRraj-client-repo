import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const plans = [
  {
    id: 'basic',
    desc: "Basic Plan",
    price: 1000,
    credits: 25
  },
  {
    id: 'standard',
    desc: "Standard Plan",
    price: 3000,
    credits: 70
  },
  {
    id: 'premium',
    desc: "Premium Plan",
    price: 5000,
    credits: 150
  }
];

const BuyCredit = () => {
  const navigate = useNavigate();
  const { 
    user, 
    backendUrl, 
    loadCreditsData, 
    token, 
    setShowLogin, 
    logout,
    verifyPayment,
    isProcessingPayment
  } = useContext(AppContext);
  
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script - memoized to prevent unnecessary reloads
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    const handleLoad = () => {
      setRazorpayLoaded(true);
      script.removeEventListener('load', handleLoad);
    };
    
    const handleError = () => {
      toast.error('Failed to load payment gateway. Please refresh the page.');
      script.removeEventListener('error', handleError);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Memoized payment initialization
  const initPayment = useCallback(async (order) => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading. Please wait...");
      return;
    }

    try {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: 'Credits Purchase',
        description: `${order.notes?.credits || ''} Credits`,
        order_id: order.id,
        image: '/logo.png',
        handler: async (response) => {
          try {
            await verifyPayment(response);
            await loadCreditsData(true);
            toast.success(
              `Payment successful! Added ${order.notes?.credits || ''} credits`
            );
            setTimeout(() => navigate('/'), 2000);
          } catch (error) {
            console.error('Payment verification failed:', error);
            if (error.response?.data?.code === 'DUPLICATE_PAYMENT') {
              toast.info('Payment was already processed. Credits were already added.');
              await loadCreditsData(true);
            }
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => {
            if (!isProcessingPayment) {
              toast.info('Payment cancelled');
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      toast.error('Failed to initialize payment gateway');
    }
  }, [razorpayLoaded, verifyPayment, loadCreditsData, navigate, user, isProcessingPayment]);

  const handlePayment = async (planId) => {
    if (loading || isProcessingPayment) return;
    
    try {
      setLoading(true);
      
      if (!user) {
        setShowLogin(true);
        return;
      }

      if (!token) {
        toast.error('Your session has expired. Please login again.');
        logout();
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/user/create-order`,
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.success) {
        await initPayment(response.data.order);
      } else {
        toast.error(response.data.message || "Failed to create order");
      }
    } catch (error) {
      console.error('Payment Error:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again.');
          logout();
        } else {
          toast.error(error.response.data?.message || 'Payment failed. Please try again.');
        }
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ padding: '20px' }}
    >
      <h1>Buy Credits</h1>
      <button 
        onClick={() => navigate('/subscription')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3399cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Our Subscription
      </button>
      <h2>Choose the Subscription</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {plans.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '20px', 
              borderRadius: '8px', 
              width: '250px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img 
              src="/assets/logo_icon.svg" 
              alt="Logo Icon" 
              style={{ width: '50px', height: '50px', marginBottom: '15px' }} 
            />
            <h3 style={{ margin: '10px 0' }}>{item.desc}</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0' }}>
              ₹{item.price.toLocaleString()}
            </p>
            <p style={{ margin: '5px 0 15px 0' }}>{item.credits} credits</p>
            <button 
              onClick={() => handlePayment(item.id)}
              disabled={loading || !razorpayLoaded || isProcessingPayment}
              style={{
                padding: '10px 20px',
                backgroundColor: (loading || !razorpayLoaded || isProcessingPayment) 
                  ? '#cccccc' 
                  : '#3399cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || !razorpayLoaded || isProcessingPayment) 
                  ? 'not-allowed' 
                  : 'pointer',
                width: '100%'
              }}
            >
              {loading || isProcessingPayment ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;