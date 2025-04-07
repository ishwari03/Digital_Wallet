import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000"; 
function FundManagement() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transferDetails, setTransferDetails] = useState({ method: "", recipient: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  
  const [depositMethod, setDepositMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
 
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/wallet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const walletBalance = Number(res.data.balance);
        setBalance(walletBalance);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
        setBalance(0); // Fallback
      }
    };
  
    fetchBalance();
  }, []);
  
  // ➖ Debit or Credit Transaction
  const handleTransaction = async (type) => {
    try {
      const newAmount = parseFloat(amount);
      if (!newAmount || newAmount <= 0) return;

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/transaction",
        {
          amount: newAmount,
          type: type === "Add" ? "credit" : "debit",
          description: `${type} funds`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (type === "Add") setBalance(balance + newAmount);
      else if (type === "Withdraw") setBalance(balance - newAmount);

      setTransactions([
        ...transactions,
        { id: transactions.length + 1, type, amount: newAmount, date: new Date().toLocaleString() },
      ]);
      setAmount("");
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  const handleFundTransfer = async () => {
    try {
      const newAmount = parseFloat(amount);
      // if (!newAmount || newAmount <= 0 || newAmount > balance || !transferDetails.recipient) return;

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/wallet/transfer",
        {
          recipientType: transferDetails.method.toLowerCase(), // e.g. 'email', 'phone', 'walletid'
        recipientValue: transferDetails.recipient,
          amount: newAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setBalance(balance - newAmount);
      setTransactions([
        ...transactions,
        {
          id: transactions.length + 1,
          type: `Transfer to ${transferDetails.recipient}`,
          amount: newAmount,
          date: new Date().toLocaleString(),
        },
      ]);

      setAmount("");
      setTransferDetails({ method: "", recipient: "" });
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  const handleAddMoney = async () => {
    try {
      const newAmount = parseFloat(amount);
      if (!newAmount || newAmount <= 0) {
        alert("Enter a valid amount.");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/wallet/add",
        { amount: newAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance((prev) => Number(prev) + Number(newAmount));

      setTransactions([
        ...transactions,
        {
          id: transactions.length + 1,
          type: `Added via ${depositMethod.toUpperCase()}`,
          amount: newAmount,
          date: new Date().toLocaleString(),
        },
      ]);

      alert(`Added ₹${newAmount} via ${depositMethod.toUpperCase()}`);
      setAmount("");
      setDepositMethod("");
      setSelectedOption(null);
    } catch (err) {
      console.error("Add money failed:", err);
    }
  };

  return (
    <div className="fund-container">
      <style>{`
  .fund-container {
    padding: 20px;
    background: linear-gradient(135deg, #ffffff, #f0f0f0);
    border-radius: 15px;
    width: 60%;
    margin: auto;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    font-family: 'Arial', sans-serif;
  }
  h2 {
    color: #333;
    margin-bottom: 20px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }
  h3 {
    color: #007bff;
    margin-bottom: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }
  p {
    font-size: 18px;
    color: #555;
    margin-bottom: 20px;
  }
  .button-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 20px 0;
  }
  .button-container button {
    padding: 12px 20px;
    border: none;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    font-size: 16px;
    font-weight: bold;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .button-container button:hover {
    background: linear-gradient(135deg, #0056b3, #003f7f);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  input, select {
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
  input:focus, select:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
  }
  .action-buttons button {
    padding: 10px 20px;
    border: none;
    background: linear-gradient(135deg, #28a745, #218838);
    color: white;
    font-size: 14px;
    font-weight: bold;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .action-buttons button:hover {
    background: linear-gradient(135deg, #218838, #1e7e34);
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
      <h2>Fund Management</h2>
      <p><strong>Current Balance:</strong> ₹{balance}</p>
      <div className="button-container">
        <button onClick={() => setSelectedOption("AddMoney")}>Add Money</button>
        <button onClick={() => setSelectedOption("WithdrawMoney")}>Withdraw Money</button>
        <button onClick={() => setSelectedOption("FundTransfer")}>Fund Transfer</button>
      </div>

      {selectedOption === "AddMoney" && (
        <div>
          <h3>Add Money</h3>
          <select value={depositMethod} onChange={(e) => setDepositMethod(e.target.value)}>
            <option value="">Select Payment Method</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Credit/Debit Card</option>
          </select>
          {depositMethod === "upi" && <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />}
          {depositMethod === "bank" && (
            <>
              <input type="text" placeholder="Bank Account Number" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
              <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
            </>
          )}
          {depositMethod === "card" && (
            <>
              <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              <input type="password" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
            </>
          )}
          <input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="action-buttons">
          <button onClick={handleAddMoney}>Confirm</button>
          <button onClick={() => setSelectedOption(null)}>Cancel</button>
          </div>
        </div>
      )}

      {selectedOption === "WithdrawMoney" && (
        <div>
          <h3>Withdraw Money</h3>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Amount" />
          <div className="action-buttons">
            <button onClick={() => handleTransaction("Withdraw")}>Withdraw</button>
            <button onClick={() => setSelectedOption(null)}>Cancel</button>
        </div>
        </div>
      )}

      {selectedOption === "FundTransfer" && (
        <div>
          <h3>Fund Transfer</h3>
          <select value={transferDetails.method} onChange={(e) => setTransferDetails({ ...transferDetails, method: e.target.value })}>
            <option value="">Select Transfer Method</option>
            <option value="Phone">Phone Number</option>
            <option value="Email">Email</option>
            <option value="Wallet">Wallet ID</option>
          </select>
          <input type="text" placeholder="Enter recipient" value={transferDetails.recipient} onChange={(e) => setTransferDetails({ ...transferDetails, recipient: e.target.value })} />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Amount" />
          <div className="action-buttons">
          <button onClick={handleFundTransfer}>Transfer</button>
          <button onClick={() => setSelectedOption(null)}>Cancel</button>
        </div>
        </div>
      )}

      <h3>Transaction History</h3>
      <ul>
      {transactions.map((tx) => (
        <li key={tx.id} style={{ marginBottom: '10px', padding: '10px', background: '#eee', borderRadius: '5px' }}>
          <strong>{tx.type}</strong><br />
          ₹{tx.amount} on {tx.date}
        </li>
      ))}
      </ul>

    </div>
  );
}

export default FundManagement;