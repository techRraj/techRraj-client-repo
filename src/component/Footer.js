import React from 'react';
import image from "../image/Screenshot 2025-05-08 235115.png";
import fb from "../image/facebook_icon.svg"
import insta from "../image/instagram_icon.svg"
import twitter_ from "../image/twitter_icon.svg"

const Footer = () => {
    return (
        <div className='footer-container'>
            {/* If this image is decorative or just for branding */}
            <img className='footer-img' src={image} alt="" />

            <p>Made by Rajkumar</p>
            <p>Copyright 2025 @ rajclub - all rights reserved.</p>

            <div className='footer-icon'>
                {/* Social icons with meaningful alt text */}
                <img style={{ cursor: "pointer" ,background:"white" }} className='img' src={fb} alt="Facebook" />
                <img style={{ cursor: "pointer",background:"white" }} className='img' src={insta} alt="Instagram" />
                <img style={{ cursor: "pointer",background:"white" }} className='img' src={twitter_} alt="Twitter" />
            </div>
        </div>
    );
}

export default Footer;