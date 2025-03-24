import { useState } from "react";

function FundManagement() {
  const [balance, setBalance] = useState(10000);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transferDetails, setTransferDetails] = useState({ method: "", recipient: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Missing states added
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

  return (
    <div className="fund-container">
      <h2>Fund Management</h2>
      <p><strong>Current Balance:</strong> ₹{balance}</p>

      {/* Main Buttons */}
      <div>
        <button onClick={() => setSelectedOption("AddMoney")}>Add Money</button>
        <button onClick={() => setSelectedOption("WithdrawMoney")}>Withdraw Money</button>
        <button onClick={() => setSelectedOption("FundTransfer")}>Fund Transfer</button>
      </div>

      {selectedOption === "AddMoney" && (
        <div className="add-money-container">
          <h3>Add Money</h3>

          {/* Payment Method Dropdown */}
          <select value={depositMethod} onChange={(e) => setDepositMethod(e.target.value)}>
            <option value="">Select Payment Method</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Credit/Debit Card</option>
          </select>

          {/* UPI Input */}
          {depositMethod === "upi" && (
            <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
          )}

          {/* Bank Transfer Inputs */}
          {depositMethod === "bank" && (
            <>
              <input type="text" placeholder="Bank Account Number" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
              <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
            </>
          )}

          {/* Card Inputs */}
          {depositMethod === "card" && (
            <>
              <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              <input type="password" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
            </>
          )}

          {/* Amount Input */}
          <input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

          {/* Buttons */}
          <button onClick={() => alert(`Added Rs ${amount} via ${depositMethod.toUpperCase()}`)}>Confirm</button>
          <button onClick={() => setSelectedOption(null)}>Cancel</button>
        </div>
      )}

      {/* Withdraw Money */}
      {selectedOption === "WithdrawMoney" && (
        <div>
          <h3>Withdraw Money</h3>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Amount" />
          <button onClick={() => handleTransaction("Withdraw")}>Withdraw</button>
        </div>
      )}

      {/* Fund Transfer */}
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
          <button onClick={handleFundTransfer}>Transfer</button>
        </div>
      )}

      {/* Transaction History */}
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

export default FundManagement;
