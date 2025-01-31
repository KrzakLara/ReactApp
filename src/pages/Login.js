import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../pages/features/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((response) => {
      if (!response.error) {
        alert("Login successful!");
  
        // Set the user role and token in localStorage
        const isAdmin = email === "admin@email.com"; // Replace with real backend logic
        localStorage.setItem("userRole", isAdmin ? "admin" : "user");
        localStorage.setItem("token", response.payload.token);
  
        // Redirect based on role
        if (isAdmin) {
          navigate("/customer-management");
        } else {
          navigate("/registered-dashboard");
        }
      }
    });
  };
  

  return (
    <div className="auth-container">
      <div className="login-form">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
