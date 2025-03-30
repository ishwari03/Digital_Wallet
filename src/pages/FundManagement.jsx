import { useState } from "react";

function FundManagement() {
  const [balance, setBalance] = useState(10000);
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

  const handleTransaction = (type) => {
    const newAmount = parseFloat(amount);
    if (!newAmount || newAmount <= 0) return;

    let newBalance = balance;
    if (type === "Add") newBalance += newAmount;
    if (type === "Withdraw" && newAmount <= balance) newBalance -= newAmount;

    if (newBalance !== balance) {
      setBalance(newBalance);
      setTransactions([
        ...transactions,
        { id: transactions.length + 1, type, amount: newAmount, date: new Date().toLocaleString() },
      ]);
    }

    setAmount("");
  };

  const handleFundTransfer = () => {
    const newAmount = parseFloat(amount);
    if (!newAmount || newAmount <= 0 || newAmount > balance || !transferDetails.recipient) return;

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
  };

  const handleAddMoney = () => {
    const newAmount = parseFloat(amount);
    if (!newAmount || newAmount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    setBalance(balance + newAmount);
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
  };

  return (
    <div className="fund-container">
      <style>{`
        .fund-container {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
          width: 60%;
          margin: auto;
          
        }
        h2{color: white;} 
        h3 {
          color: #333;
        }
        .button-container {
        display: flex;
        justify-content: center; 
        gap: 10px; 
        margin: 20px 0;
      }
         .action-buttons {
        display: flex;
        justify-content: center; /* Centers buttons horizontally */
        gap: 10px; /* Adds spacing between buttons */
        margin-top: 10px;
      }
        button {
          margin: 10px;
          padding: 10px 15px;
          border: none;
          background: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 5px;
          align-items: center;
        }
        button:hover {
          background: #0056b3;
        }
        input, select {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
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
          <li key={tx.id}>{tx.date} - {tx.type}: ₹{tx.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default FundManagement;