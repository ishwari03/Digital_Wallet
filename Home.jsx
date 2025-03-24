import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <img src="wallet.png" alt="Wallet" className="hero-image" />
        <h1>Welcome to PayWay</h1>
        <p>Secure, Fast, and Easy Payments at Your Fingertips</p>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
