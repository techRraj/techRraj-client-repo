import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

const GenrateBtn = () => {
    const navigate=useNavigate()
    return (
        <motion.div  initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}className='gen-container'
         >
        
         <motion.h1  initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}} className='gen-h1'>
See the Magic. Try Now
         </motion.h1>
         <motion.button initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}} className='gen-btn' onClick={()=>navigate('/buy')}>
            Subscription
            <img src='../../public/assets/profile_icon.png' alt=''/>
         </motion.button>
        </motion.div>
    );
}

export default GenrateBtn;
