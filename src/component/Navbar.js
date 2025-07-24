// src/component/Navbar.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import star_icon from "../image/credit_star.svg";
import profile_icon from "../image/profile_icon.png";
import { Link, navigate } from "react-router-dom";

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext);

  return (
    <div className="navbar">
      {/* Brand Name */}
      <div className="navbar-brand">
        <img src={""} alt="Logo" className='nav-mainIcon' />
        <span>
          <Link to='/' className='brand-text'>Image Generator</Link>
        </span>
      </div>
      {/* Navigation Items */}
      {user ? (
        <div className="nav-sec1">
          <button onClick={() => navigate('/buy')} className="nav-btn">
            <img src={star_icon} alt="Star Icon" className="nav-img" />
            <p className='nav-p'>Credits left: {credit}</p> {/* ✅ Display credit */}
          </button>
          <p className='nav-pi'>Hi, {user.name}</p>
          <div className='nav-proicon'>
            <img src={profile_icon} className='nav-pro' alt="Profile" />
            <div className='nav-usernav'>
              <ul className='nav-ul'>
                <li onClick={logout} className='nav-li'>Logout</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className='nav-section'>
          <p onClick={() => navigate('/buy')} className='nav-sub'>Subscription</p>
          <button onClick={() => setShowLogin(true)} className='nav-button'>Login</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;