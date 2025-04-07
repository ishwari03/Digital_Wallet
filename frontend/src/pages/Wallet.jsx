import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Wallet() {
  const { token } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");

  const fetchWalletData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleAddFunds = async () => {
    const parsedAmount = parseInt(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/wallet/add",
        { amount: parsedAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(res.data.balance);
      setAmount("");
      fetchTransactions();
    } catch (err) {
      console.error("Add funds error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [token]);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="wallet-container">
      <style>{`
  .wallet-container {
    padding: 20px;
    background: linear-gradient(135deg, #ffffff, #f0f0f0);
    border-radius: 15px;
    width: 60%;
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
  .input-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }
  input {
    padding: 10px;
    margin: 10px;
    width: 200px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: all 0.3s ease;
  }
  input:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }
  button {
    margin: 10px;
    padding: 12px 20px;
    border: none;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    cursor: pointer;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  button:hover {
    background: linear-gradient(135deg, #0056b3, #003f7f);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
  }
  li {
    margin: 10px 0;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: #555;
    font-size: 0.9rem;
    text-align: left;
  }
  li:nth-child(odd) {
    background: #f0f0f0;
  }
`}</style>

      <h2>Wallet Management</h2>
      <p><strong>Balance:</strong> ₹{balance}</p>
      <div className="input-button-container">
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleAddFunds}>Add Funds</button>
      </div>
      <h3>Transaction History</h3>
      <ul>
        {sortedTransactions.map((txn, idx) => (
          <li key={idx}>
            ₹{txn.amount} - {txn.type.toUpperCase()} - {new Date(txn.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wallet;
