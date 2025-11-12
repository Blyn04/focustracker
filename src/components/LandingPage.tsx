import React, { useRef } from "react";
import Header from "./Header";
import AuthModal, { AuthModalRef } from "./AuthModal";
import "../styles/LandingPage.css";

interface LandingPageProps {
  onStart?: () => void;       
  onLogout?: () => void;      
}

function LandingPage({ onStart, onLogout }: LandingPageProps) {
  const authRef = useRef<AuthModalRef>(null);

  const handleGetStarted = () => {
    authRef.current?.open();
  };

  return (
    <>
      <Header
        onShowBadges={() => {}}
        hideNav={true}
        onLoginSuccess={onStart!}
        onLogout={onLogout!}
      />

      <section className="landing-hero">
        <div className="landing-content">
          <h1 className="landing-title">Focus Tracker</h1>
          <p className="landing-subtitle">
            Boost your productivity, track your focus, and achieve your goals daily.
          </p>
          <button className="landing-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </section>

      <section className="landing-features-section">
        <h2 className="section-title">Why Choose Focus Tracker?</h2>
        <div className="landing-features">
          <div className="feature-card">
            <span>🎯</span>
            <h3>Track Focus</h3>
            <p>Measure your focus sessions and improve consistency.</p>
          </div>
          <div className="feature-card">
            <span>📊</span>
            <h3>Analyze Productivity</h3>
            <p>Get insights into your daily and weekly focus trends.</p>
          </div>
          <div className="feature-card">
            <span>🏆</span>
            <h3>Earn Badges</h3>
            <p>Motivate yourself with achievements and streaks.</p>
          </div>
        </div>
      </section>

      <section className="landing-testimonials-section">
        <h2 className="section-title">What Users Say</h2>
        <div className="landing-testimonials">
          <p>"Focus Tracker helped me boost my productivity by 40%!" - Alex</p>
          <p>"I love tracking my daily streaks and seeing progress!" - Jamie</p>
        </div>
      </section>

      <div className="landing-scroll">⬇ Scroll to explore</div>

      <AuthModal ref={authRef} onLoginSuccess={onStart!} />
    </>
  );
}

export default LandingPage;
