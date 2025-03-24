import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Add styles
import { useEffect } from "react";
function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
        navigate("/login");
    }
}, [user, navigate]);
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      {/* <nav className="navbar">
        <h2>PayWay- Digital Wallet</h2>
        <div className="user-info">
          <span>Welcome, {user.email}!</span>
          <div className="user-avatar">{user.email[0].toUpperCase()}</div>
        </div>
      </nav> */}

      {/* Dashboard Icons */}
      <div className="features-grid">
        <div className="feature" onClick={() => navigate("/wallet")}>
          <i className="fas fa-wallet"></i>
          <p>Wallet Management</p>
        </div>
        <div className="feature" onClick={() => navigate("/funds")}>
          <i className="fas fa-dollar-sign"></i>
          <p>Funds Management</p>
        </div>
        <div className="feature">
          <i className="fas fa-qrcode"></i>
          <p>Scan & Pay</p>
        </div>
        <div className="feature">
          <i className="fas fa-chart-line"></i>
          <p>Dashboard & Analysis</p>
        </div>
        <div className="feature" onClick={() => navigate("/billpayment")}>
          <i className="fas fa-file-invoice"></i>
          <p>Recharge & Bills</p>
        </div>
        <div className="feature" onClick={() => navigate("/request-split-payments")}>
          <i className="fas fa-user-friends"></i>
          <p>Request/Splits</p>
        </div>
        <div className="feature" onClick={() => navigate("/cashback-offers")}>
          <i className="fas fa-shopping-cart"></i>
          <p>Cashback Offers</p>
        </div>
        <div className="feature">
          <i className="fas fa-bell"></i>
          <p>Notifications</p>
        </div>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
