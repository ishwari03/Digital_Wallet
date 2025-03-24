import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BillPayment() {
    const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [amount, setAmount] = useState("");
  const [billType, setBillType] = useState("");
  const [billDetails, setBillDetails] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!billType) {
      navigate("/billpayment");
    }
  }, [billType, navigate]);

  const handleBillPayment = () => {
    const newAmount = parseFloat(amount);
    if (!newAmount || newAmount <= 0 || newAmount > balance || !billType || !billDetails) return;

    setBalance(balance - newAmount);
    setTransactions([
      ...transactions,
      {
        id: transactions.length + 1,
        type: `${billType} - ${billDetails}`,
        amount: newAmount,
        date: new Date().toLocaleString(),
      },
    ]);

    setAmount("");
    setBillType("");
    setBillDetails("");
  };

  return (
    <div className="bill-container">
      <h2>Bill Payment & Recharge</h2>
      <p><strong>Current Balance:</strong> ₹{balance}</p>

      <div>
        <select value={billType} onChange={(e) => setBillType(e.target.value)}>
          <option value="">Select Payment Type</option>
          <option value="Mobile Recharge">Mobile Recharge</option>
          <option value="Utility Bill">Utility Bill Payments</option>
          <option value="Subscription">Subscriptions</option>
        </select>

        <input
          type="text"
          placeholder="Enter Mobile Number / Bill ID / Provider"
          value={billDetails}
          onChange={(e) => setBillDetails(e.target.value)}
        />

        <input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={handleBillPayment}>Pay Now</button>
      </div>

      <h3>Transaction History</h3>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.date} - {tx.type}: ₹{tx.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BillPayment;

const styles = {
    container: {
      width: "400px",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
    },
    title: { fontSize: "22px", fontWeight: "bold", marginBottom: "10px" },
    balance: { fontSize: "18px", color: "#333", marginBottom: "15px" },
    select: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    input: {
      width: "calc(100% - 20px)",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007BFF",
      color: "#fff",
      fontSize: "16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    buttonHover: { backgroundColor: "#0056b3" },
    transactionList: { textAlign: "left", marginTop: "15px" },
    transactionItem: {
      padding: "8px",
      borderBottom: "1px solid #ddd",
      fontSize: "14px",
    },
  };
  