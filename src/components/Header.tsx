import React from "react";
import "../styles/Header.css";

interface HeaderProps {
  onShowBadges: () => void;
}

function Header({ onShowBadges }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo">
        <span className="focus-icon">🎯</span>
        <h1 className="title">Focus Tracker</h1>
      </div>
      <nav className="nav-buttons">
        <button className="nav-btn" onClick={onShowBadges}>
          🏆 Achievements
        </button>
        <button className="nav-btn">
          📊 Stats
        </button>
        <button className="nav-btn">
          ⚙️ Settings
        </button>
      </nav>
    </header>
  );
}

export default Header;
