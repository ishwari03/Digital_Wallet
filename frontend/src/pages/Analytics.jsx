import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("user");

  const [userData, setUserData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("token");
  
      if (activeTab === "user") {
        if (!storedToken) {
          console.error("No token found for user dashboard");
          return;
        }
        try {
          const res = await axios.get("/api/dashboard/user", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUserData(res.data);
        } catch (err) {
          console.error("Error loading user dashboard", err);
        }
      }
  
      if (activeTab === "admin") {
        try {
          const res = await axios.get("/api/dashboard/admin");
          setAdminData(res.data);
        } catch (err) {
          console.error("Error loading admin dashboard", err);
        }
      }
  
      if (activeTab === "reports") {
        try {
          const res = await axios.get("/api/analytics/transactions/monthly");
          setReportData(res.data);
        } catch (err) {
          console.error("Error loading reports", err);
        }
      }
    };
  
    fetchData();
  }, [activeTab]);

  const styles = {
    container: {
      width: "80%",
      margin: "20px auto",
      textAlign: "center",
      padding: "30px",
      borderRadius: "15px",
      background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      fontFamily: "'Arial', sans-serif",
    },
    tabs: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "30px",
    },
    button: {
      padding: "12px 20px",
      border: "none",
      background: "#f0f0f0",
      color: "#333",
      cursor: "pointer",
      fontSize: "16px",
      borderRadius: "25px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    activeButton: {
      background: "linear-gradient(135deg, #28a745, #218838)",
      color: "white",
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-2px)",
    },
    content: {
      padding: "20px",
      borderRadius: "15px",
      background: "#ffffff",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "left",
    },
    heading: {
      color: "#007bff",
      marginBottom: "20px",
      textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
    },
    list: {
      listStyleType: "none",
      padding: "0",
      margin: "10px 0",
    },
    listItem: {
      padding: "10px",
      marginBottom: "10px",
      background: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      fontSize: "1rem",
      color: "#555",
    },
    chartContainer: {
      marginTop: "20px",
      padding: "20px",
      borderRadius: "15px",
      background: "#f8f9fa",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Dashboards & Analytics</h2>

      <div style={styles.tabs}>
        {["user", "admin", "reports"].map((tab) => (
          <button
            key={tab}
            style={
              activeTab === tab
                ? { ...styles.button, ...styles.activeButton }
                : styles.button
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab === "user"
              ? "User Dashboard"
              : tab === "admin"
              ? "Admin Dashboard"
              : "Graphical Reports"}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === "user" && userData && (
          <div>
            <h3>User Dashboard</h3>
            <ul>
              <li>Current Balance: ₹{userData.balance}</li>
              <li>
                Last Transaction: ₹{userData.lastTransaction?.amount} (
                {userData.lastTransaction?.description})
              </li>
              <li>Cashback Earned: ₹{userData.cashbackEarned}</li>
            </ul>
          </div>
        )}

        {activeTab === "admin" && adminData && (
          <div>
            <h3>Admin Dashboard</h3>
            <ul>
              <li>Total Users: {adminData.totalUsers}</li>
              <li>Daily Transactions: ₹{adminData.dailyTransactions}</li>
              <li>Monthly Revenue: ₹{adminData.monthlyRevenue}</li>
            </ul>
          </div>
        )}

        {activeTab === "reports" && reportData.length > 0 && (
          <div>
            <h3>Graphical Reports</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
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
