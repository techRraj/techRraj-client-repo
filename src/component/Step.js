import React from "react";
import Image1 from "../image/Screenshot 2025-05-09 233145.png";
import Image2 from "../image/Screenshot 2025-05-09 233222.png";
import Image3 from "../image/Screenshot 2025-05-09 233234.png";
import { motion } from 'framer-motion'

const Step = () => {
    return (
        <motion.div 
         initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
        className="step-container">
            {/* Header */}
            <div className="header">
                <h1 className="header-title">How AI Magic Works</h1>
                
            </div>
                 <div style={{marginBottom:"40px", marginTop:"20px" }}> <p className="subheading">
                    Transform Texts Into Stunning Images ✨
                </p></div>
             
          

            

            {/* Steps */}
            <div className="steps-container">
                {/* Step 1: Describe Your Vision */}
                <div className="step-card">
                    <img src={Image1} alt="Vision Icon" className="step-icon" />
                    <div className="step-content">
                        <div className="text-group">
                            <h2 className="step-title">Describe Your Vision</h2>
                            <p className="step-description">
                                Type a phrase, sentence, or paragraph that describes the image you want to create.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 2: Watch the Magic */}
                <div className="step-card">
                    <img src={Image2} alt="Magic Icon" className="step-icon" />
                    <div className="step-content">
                        <div className="text-group">
                            <h2 className="step-title">Watch the Magic</h2>
                            
                            <p className="step-description">
                                Our AI engine swiftly transforms your text into a high-quality, unique image within seconds.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3: Download & Share */}
                <div className="step-card">
                    <img src={Image3} alt="Download Icon" className="step-icon" />
                    <div className="step-content">
                        <div className="text-group">
                            <h2 className="step-title">Download & Share</h2>
                            <p className="step-description">
                                Instantly download your creation or share it directly from our platform. Let your imagination flow and watch it come to life effortlessly.
                            </p>
                        </div>
                    </div>
                </div>
 

            </div>
        </motion.div>
    );
};

export default Step;