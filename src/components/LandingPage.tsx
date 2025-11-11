import React, { useRef } from "react";
import Header from "./Header";
import AuthModal, { AuthModalRef } from "./AuthModal";
import "../styles/LandingPage.css";

interface LandingPageProps {
  onStart?: () => void;       // called when login succeeds
  onLogout?: () => void;      // called when logout happens
}

function LandingPage({ onStart, onLogout }: LandingPageProps) {
  const authRef = useRef<AuthModalRef>(null);

  const handleGetStarted = () => {
    authRef.current?.open(); // open login/signup modal
  };

  return (
    <div className="landing-container">
      {/* Pass the onStart as onLoginSuccess to Header */}
      <Header
        onShowBadges={() => {}}
        hideNav={true}
        onLoginSuccess={onStart!}
        onLogout={onLogout!}   // now this comes from App.tsx
      />

      <div className="landing-content">
        <h1 className="landing-title">Focus Tracker</h1>
        <p className="landing-subtitle">
          Stay productive, track your focus time, and build daily streaks.
        </p>

        <button className="landing-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>

      {/* Pass the onStart callback to AuthModal */}
      <AuthModal ref={authRef} onLoginSuccess={onStart!} />
    </div>
  );
}

export default LandingPage;
