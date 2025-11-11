import React, { useRef } from "react";
import Header from "./Header";
import AuthModal, { AuthModalRef } from "./AuthModal";
import "../styles/LandingPage.css";

interface LandingPageProps {
  onStart?: () => void;
}

function LandingPage({ onStart }: LandingPageProps) {
  const authRef = useRef<AuthModalRef>(null);

  const handleGetStarted = () => {
    authRef.current?.open(); // open login/signup modal
  };

  return (
    <div className="landing-container">
      <Header onShowBadges={() => {}} hideNav={true} />

      <div className="landing-content">
        <h1 className="landing-title">Focus Tracker</h1>
        <p className="landing-subtitle">
          Stay productive, track your focus time, and build daily streaks.
        </p>

        <button className="landing-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>

      <AuthModal ref={authRef} />
    </div>
  );
}

export default LandingPage;
