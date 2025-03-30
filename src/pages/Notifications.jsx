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
    width: "80%",
    margin: "auto",
    textAlign: "center",
  },
  unread: {
    background: "#e3f2fd",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
  },
  read: {
    background: "#d6d6d6",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "gray",
  },
  button: {
    background: "blue",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Notifications;
