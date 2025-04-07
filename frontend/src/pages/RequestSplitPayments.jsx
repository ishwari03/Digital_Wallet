import React, { useState } from "react";
import axios from "axios";

function RequestSplitPayments() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mobile No");
  const [inputValue, setInputValue] = useState("");
  const [amount, setAmount] = useState("");
  const [splitPeople, setSplitPeople] = useState("");

  const styles = {
    container: {
      textAlign: "center",
      padding: "30px",
      margin: "20px auto",
      maxWidth: "600px",
      background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
      borderRadius: "15px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      fontFamily: "'Arial', sans-serif",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      margin: "20px 0",
    },
    button: {
      padding: "12px 20px",
      fontSize: "16px",
      cursor: "pointer",
      background: "linear-gradient(135deg, #007bff, #0056b3)",
      color: "white",
      border: "none",
      borderRadius: "25px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    },
    buttonHover: {
      background: "linear-gradient(135deg, #0056b3, #003f7f)",
      transform: "translateY(-3px)",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
    },
    formContainer: {
      marginTop: "20px",
      padding: "20px",
      borderRadius: "15px",
      background: "#f8f9fa",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "left",
    },
    input: {
      display: "block",
      width: "100%",
      padding: "12px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "1rem",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      outline: "none",
      transition: "all 0.3s ease",
    },
    inputFocus: {
      borderColor: "#007bff",
      boxShadow: "0 0 8px rgba(0, 123, 255, 0.5)",
    },
    confirmButton: {
      background: "linear-gradient(135deg, #28a745, #218838)",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    },
    confirmButtonHover: {
      background: "linear-gradient(135deg, #218838, #1e7e34)",
      transform: "translateY(-3px)",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
    },
    cancelButton: {
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    },
    cancelButtonHover: {
      background: "linear-gradient(135deg, #c0392b, #a93226)",
      transform: "translateY(-3px)",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginTop: "15px",
    },
  };

  const getPlaceholder = () => {
    switch (selectedOption) {
      case "Email ID":
        return "Enter Email ID";
      case "Wallet ID":
        return "Enter Wallet ID";
      default:
        return "Enter Mobile No";
    }
  };

  const handleRequestConfirm = async () => {
    if (!inputValue || !amount) {
      alert("Please fill in all fields.");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("http://localhost:5000/api/wallet/request-payment", {
        recipient: inputValue,
      amount: parseFloat(amount),
      description: `Request via ${selectedOption}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      alert(response.data.message || `Request sent to ${inputValue} for ₹${amount}`);
      setShowRequestForm(false);
      setInputValue("");
      setAmount("");
    } catch (error) {
      console.error("Request error:", error);
      alert("Failed to send payment request.");
    }
  };

  const handleSplitConfirm = async () => {
    if (!inputValue || !amount || !splitPeople) {
      alert("Please fill in all fields.");
      return;
    }
    const token = localStorage.getItem("token");
    const participants = inputValue.split(",").map((id) => id.trim());
    try {
        const response = await axios.post("http://localhost:5000/api/wallet/split-payment", {
          amount: parseFloat(amount),
          description: `Split among ${splitPeople} people`,
          participants
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

    });

      alert(response.data.message || `Bill split among ${splitPeople} people.`);
      setShowSplitForm(false);
      setInputValue("");
      setAmount("");
      setSplitPeople("");
    } catch (error) {
      console.error("Split error:", error);
      alert("Failed to split the bill.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Request & Split Payments</h2>
      <div style={styles.buttonContainer}>
      <button style={styles.button} onClick={() => { setShowRequestForm(true); setShowSplitForm(false); }}>
        Request Money
      </button>
      <button style={styles.button} onClick={() => { setShowSplitForm(true); setShowRequestForm(false); }}>
        Split Bills
      </button>
      </div>
      {/* Request Money Form */}
      {showRequestForm && (
        <div style={styles.formContainer}>
          <h3>Request Money</h3>
          <select style={styles.input} onChange={(e) => setSelectedOption(e.target.value)}>
            <option>Mobile No</option>
            <option>Email ID</option>
            <option>Wallet ID</option>
          </select>
          <input type="text" placeholder={getPlaceholder()} style={styles.input} value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} />
          <input type="number" placeholder="Enter Amount" style={styles.input}  value={amount} 
            onChange={(e) => setAmount(e.target.value)} />
          <div style={styles.buttonGroup}>
          <button style={styles.confirmButton}  onClick={handleRequestConfirm}>Confirm Request</button>
          <button style={styles.cancelButton} onClick={() => setShowRequestForm(false)}>Cancel</button> 
          </div>
        </div>
      )}

      {/* Split Bills Form */}
      {showSplitForm && (
        <div style={styles.formContainer}>
          <h3>Split Bills</h3>
          <input type="text" placeholder="Enter Email/Mobile of Friends" style={styles.input}  value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}  />
          <input type="number" placeholder="Enter Total Bill Amount" style={styles.input}  value={amount} 
            onChange={(e) => setAmount(e.target.value)} />
          <input type="number" placeholder="No. of People" style={styles.input} value={splitPeople} 
            onChange={(e) => setSplitPeople(e.target.value)} />
          <div style={styles.buttonGroup}>
          <button style={styles.confirmButton} onClick={handleSplitConfirm}>Split Bill</button>
          <button style={styles.cancelButton} onClick={() => setShowSplitForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestSplitPayments;
