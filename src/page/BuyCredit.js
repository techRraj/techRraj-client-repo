import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import  { useContext } from 'react'
import { AppContext } from '../context/AppContext'

// Define the plans data directly in the component
const plans = [
  {
    id: 1,
    desc: "Basic Plan",
    price: 500,
    credits: 100
  },
  {
    id: 2,
    desc: "Standard Plan",
    price: 1000,
    credits: 250
  },
  {
    id: 3,
    desc: "Premium Plan",
    price: 2000,
    credits: 500
  }
];

const BuyCredit = () => {
  const navigate = useNavigate();

 
  const {user, backendUrl, loadCreditsData, token, setShowLogin} = useContext(AppContext)
const initpay = async(order) => {
    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async(response)=>{
        try {
          const {data} = await axios.post(backendUrl + '/api/user/verify-razor', response, {headers: {token}})
          if (data.success) {
            loadCreditsData()
            navigate('/')
            toast.success('Credit Added')
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    } 
    const rzp = new window.Razorpay(options)
    rzp.open() 
  }

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true)
      }

      const{data} = await axios.post(backendUrl + '/api/user/pay-razor', {planId}, {headers: {token}})

      if (data.success) {
        initpay(data.order)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }



  return (
    <motion.div
        initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    style={{ padding: '20px' }}>
      <h1>Buy Credits</h1>
      <button onClick={() => navigate('/subscription')}>Our Subscription</button>
      <h2>Choose the Subscription</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {plans.map((item, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '200px' }}>
            <img src="/assets/logo_icon.svg" alt="Logo Icon" style={{ width: '50px', height: '50px' }} />
            <h3>{item.id}</h3>
            <p><strong>{item.desc}</strong></p>
            <p>₹{item.price} / {item.credits} credits</p>
            <button onClick={() => paymentRazorpay(item.id)}>Purchase</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;