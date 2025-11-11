import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import "../styles/Header.css";

interface HeaderProps {
  onShowBadges: () => void;
}

function Header({ onShowBadges }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // starts as login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    localStorage.getItem("loggedInUser")
  );

  const openModal = () => {
    setIsSignup(false); // always open with login mode
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleAuth = () => {
    if (isSignup) {
      if (!username || !password || !confirmPassword) {
        message.error("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        message.error("Passwords do not match.");
        return;
      }
      localStorage.setItem("user", JSON.stringify({ username, password }));
      message.success("Signup successful! You can now log in.");
      setIsSignup(false);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } else {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        message.error("No user found. Please sign up first.");
        return;
      }
      const user = JSON.parse(savedUser);
      if (user.username === username && user.password === password) {
        localStorage.setItem("loggedInUser", username);
        setLoggedInUser(username);
        message.success(`Welcome, ${username}!`);
        closeModal();
      } else {
        message.error("Invalid credentials.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    message.success("Logged out successfully.");
  };

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
        <button className="nav-btn">📊 Stats</button>
        <button className="nav-btn">⚙️ Settings</button>

        {loggedInUser ? (
          <>
            <span className="welcome-text">Hi, {loggedInUser}</span>
            <button className="nav-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </>
        ) : (
          <Button
            type="primary"
            shape="circle"
            icon={<LoginOutlined />}
            onClick={openModal}
            className="auth-btn"
          />
        )}
      </nav>

      <Modal
        title={isSignup ? "Sign Up" : "Login"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        {isSignup && (
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        )}
        <Button type="primary" block onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Login"}
        </Button>

        <div className="toggle-auth">
          {isSignup ? (
            <span>
              Already have an account?{" "}
              <a onClick={() => setIsSignup(false)}>Login</a>
            </span>
          ) : (
            <span>
              Don’t have an account?{" "}
              <a onClick={() => setIsSignup(true)}>Sign up</a>
            </span>
          )}
        </div>
      </Modal>
    </header>
  );
}

export default Header;
