// // Result.js or any component

// import React, { useState } from 'react';
// import { generateImage } from '../services/apiService';

// const Result = () => {
//   const [input, setInput] = useState('');
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return alert('Please enter a prompt');

//     setLoading(true);
//     const token = localStorage.getItem('token'); // or context state

//     try {
//       const data = await generateImage(input, token);
//       setImage(data.imageUrl); // adjust based on actual response structure
//     } catch (err) {
//       alert('Failed to generate image');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Describe your idea"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <button type="submit" disabled={loading}>
//         {loading ? 'Generating...' : 'Generate'}
//       </button>

//       {image && <img src={image} alt="Generated" />}
//     </form>
//   );
// };

// export default Result;


import React, { useContext, useState } from 'react';
import defaultImage from '../image/Screenshot 2025-05-08 235115.png';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const Result = () => {
  const { generateImage } = useContext(AppContext);
  const [image, setImage] = useState(defaultImage); // Start with default image
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setIsImageLoaded(false);

    try {
      const newImage = await generateImage(input); // Should return image URL
      if (newImage) {
        setImage(newImage);
        setIsImageLoaded(true);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="result-form"
    >
      <div>
        <div className="result-img">
          <img
            src={image}
            alt="Generated"
            
            onLoad={() => !loading && setIsImageLoaded(true)} // Optional: auto detect load
          />
<span className={`result-imgSpan ${loading ? 'loading' : ''}`} />     </div>

        {loading && <p className="res-genrating">Generating...</p>}
      </div>

      {!isImageLoaded ? (
        <div className="res-genrate">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe your idea, and our AI will generate it!"
            className="res-place"
          />
          <button
            type="submit"
            disabled={loading}
            
          >
            Generate
          </button>
        </div>
      ) : (
        <div className="flx-con">
          <button 
            onClick={() => {
              setIsImageLoaded(false);
              setImage(defaultImage); // Reset to default image
              setInput(''); // Clear input
            }}
            class="button"
            type="button"
          >
            Generate Another
          </button>
          <a
            href={image}
            download="generated-image.png"
            className= "result-img"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;