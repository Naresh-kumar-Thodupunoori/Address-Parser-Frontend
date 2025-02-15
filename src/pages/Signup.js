import React, { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/Password Signup
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

  // Google Signup (Same as Google Sign-In)
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
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
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
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <button onClick={handleGoogleSignup} className="google-button">
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
