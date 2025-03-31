const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const User = require("../models/User"); // Import the User model

exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    const userId = req.user.id;

    // 🔹 Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // 🔹 Update wallet balance based on transaction type
    if (type === "debit") {
      if (wallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      wallet.balance -= amount;
    } else if (type === "credit") {
      wallet.balance += amount;
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    await wallet.save();

    // 🔹 Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      amount,
      type,
      description,
    });

    res.status(201).json({ transaction, balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json({ walletBalance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    // 🔹 Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // 🔹 Add funds to wallet
    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({ message: "Funds added successfully", balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};