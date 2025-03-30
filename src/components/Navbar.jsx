import React, { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>PayWay - Digital Wallet</h2>
      
      <div style={styles.rightSection}>
        <span style={styles.welcomeText}>Welcome!</span>
        
        {/* User Profile Section */}
        <div style={styles.profile} onClick={() => setMenuOpen(!menuOpen)}>
          <div style={styles.avatar}>P</div>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div style={styles.dropdownMenu}>
            <p style={styles.dropdownItem}>Profile</p>
            <p style={styles.dropdownItem}>Settings</p>
            <p style={styles.dropdownItem}>Logout</p>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #0070f3, #00d4ff)",
    color: "white",
    position: "relative",
  },
  logo: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    position: "relative",
  },
  welcomeText: {
    fontSize: "30px",
  },
  profile: {
    cursor: "pointer",
  },
  avatar: {
    width: "40px",
    height: "40px",
    background: "white",
    color: "#0070f3",
    fontWeight: "bold",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
  },
  dropdownMenu: {
    position: "absolute",
    top: "50px",
    right: "10px",
    background: "white",
    color: "#333",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "120px",
    textAlign: "center",
    padding: "10px 0",
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  dropdownItemHover: {
    background: "#f0f0f0",
  },
};

export default Navbar;
