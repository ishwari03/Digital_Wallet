import { useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "You received ₹500 from Aman", read: false },
    { id: 2, text: "Cashback ₹50 credited", read: false },
    { id: 3, text: "Your bill payment was successful", read: false },
  ]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div style={styles.container}>
      <h3>🔔 Notifications</h3>
      {notifications.map((notif) => (
        <div key={notif.id} style={notif.read ? styles.read : styles.unread}>
          {notif.text}
          {!notif.read && (
            <button style={styles.button} onClick={() => markAsRead(notif.id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Styles
const styles = {
  container: {
    width: "60%", // Reduced width for a cleaner layout
    margin: "20px auto", // Added spacing at the top
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
    background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  unread: {
    background: "#e3f2fd",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  read: {
    background: "#d6d6d6",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "gray",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  button: {
    background: "linear-gradient(135deg, #007bff, #0056b3)",
    color: "white",
    border: "none",
    padding: "8px 16px",
    cursor: "pointer",
    borderRadius: "25px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  buttonHover: {
    background: "linear-gradient(135deg, #0056b3, #003f7f)",
    transform: "translateY(-3px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
};
export default Notifications;
