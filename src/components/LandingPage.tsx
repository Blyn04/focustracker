import React from "react";
import "../styles/LandingPage.css";

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">🎯 Focus Tracker</h1>
        <p className="landing-subtitle">
          Stay productive, track your focus time, and build daily streaks.
        </p>
        
        <button className="landing-button" onClick={onStart}>
          Start Tracking
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
