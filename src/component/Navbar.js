import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../App.css';
import { AppContext } from '../context/AppContext';

import star_icon from "../image/credit_star.svg";
import profile_icon from "../image/profile_icon.png";
import mainicon from "../image/Screenshot 2025-05-08 235115.png";

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className='navbar'>
      {/* Brand Name */}
      <div className="navbar-brand">
        <Link to='/'>
          <img src={mainicon} alt="Logo" className='nav-mainIcon' />
        </Link>
        <span>
          <Link to='/' className='brand-text'>Image Generator</Link>
        </span>
      </div>

      {/* Navigation Items */}
      {user ? (
        <div className="nav-sec1">
          <button onClick={() => navigate('/buy')} className="nav-btn">
            <img src={star_icon} alt="Star Icon" className="nav-img" />
<p className='nav-p'>Credits left: {credit}</p>  
          </button>
          <p className='nav-pi'>Hi, {user?.name || "Guest"}</p>

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