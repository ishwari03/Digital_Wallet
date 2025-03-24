import React from "react";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>PayWay - Digital Wallet</h2>
      <div style={styles.rightSection}>
        <span style={styles.welcomeText}>Welcome!</span>
        
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
    backgroundColor: "#2c3e50",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  welcomeText: {
    fontSize: "16px",
  },
  logoutButton: {
    padding: "5px 10px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Navbar;
