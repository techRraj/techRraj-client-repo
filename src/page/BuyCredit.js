import React, { useState, useEffect } from 'react';
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
  const { user, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Check if Razorpay is loaded
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Failed to load payment gateway. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initpay = async (order) => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      name: 'Credits Payment',
      description: `Purchase of ${order.notes?.credits || 'credits'}`,
      order_id: order.id,
      image: '/assets/logo_icon.svg',
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-payment`, 
            response, 
            { 
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          if (data.success) {
            await loadCreditsData();
            toast.success('Credits Added Successfully');
            navigate('/');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error(error.response?.data?.message || 'Payment verification failed');
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
          toast.info('Payment cancelled');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment gateway");
    }
  };

  const paymentRazorpay = async (planId) => {
    try {
      setLoading(true);
      
      if (!user) {
        setShowLogin(true);
        return;
      }

      if (!token) {
        toast.error('Please login again');
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/create-order`,
        { planId },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        await initpay(data.order);
      } else {
        toast.error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Handle logout or token refresh here if needed
      } else {
        toast.error(error.response?.data?.message || 
                   error.message || 
                   "Failed to initiate payment");
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
      <button onClick={() => navigate('/subscription')}>Our Subscription</button>
      <h2>Choose the Subscription</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {plans.map((item, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '250px' }}>
            <img src="/assets/logo_icon.svg" alt="Logo Icon" style={{ width: '50px', height: '50px' }} />
            <h3>{item.desc}</h3>
            <p>₹{item.price.toLocaleString()}</p>
            <p>{item.credits} credits</p>
            <button 
              onClick={() => paymentRazorpay(item.id)}
              disabled={loading || !razorpayLoaded}
              style={{
                padding: '10px 20px',
                backgroundColor: (loading || !razorpayLoaded) ? '#cccccc' : '#3399cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || !razorpayLoaded) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;