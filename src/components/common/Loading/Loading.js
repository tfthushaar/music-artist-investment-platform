import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', fullScreen = false }) => {
  const containerClass = fullScreen ? 'loading-container--fullscreen' : 'loading-container';
  
  return (
    <div className={containerClass}>
      <div className={`loading-spinner loading-spinner--${size}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;