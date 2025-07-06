import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import image from "../image/Screenshot 2025-05-08 235115.png";
import { motion } from "framer-motion";

const Header = () => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user) {
      navigate("/result");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <motion.div
      className="header-container"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="main-content"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ delay: 0.2 }}
      >
        <motion.div className="tagline">
          <h1>
            Best Transform Words into Art<span className="star">✨</span>
          </h1>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 2 }}
        >
          Transform Words into <span style={{ color: "red" }}>Art</span> in seconds.
        </motion.h1>
        <motion.p
          style={{ marginBottom: "2rem", color: "white" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Unleash boundless creativity with AI – Turn your thoughts into stunning visual art instantly. Just type, and watch the magic unfold.
        </motion.p>
        <motion.button
          className="generate-btn"
          onClick={onClickHandler}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            default: { duration: 0.5 },
            opacity: { delay: 0.8, duration: 1 },
          }}
        >
          Generate Images ✨
        </motion.button>
      </motion.div>

      <motion.div
        className="generated-images"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.img whileHover={{ scale: 1.05 }} src={image} alt="Generated Image" />
        <motion.img whileHover={{ scale: 1.05 }} src={image} alt="Generated Image" />
        <motion.img whileHover={{ scale: 1.05 }} src={image} alt="Generated Image" />
        <motion.img whileHover={{ scale: 1.05 }} src={image} alt="Generated Image" />
        <motion.img whileHover={{ scale: 1.05 }} src={image} alt="Generated Image" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Generated images from Image Generator
      </motion.p>
    </motion.div>
  );
};

export default Header;

// export default Header;


// import React, { useContext } from "react";
// import { AppContext } from "../context/AppContext"; // Import the context
// import { useNavigate } from "react-router-dom";

// // Import styles (you can use CSS or inline styles)
// const Header = () => {
//     const { user, setShowLogin } = useContext(AppContext);
//     const navigate = useNavigate();

//     const onClickHandler = () => {
//         if (user) {
//             navigate("/result");
//         } else {
//             setShowLogin(true);
//         }
//     };

//     return (
//         <div className="header-container">
//             {/* Header Section */}
//             <div className="header">
//                 <div className="logo">
//                     <img src="/path-to-logo.png" alt="Logo" /> {/* Replace with actual logo path */}
//                     <span>ImageZ</span>
//                 </div>
//                 <div className="nav-links">
//                     <button className="subscription-btn">Subscription</button>
//                     <button className="login-btn">Login</button>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="main-content">
//                 <div className="tagline">
//                     <p>Best Transform Words into Art ✨</p>
//                 </div>
//                 <h1>Transform Words into <span style={{ color: "red" }}>Art</span> in seconds.</h1>
//                 <p>
//                     Unleash boundless creativity with AI – Turn your thoughts into stunning visual art instantly. Just type, and watch the magic unfold.
//                 </p>
//                 <button className="generate-btn" onClick={onClickHandler}>
//                     Generate Images ✨
//                 </button>
//             </div>

//             {/* Generated Images Section */}
//             <div className="generated-images">
//                 <img src="../../public/assets/Screenshot 2025-05-08 235115.png" alt="Generated Image 1" />
//                 <img src="/path-to-image2.jpg" alt="Generated Image 2" />
//                 <img src="/path-to-image3.jpg" alt="Generated Image 3" />
//                 <img src="/path-to-image4.jpg" alt="Generated Image 4" />
//                 <img src="/path-to-image5.jpg" alt="Generated Image 5" />
//                 <p>Generated images from ImageZ</p>
//             </div>
//         </div>
//     );
// };

