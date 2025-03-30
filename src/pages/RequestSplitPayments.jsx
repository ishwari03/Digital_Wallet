import React, { useState } from "react";

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
      padding: "20px",
    },
    button: {
      margin: "10px",
      padding: "10px 15px",
      fontSize: "16px",
      cursor: "pointer",
      backgroundColor: "#2c3e50",
      color: "white",
      border: "none",
      borderRadius: "5px",
    },
    formContainer: {
      marginTop: "20px",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      display: "inline-block",
      textAlign: "left",
    },
    input: {
      display: "block",
      width: "100%",
      padding: "8px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    confirmButton: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "8px 15px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px",
    },
    cancelButton: {
      backgroundColor: "#e74c3c",
      color: "white",
      padding: "8px 15px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
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

  const handleRequestConfirm = () => {
    if (!inputValue || !amount) {
      alert("Please fill in all fields.");
      return;
    }
    alert(`Request sent to ${inputValue} for ₹${amount}`);
    setShowRequestForm(false);
  };

  const handleSplitConfirm = () => {
    if (!inputValue || !amount || !splitPeople) {
      alert("Please fill in all fields.");
      return;
    }
    const splitAmount = (amount / splitPeople).toFixed(2);
    alert(`Each person needs to pay ₹${splitAmount}`);
    setShowSplitForm(false);
  };

  return (
    <div style={styles.container}>
      <h2>Request & Split Payments</h2>
      <button style={styles.button} onClick={() => { setShowRequestForm(true); setShowSplitForm(false); }}>
        Request Money
      </button>
      <button style={styles.button} onClick={() => { setShowSplitForm(true); setShowRequestForm(false); }}>
        Split Bills
      </button>

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
          <button style={styles.confirmButton}  onClick={handleRequestConfirm}>Confirm Request</button>
          <button style={styles.cancelButton} onClick={() => setShowRequestForm(false)}>Cancel</button>
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
          <button style={styles.confirmButton} onClick={handleSplitConfirm}>Split Bill</button>
          <button style={styles.cancelButton} onClick={() => setShowSplitForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default RequestSplitPayments;
