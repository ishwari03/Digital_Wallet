import React, { useState, useEffect } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("user@gmail.com"); // Example email
  const [userName, setUserName] = useState("");

  // Extract the first letter of the email
  useEffect(() => {
    if (userEmail) {
      setUserName(userEmail.charAt(0).toUpperCase());
    }
  }, [userEmail]);

  

  const handleLogout = () => {
    console.log("User logged out");
    // Add logout logic here
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>PayWay - Digital Wallet</h2>

      <div style={styles.rightSection}>
        <span style={styles.welcomeText}>Welcome!</span>

        {/* User Profile Section */}
        <div
          className="profile"
          style={styles.profile}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div style={styles.avatar}>{userName}</div>
        </div>

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
    fontSize: "1rem",
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
 
}
export default Navbar;