const express = require("express");
const { addTransaction, getWallet, addFunds } = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add Transaction (Debit or Credit)
router.post("/transaction", authMiddleware, addTransaction);

// ✅ Get Wallet Balance
router.get("/wallet", authMiddleware, getWallet);

// ✅ Add Funds to Wallet
router.post("/wallet/add-funds", authMiddleware, addFunds);

module.exports = router;
