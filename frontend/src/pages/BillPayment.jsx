import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BillPayment() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [amount, setAmount] = useState("");
  const [billType, setBillType] = useState("");
  const [billDetails, setBillDetails] = useState("");
  const [transactions, setTransactions] = useState([]);

  // ✅ Fetch balance from backend on load
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("/api/wallet");
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions");
      const txns = res.data.transactions
        .filter((tx) => tx.type === "bill") // ✅ Optional: only bill payments
        .map((tx) => ({
          id: tx._id,
          type: `${tx.category} - ${tx.biller}`,
          amount: tx.amount,
          date: new Date(tx.createdAt || tx.date).toLocaleString(),
        }));
      setTransactions(txns);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleBillPayment = async () => {
    const newAmount = parseFloat(amount);
    if (!newAmount || newAmount <= 0 || newAmount > balance || !billType || !billDetails) return;

    try {
      const res = await axios.post("/api/wallet/paybill", {
        amount: newAmount,
        biller: billDetails,
        category: billType,
        description: `Bill payment for ${billType}`,
      });

      // Update balance and transactions
      await fetchBalance(); // Refresh the balance from backend
      setTransactions((prev) => [
        ...prev,
        {
          id: res.data.transaction.id,
          type: `${billType} - ${billDetails}`,
          amount: newAmount,
          date: new Date().toLocaleString(),
        },
      ]);

      setAmount("");
      setBillType("");
      setBillDetails("");
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <div className="bill-container">
      <style>{`
  .bill-container {
    padding: 20px;
    background: linear-gradient(135deg, #ffffff, #f0f0f0);
    border-radius: 15px;
    width: 60%; /* Matches the wallet-container size */
    margin: auto;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    font-family: 'Arial', sans-serif;
  }
  h2, h3 {
    color: #333;
    margin-bottom: 20px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }
  p {
    font-size: 18px;
    color: #555;
    margin-bottom: 20px;
  }
  select, input {
    width: calc(100% - 20px);
    padding: 12px;
    margin-bottom: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: all 0.3s ease;
  }
  select:focus, input:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }
  button {
    width: calc(100% - 20px);
    padding: 12px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
  }
  button:hover {
    background: linear-gradient(135deg, #0056b3, #003f7f);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  ul {
    text-align: left;
    margin-top: 20px;
    padding: 0;
    list-style-type: none;
  }
  li {
    padding: 10px;
    margin-bottom: 10px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
    color: #555;
  }
  li:nth-child(odd) {
    background: #f0f0f0;
  }
`}</style>

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

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
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