import { useState } from "react";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const createWallet = () => {
    setWallet("WALLET12345");
    setBalance(10000); // Initial balance
    setTransactions([{ id: 1, type: "Credit", amount: 1000, date: new Date().toLocaleString() }]);
  };

  return (
    <div className="wallet-container">
      <h2>Wallet Management</h2>

      {!wallet ? (
        <button onClick={createWallet}>Create Wallet</button>
      ) : (
        <div>
          <p><strong>Wallet ID:</strong> {wallet}</p>
          <p><strong>Balance:</strong> ₹{balance}</p>

          <h3>Transaction History</h3>
          <ul>
            {transactions.map((tx) => (
              <li key={tx.id}>
                {tx.date} - {tx.type}: ₹{tx.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Wallet;
