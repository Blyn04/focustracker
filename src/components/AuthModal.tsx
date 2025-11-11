import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/AuthModal.css";

export interface AuthModalRef {
  open: () => void;
}

interface AuthModalProps {
  onLoginSuccess: () => void; // callback when login succeeds
}

const AuthModal = forwardRef<AuthModalRef, AuthModalProps>(({ onLoginSuccess }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const open = () => {
    setIsSignup(false);
    setIsModalOpen(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const close = () => {
    setIsModalOpen(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  useImperativeHandle(ref, () => ({ open }));

  const handleAuth = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    if (isSignup) {
      if (!confirmPassword) {
        setErrorMessage("Confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ username, password }));
      setSuccessMessage("Signup successful! You can now log in.");
      setIsSignup(false);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    // Login
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setErrorMessage("No user found. Please sign up first.");
      return;
    }

    const user = JSON.parse(savedUser);
    if (user.username === username && user.password === password) {
      localStorage.setItem("loggedInUser", username);
      close();
      onLoginSuccess(); // <-- Notify parent
    } else {
      setErrorMessage("Invalid credentials.");
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

        {errorMessage && <div className="auth-error-modal">{errorMessage}</div>}
        {successMessage && <div className="auth-success-modal">{successMessage}</div>}

        <Button type="primary" block onClick={handleAuth} className="auth-btn">
          {isSignup ? "Sign Up" : "Login"}
        </Button>

        <div className="auth-toggle">
          {isSignup ? (
            <span>
              Already have an account?{" "}
              <a
                onClick={() => {
                  setIsSignup(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                Login
              </a>
            </span>
          ) : (
            <span>
              Don’t have an account?{" "}
              <a
                onClick={() => {
                  setIsSignup(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                Sign up
              </a>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
});

export default AuthModal;
