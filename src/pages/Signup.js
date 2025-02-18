/*frontend/src/pages/signup.js*/
import React, { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import googleIcon from "../google-icon.svg";
import "../pages/Auth.css";

const Signup = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } catch (err) {
      setError("Google signup failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* <img src="/logo.svg" alt="Logo" className="auth-logo" /> */}
        <h2 className="auth-title">Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        <button onClick={handleGoogleSignup} className="google-button">
          <img src={googleIcon} alt="Google" width="18" height="18" />
          Sign up with Google
        </button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;