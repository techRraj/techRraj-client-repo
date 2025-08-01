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
  const { user, backendUrl, loadCreditsData, token, setShowLogin ,logout} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
 useEffect(() => {
  const loadRazorpay = async () => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.id = 'razorpay-script';
    
    script.onload = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
      } else {
        toast.error('Razorpay failed to load properly');
        setRazorpayLoaded(false);
      }
    };
    
    script.onerror = () => {
      toast.error('Failed to load payment gateway. Please refresh the page.');
      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById('razorpay-script');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  };

  loadRazorpay();
}, []);

const handlePayment = async (planId) => {
  try {
    setLoading(true);
    
    if (!user || !token) {
      setShowLogin(true);
      toast.error('Please login to continue');
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

    if (!orderResponse.data?.success) {
      throw new Error(orderResponse.data?.message || "Failed to create order");
    }

    // Initialize Razorpay with proper error handling
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
            throw new Error(verificationResponse.data.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Verification Error:', error);
          toast.error(error.response?.data?.message || error.message || 'Payment verification failed');
          if (error.response?.status === 401) {
            logout();
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
          toast.info('Payment cancelled');
        }
      }
    };

    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      throw new Error('Razorpay payment gateway failed to load');
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      toast.error(`Payment failed: ${response.error.description}`);
      console.error('Payment failed:', response);
    });
    rzp.open();

  } catch (error) {
    console.error('Payment Error:', error);
    toast.error(error.response?.data?.message || error.message || 'Payment processing failed');
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
  width={50}  // React style width
  height={50} // React style height
  style={{ display: 'block' }}
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