import React from 'react';
import "../App.css"
import { motion } from 'framer-motion'

import socerImage from "../image/Screenshot 2025-05-08 235115.png"
const Description = () => {
    return (
        <motion.div 
        whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                                        transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }} 
                                    
        className='desc-container'>
           

        <div className="generate-section">
                <div  
                   
                className="generate-content">
                    <h2 className="generate-title">Generate AI Images</h2>
                    <p className="generate-subtitle">Bring Creative Vision to Life</p>
                                    <img src={socerImage} alt="Soccer Player" className="generate-image" />

                    <h3 className="generate-description">
                        Introducing the AI Website - Your Ultimate Text to Image Generator
                    </h3>
                    <p className="generate-details">
                        Effortlessly bring your ideas to life with our free AI image generator. Transform your text into stunning visuals in seconds. Imagine, describe, and see your vision come to life instantly.
                        <br />
                        Type a text prompt, and our advanced AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even non-existent concepts come to life effortlessly. Unleash limitless creativity with our AI technology.
                    </p>
                </div>
            </div>    
           {/* Description
           <h1>
            Genarate AI Images
           </h1>
           <p>
            Bring Creative VIsion to life
           </p>
           <div>
            Images
           </div>
           <div>

            <h2>
                INtoducing the Ai Website - Your Ultimate text to Image Genrator
            </h2>
            <p>Effortlessly bring your ideas to life with our free AI image generator. Transform your text into stunning visuals in seconds. Imagine, describe, and see your vision come to life instantly</p>
            <p>Type a text prompt, and our advanced AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even non-existent concepts come to life effortlessly. Unleash limitless creativity with our AI technology.</p>

           </div> */}




        </motion.div>
    );
}

export default Description;
