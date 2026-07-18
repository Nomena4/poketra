import React from 'react';
import '../styles/BackgroundOrbs.css';

const BackgroundOrbs = () => {
  return (
    <div className="background-orbs-container">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="noise-overlay"></div>
    </div>
  );
};

export default BackgroundOrbs;
