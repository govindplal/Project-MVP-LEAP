import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="header">
        <Link to="/auth" className="login-link">Login</Link>
      </div>
      <div className="logo">
        <img src="logo.png" alt="Logo" className="logo-image" />
      </div>
      <div className="caption">
        <h1 className="caption-text">Discover Amazing Content</h1>
        <p className="caption-subtext">Explore our platform and stay updated.</p>
      </div>
    </div>
  )
}

export default LandingPage