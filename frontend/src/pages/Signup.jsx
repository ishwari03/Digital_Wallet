import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signup } from "../api"; 
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (name && email && password) {
    try {
      const userData = await signup(name, email, password);
      localStorage.setItem("token", userData.token); // Store token
      login(userData); // Update context
      navigate("/dashboard"); // Redirect
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  }
  else {
    alert("Please enter valid details!");
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    console.log("Sending login request...");
    const userData = await login(email, password);
    console.log("Login Success:", userData);
    localStorage.setItem("token", userData.token);
    login(userData);
    navigate("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please try again.");
  }
};


  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
        <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
