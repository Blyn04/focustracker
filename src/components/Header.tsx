import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import AuthModal, { AuthModalRef } from "./AuthModal";
import "../styles/Header.css";

interface HeaderProps {
  onShowBadges: () => void;
  hideNav?: boolean;
  onLoginSuccess: () => void; // Called when login succeeds
  onLogout: () => void; // Called when logout happens
}

function Header({ onShowBadges, hideNav = false, onLoginSuccess, onLogout }: HeaderProps) {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    localStorage.getItem("loggedInUser")
  );

  const authModalRef = useRef<AuthModalRef>(null);

  // Update local state if user logs in elsewhere
  useEffect(() => {
    const handleStorage = () => {
      setLoggedInUser(localStorage.getItem("loggedInUser"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    onLogout(); // Tell App to go back to LandingPage
  };

  return (
    <header className="header">
      <div className="logo">
        <span className="focus-icon">🎯</span>
        <h1 className="title">Focus Tracker</h1>
      </div>

      {!hideNav && (
        <nav className="nav-buttons">
          <button className="nav-btn" onClick={onShowBadges}>🏆 Achievements</button>
          <button className="nav-btn">📊 Stats</button>
          <button className="nav-btn">⚙️ Settings</button>

          {loggedInUser ? (
            <>
              <span className="welcome-text">Hi, {loggedInUser}</span>
              <button className="nav-btn" onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : (
            <Button
              type="primary"
              shape="circle"
              icon={<LoginOutlined />}
              onClick={() => authModalRef.current?.open()}
              className="auth-btn"
            />
          )}
        </nav>
      )}

      {hideNav && !loggedInUser && (
        <Button
          type="primary"
          shape="circle"
          icon={<LoginOutlined />}
          onClick={() => authModalRef.current?.open()}
          className="auth-btn"
        />
      )}

      <AuthModal ref={authModalRef} onLoginSuccess={onLoginSuccess} />
    </header>
  );
}

export default Header;
