import { useState, useEffect } from "react";
import axios from "axios";

const CashbackOffers = () => {
  const [activeTab, setActiveTab] = useState("offers");
  const [balance, setBalance] = useState(null); // Set to null initially
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const offers = [
    { id: 1, text: "10% Cashback on Mobile Recharge", code: "MOBILE10", amount: 100 },
    { id: 2, text: "₹50 Cashback on Bill Payments", code: "BILL50", amount: 50 },
    { id: 3, text: "Flat 5% off on Shopping", code: "SHOP5", amount: 75 },
  ];

  const cashback = [
    { id: 1, text: "₹200 Cashback Credited from Recharge", amount: 200 },
    { id: 2, text: "₹50 Cashback from Bill Payment", amount: 50 },
  ];

  // 🧠 Fetch balance from backend
  const fetchBalance = async () => {
    try {
      const res = await axios.get("/api/wallet");
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const applyOffer = async (amount, text) => {
    try {
      // optionally call backend to apply offer
      await axios.post("/api/wallet/apply-offer", { amount, text });
      setBalance((prev) => prev - amount);
      showMessage(`✅ Offer applied: ${text}`);
    } catch (err) {
      console.error("Error applying offer:", err);
    }
  };

  const addCashback = async (amount, text) => {
    try {
      await axios.post("/api/wallet/add-cashback", { amount, text });
      setBalance((prev) => prev + amount);
      showMessage(`💰 Cashback added: ${text}`);
    } catch (err) {
      console.error("Error adding cashback:", err);
    }
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading balance...</div>;

  return (
    <div style={styles.container}>
      <h3>Your Balance: <strong>₹{balance}</strong></h3>

      {message && <div role="alert" style={styles.message}>{message}</div>}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "offers" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("offers")}
        >
          Offers
        </button>
        <button
          style={activeTab === "cashback" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("cashback")}
        >
          Cashback
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        <h4>{activeTab === "offers" ? "Available Offers" : "Available Cashbacks"}</h4>

        {(activeTab === "offers" ? offers : cashback).map((item) => (
          <div key={item.id} style={styles.card}>
            {item.text}
            <button
              style={styles.button}
              onClick={() =>
                activeTab === "offers"
                  ? applyOffer(item.amount, item.text)
                  : addCashback(item.amount, item.text)
              }
            >
              {activeTab === "offers" ? `Apply Code: ${item.code}` : "Claim"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// same styles as before...
const styles = {
  container: {
    maxWidth: "800px", // Increased width for a larger container
    margin: "auto",
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
    padding: "30px", // Increased padding for better spacing
    background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  message: {
    background: "#d4edda",
    color: "#155724",
    padding: "10px",
    margin: "15px 0",
    borderRadius: "5px",
    fontWeight: 500,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  tab: {
    padding: "10px 20px",
    background: "#f0f0f0",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "25px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  activeTab: {
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    border: "1px solid #28a745",
    fontWeight: "bold",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  content: {
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  card: {
    background: "#e3f2fd",
    padding: "15px 20px",
    margin: "10px 0",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  cardHover: {
    background: "#d1ecf1",
    transform: "translateY(-3px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  button: {
    background: "#007bff",
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
    background: "#0056b3",
    transform: "translateY(-3px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
};

export default CashbackOffers;
