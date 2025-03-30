import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("user");

  // Sample Data for Graph
  const transactionData = [
    { name: "Jan", Transactions: 400 },
    { name: "Feb", Transactions: 300 },
    { name: "Mar", Transactions: 500 },
    { name: "Apr", Transactions: 450 },
  ];

  // Internal Styles
  const styles = {
    container: {
      width: "80%",
      margin: "auto",
      textAlign: "center",
      padding: "20px",
      borderRadius: "8px",
      background: "#f8f9fa",
    },
    tabs: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "20px",
    },
    button: {
      padding: "10px 15px",
      border: "none",
      background: "lightgray",
      cursor: "pointer",
      fontSize: "16px",
    },
    activeButton: {
      background: "green",
      color: "white",
      fontWeight: "bold",
    },
    content: {
      padding: "20px",
      borderRadius: "8px",
      background: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Dashboards & Analytics</h2>

      {/* Tabs for User/Admin Dashboard */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "user" ? { ...styles.button, ...styles.activeButton } : styles.button}
          onClick={() => setActiveTab("user")}
        >
          User Dashboard
        </button>
        <button
          style={activeTab === "admin" ? { ...styles.button, ...styles.activeButton } : styles.button}
          onClick={() => setActiveTab("admin")}
        >
          Admin Dashboard
        </button>
        <button
          style={activeTab === "reports" ? { ...styles.button, ...styles.activeButton } : styles.button}
          onClick={() => setActiveTab("reports")}
        >
          Graphical Reports
        </button>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        {activeTab === "user" && (
          <div>
            <h3>User Dashboard</h3>
            <p>Welcome to your dashboard. Here you can see your transactions, cashback, and payments.</p>
            <ul>
              <li>Current Balance: ₹10,000</li>
              <li>Last Transaction: ₹500 (Recharge)</li>
              <li>Cashback Earned: ₹200</li>
            </ul>
          </div>
        )}

        {activeTab === "admin" && (
          <div>
            <h3>Admin Dashboard</h3>
            <p>Admin overview of platform usage, active users, and revenue.</p>
            <ul>
              <li>Total Users: 10,000</li>
              <li>Daily Transactions: ₹5,00,000</li>
              <li>Monthly Revenue: ₹20,00,000</li>
            </ul>
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <h3>Graphical Reports</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Transactions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
