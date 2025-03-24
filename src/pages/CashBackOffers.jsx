import { useState } from "react";

const CashbackOffers = () => {
  const [activeTab, setActiveTab] = useState("offers");

  const offers = [
    { id: 1, text: "10% Cashback on Mobile Recharge", code: "MOBILE10" },
    { id: 2, text: "₹50 Cashback on Bill Payments", code: "BILL50" },
    { id: 3, text: "Flat 5% off on Shopping", code: "SHOP5" },
  ];

  const cashback = [
    { id: 1, text: "₹200 Cashback Credited from Recharge" },
    { id: 2, text: "₹50 Cashback from Bill Payment" },
  ];

  return (
    <div style={styles.container}>
      <h3>Your balance <strong>Rs 10,000</strong></h3>

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

      {/* Content */}
      <div style={styles.content}>
        <h4>Available {activeTab === "offers" ? "Offers" : "Cashbacks"}</h4>
        {activeTab === "offers"
          ? offers.map((offer) => (
              <div key={offer.id} style={styles.card}>
                {offer.text} 
                <button style={styles.button}>Apply Code: {offer.code}</button>
              </div>
            ))
          : cashback.map((cb) => (
              <div key={cb.id} style={styles.card}>{cb.text}</div>
            ))}
      </div>
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
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  tab: {
    padding: "10px 20px",
    border: "1px solid gray",
    background: "lightgray",
    cursor: "pointer",
  },
  activeTab: {
    padding: "10px 20px",
    border: "1px solid gray",
    background: "green",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  content: {
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
  },
  card: {
    background: "#e3f2fd",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
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

export default CashbackOffers;
