import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/AuthModal.css";

export interface AuthModalRef {
  open: () => void;
}

const AuthModal = forwardRef<AuthModalRef>((_, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const open = () => {
    setIsSignup(false);
    setIsModalOpen(true);
  };

  const close = () => {
    setIsModalOpen(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

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
        message.success(`Welcome, ${username}!`);
        close();
      } else {
        message.error("Invalid credentials.");
      }
    }
  };

  return (
    <Modal
      className="auth-modal"
      open={isModalOpen}
      onCancel={close}
      footer={null}
      centered
      closeIcon={<span className="close-btn">&times;</span>}
    >
      <div className="auth-card">
        <h2 className="auth-title">{isSignup ? "Sign Up" : "Login"}</h2>
        <p className="auth-subtitle">
          {isSignup
            ? "Create your account to start tracking focus."
            : "Login to continue tracking your focus sessions."}
        </p>

        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        {isSignup && (
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
          />
        )}

        <Button type="primary" block onClick={handleAuth} className="auth-btn">
          {isSignup ? "Sign Up" : "Login"}
        </Button>

        <div className="auth-toggle">
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
      </div>
    </Modal>
  );
});

export default AuthModal;
