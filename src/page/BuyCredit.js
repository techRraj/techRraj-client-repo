import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Match these plans with your backend
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

  const initpay = async (order) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Updated to use process.env
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-payment`, 
            response, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (data.success) {
            await loadCreditsData();
            navigate('/');
            toast.success('Credits Added Successfully');
          }
        } catch (error) {
          toast.error(error.response?.data?.message || error.message);
        }
      },
      theme: {
        color: '#3399cc'
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

const paymentRazorpay = async (planId) => {
  try {
    if (!user) {
      setShowLogin(true);
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
      initpay(data.order);
    } else {
      toast.error(data.message || "Failed to create order");
    }
  } catch (error) {
    console.error("Payment Error:", error);
    toast.error(error.response?.data?.message || 
               error.message || 
               "Failed to initiate payment");
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
              style={{
                padding: '10px 20px',
                backgroundColor: '#3399cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;