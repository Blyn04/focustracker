import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import AuthModal, { AuthModalRef } from "./AuthModal";
import "../styles/Header.css";

interface HeaderProps {
  onShowBadges: () => void;
  hideNav?: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

function Header({ onShowBadges, hideNav = false, onLoginSuccess, onLogout }: HeaderProps) {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    localStorage.getItem("loggedInUser")
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const authModalRef = useRef<AuthModalRef>(null);

  useEffect(() => {
    const handleStorage = () => setLoggedInUser(localStorage.getItem("loggedInUser"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
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
                <button className="nav-btn" onClick={() => setShowLogoutModal(true)}>🚪 Logout</button>
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

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>Yes</button>
              <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
