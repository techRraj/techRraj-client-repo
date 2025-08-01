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
  const { user, backendUrl, loadCreditsData, token, setShowLogin, logout } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
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
      toast.error('Failed to load payment gateway. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

 const handlePayment = async (planId) => {
  try {
    setLoading(true);
    
    if (!user) {
      setShowLogin(true);
      return;
    }

    // Create order
    const orderResponse = await axios.post(
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

    if (orderResponse.data.success) {
      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.order.amount,
        currency: orderResponse.data.order.currency,
        name: 'Credits Purchase',
        description: `${orderResponse.data.plan.credits} Credits`,
        order_id: orderResponse.data.order.id,
        image: '/logo.png',
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              `${backendUrl}/api/user/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (verificationResponse.data.success) {
              await loadCreditsData();
              toast.success(`Payment successful! ${verificationResponse.data.credits} credits added`);
              navigate('/');
            } else {
              toast.error(verificationResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Verification Error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  } catch (error) {
    console.error('Payment Error:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || 'Payment processing failed');
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
<img 
        src="/assets/logo_icon.svg" 
        alt="Logo Icon" 
        style={{ width: '50px', height: '50px' }}
      /> 
                 <h3>{item.desc}</h3>
            <p>₹{item.price.toLocaleString()}</p>
            <p>{item.credits} credits</p>
            <button 
              onClick={() => handlePayment(item.id)}
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