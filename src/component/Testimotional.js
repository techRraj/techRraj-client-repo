import React from 'react';
import client from "../image/Screenshot 2025-05-11 183652.png"
import star_icon from '../image/rating_star.svg'
import { motion } from 'framer-motion'

const Testimotional = () => {
    return (
        <motion.div 
           initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
        className='test-container'>
        
            <h1 className='test-div text-4'>User Reviews</h1>
            <p className='test-p'> What our custmer say</p>
            <div className='test-box'>
                <div className='test-box1'>
                <div className='test-box1div'>
                  <img className='test-img' src={client} alt='user-client' />
                  <h2 className='test-name'>
                    Raj Mehara
                  </h2>
                  <p className='test-post'>
                    Ai engineer
                  </p>
                </div> 
                <div className='test-star'>
                  
                  <motion.img whileHover={{ scale: 1.05, duration: 0.1 }} className='test-starImg' src={star_icon} alt='review' />
                  <motion.img whileHover={{ scale: 1.05, duration: 0.1 }}className='test-starImg' src={star_icon} alt='review' />
                  <motion.img whileHover={{ scale: 1.05, duration: 0.1 }} className='test-starImg' src={star_icon} alt='review' />
                  <motion.img whileHover={{ scale: 1.05, duration: 0.1 }} className='test-starImg' src={star_icon} alt='review' />
                  <motion.img whileHover={{ scale: 1.05, duration: 0.1 }} className='test-starImg' src={star_icon} alt='review' />
                  
                </div>
                <p className='test-review'>
                  Outstanding developer! Built a robust site with perfect functionality. Efficient and detail-oriented.
                </p>

                </div>
                
                
               
            </div>



            <div className='test-box'>
                <div className='test-box1'>
                <div className='test-box1div'>
                  <img className='test-img' src={client} alt='user-client' />
                  <h2 className='test-name'>
                    Raj Mehara
                  </h2>
                  <p className='test-post'>
                    Ai engineer
                  </p>
                </div> 
                <div className='test-star'>
                  
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  
                </div>
                <p className='test-review'>
                  Outstanding developer! Built a robust site with perfect functionality. Efficient and detail-oriented.
                </p>

                </div>
                
                
               
            </div><div className='test-box'>
                <div className='test-box1'>
                <div className='test-box1div'>
                  <img className='test-img' src={client} alt='user-client' />
                  <h2 className='test-name'>
                    Raj Mehara
                  </h2>
                  <p className='test-post'>
                    Ai engineer
                  </p>
                </div> 
                <div className='test-star'>
                  
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  
                </div>
                <p className='test-review'>
                  Outstanding developer! Built a robust site with perfect functionality. Efficient and detail-oriented.
                </p>

                </div>
                
                
               
            </div><div className='test-box'>
                <div className='test-box1'>
                <div className='test-box1div'>
                  <img className='test-img' src={client} alt='user-client' />
                  <h2 className='test-name'>
                    Raj Mehara
                  </h2>
                  <p className='test-post'>
                    Ai engineer
                  </p>
                </div> 
                <div className='test-star'>
                  
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  
                </div>
                <p className='test-review'>
                  Outstanding developer! Built a robust site with perfect functionality. Efficient and detail-oriented.
                </p>

                </div>
                
                
               
            </div><div className='test-box'>
                <div className='test-box1'>
                <div className='test-box1div'>
                  <img className='test-img' src={client} alt='user-client' />
                  <h2 className='test-name'>
                    Raj Mehara
                  </h2>
                  <p className='test-post'>
                    Ai engineer
                  </p>
                </div> 
                <div className='test-star'>
                  
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  <img className='test-starImg' src={star_icon} alt='review' />
                  
                </div>
                <p className='test-review'>
                  Outstanding developer! Built a robust site with perfect functionality. Efficient and detail-oriented.
                </p>

                </div>
                
                
               
            </div>
 </motion.div>
    );
}

export default Testimotional;
