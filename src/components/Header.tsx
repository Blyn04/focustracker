import React from "react";
import { Button } from "antd";
import "../styles/Header.css";

interface HeaderProps {
  onOpenAchievements: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAchievements }) => {
  return (
    <header className="app-header">
      <div className="logo">
        🎯 <span>Focus Tracker</span>
      </div>
      <nav className="header-actions">
        <Button type="primary" onClick={onOpenAchievements}>
          🏆 Achievements
        </Button>
      </nav>
    </header>
  );
};

export default Header;
