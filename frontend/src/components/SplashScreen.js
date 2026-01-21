import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Complete splash after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-icon">🛒</div>
        <h1 className="splash-title">CAMPUSQUICK</h1>
        <div className="splash-tagline">
          <span className="cloud-icon">☁️</span>
          Cloud-Powered Campus Convenience
        </div>
        <div className="splash-subtitle">
          Delivering essentials to your dorm in 20-30 minutes
        </div>
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
        <div className="splash-footer">
          <div className="powered-by">Powered by AWS Serverless</div>
          <div className="services">
            <span>Lambda</span>
            <span>•</span>
            <span>DynamoDB</span>
            <span>•</span>
            <span>API Gateway</span>
            <span>•</span>
            <span>Cognito</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;