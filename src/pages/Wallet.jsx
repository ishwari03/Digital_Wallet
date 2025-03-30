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
      <style>{`
        .wallet-container {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
          width: 60%;
          margin: auto;
          text-align: center;
        }
          .create-wallet{
          display: flex;
          justify-content: center;
          align-items: center;
          }
        h2 {
          color: #333;
        }
        h3 {
          color: #333;
        }
        button {
          margin: 10px;
          padding: 10px 15px;
          border: none;
          background: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 5px;
        }
        button:hover {
          background: #0056b3;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 5px 0;
          color: #555;
        }
      `}</style>
      <h2>Wallet Management</h2>

      {!wallet ? (
        <div className="create-wallet">
        <button onClick={createWallet}>Create Wallet</button>
        </div>
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