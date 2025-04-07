// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// 🔌 Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// 🧾 Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
});
const User = mongoose.model("User", userSchema);

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: { type: Number, default: 0 },
  walletId: { type: String, unique: true },
});
const Wallet = mongoose.model("Wallet", walletSchema);

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  type: { type: String, enum: ["credit", "debit", "transfer","bill"] },
  description: String,
  biller: String, // e.g. "Electricity Board", "Airtel"
  category: String, // e.g. "Electricity", "Mobile", etc.
  date: { type: Date, default: Date.now },
},
  {timestamps: true });
const Transaction = mongoose.model("Transaction", transactionSchema);

// 🔐 Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// 🔐 Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const wallet = await Wallet.create({ user: user._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name, email }, walletBalance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔐 Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const wallet = await Wallet.findOne({ user: user._id });

    res.json({ token, user: { name: user.name, email }, walletBalance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 💰 Get Wallet Balance
app.get("/api/wallet", authMiddleware, async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  res.json({ balance: wallet.balance });
});

// 💸 Add Funds
app.post("/api/wallet/add", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  wallet.balance += amount;
  await wallet.save();

  await Transaction.create({
    user: req.user.id,
    amount,
    type: "credit",
    description: "Funds added",
  });

  res.json({ message: "Funds added", balance: wallet.balance });
});

// ➖ Debit or Credit Transaction
app.post("/api/transaction", authMiddleware, async (req, res) => {
  const { amount, type, description } = req.body;
  const wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  if (type === "debit") {
    if (wallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });
    wallet.balance -= amount;
  } else if (type === "credit") {
    wallet.balance += amount;
  }

  await wallet.save();
  const txn = await Transaction.create({ user: req.user.id, amount, type, description });

  res.json({ message: "Transaction successful", transaction: txn, balance: wallet.balance });
});
// ✅ Add Fund Transfer Route
app.post("/api/wallet/transfer", authMiddleware, async (req, res) => {
  try {
    const { recipientType, recipientValue, amount } = req.body;

    if (!recipientType || !recipientValue  || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const sender = await User.findById(req.user.id);
    // Find recipient based on type
    let recipient;
    if (recipientType === "email") {
      recipient = await User.findOne({ email: recipientValue });
    } else if (recipientType === "phone") {
      recipient = await User.findOne({ phone: recipientValue });
    } else if (recipientType === "walletid") {
      const recipientWallet = await Wallet.findOne({ walletId: recipientValue });
      if (recipientWallet) recipient = await User.findById(recipientWallet.user);
    }

    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    if (recipient._id.equals(sender._id)) return res.status(400).json({ message: "Cannot transfer to self" });

    const senderWallet = await Wallet.findOne({ user: sender._id });
    const recipientWallet = await Wallet.findOne({ user: recipient._id });

    if (!senderWallet || !recipientWallet)
      return res.status(404).json({ message: "Wallet(s) not found" });

    if (senderWallet.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Update balances
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save();
    await recipientWallet.save();

    // Log both transactions
    await Transaction.create({
      user: sender._id,
      amount,
      type: "transfer",
      description: `Transferred to ${recipient.email}`,
    });

    await Transaction.create({
      user: recipient._id,
      amount,
      type: "credit",
      description: `Received from ${sender.email}`,
    });

    res.json({ message: "Transfer successful", balance: senderWallet.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Transfer failed" });
  }
});

// 💡 Pay Bill
app.post("/api/wallet/paybill", authMiddleware, async (req, res) => {
  try {
    const { amount, biller, category, description } = req.body;

    if (!amount || amount <= 0 || !biller || !category) {
      return res.status(400).json({ message: "Invalid bill payment data" });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (wallet.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Deduct amount
    wallet.balance -= amount;
    await wallet.save();

    const txn = await Transaction.create({
      user: req.user.id,
      amount,
      type: "bill",
      description: description || `Bill paid to ${biller}`,
      biller,
      category,
    });

    res.json({ message: "Bill payment successful", transaction: txn, balance: wallet.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bill payment failed" });
  }
});

// 🤝 Split Payment
app.post("/api/wallet/split-payment", authMiddleware, async (req, res) => {
  try {
    const { amount, description, participants } = req.body; // participants: array of user emails

    if (!amount || amount <= 0 || !participants || participants.length === 0) {
      return res.status(400).json({ message: "Invalid split payment data" });
    }

    const splitAmount = amount / (participants.length + 1); // +1 for the payer
    const payerWallet = await Wallet.findOne({ user: req.user.id });

    if (payerWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    payerWallet.balance -= amount;
    await payerWallet.save();

    await Transaction.create({
      user: req.user.id,
      amount,
      type: "debit",
      description: description || "Paid & split bill",
    });

    for (const email of participants) {
      const user = await User.findOne({ email });
      if (!user) continue;

      const userWallet = await Wallet.findOne({ user: user._id });
      if (!userWallet) continue;

      userWallet.balance += splitAmount;
      await userWallet.save();

      await Transaction.create({
        user: user._id,
        amount: splitAmount,
        type: "credit",
        description: `Received split from ${req.user.id} for ${description}`,
      });
    }

    res.json({ message: "Split payment successful", paid: amount, splitAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Split payment failed" });
  }
});

// 💸 Request Payment
app.post("/api/wallet/request-payment", authMiddleware, async (req, res) => {
  try {
    const { recipient, amount, description } = req.body;

    if (!recipient || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const recipientUser = await User.findOne({ email: recipient });
    if (!recipientUser) return res.status(404).json({ message: "Recipient not found" });

    const recipientWallet = await Wallet.findOne({ user: recipientUser._id });
    const senderWallet = await Wallet.findOne({ user: req.user.id });

    if (!recipientWallet || !senderWallet)
      return res.status(404).json({ message: "Wallet(s) not found" });

    if (recipientWallet.balance < amount) {
      return res.status(400).json({ message: "Recipient has insufficient balance" });
    }

    // Deduct from recipient, credit to requester
    recipientWallet.balance -= amount;
    senderWallet.balance += amount;

    await recipientWallet.save();
    await senderWallet.save();

    await Transaction.create({
      user: recipientUser._id,
      amount,
      type: "debit",
      description: `Paid on request to ${req.user.id}: ${description || "No description"}`,
    });

    await Transaction.create({
      user: req.user.id,
      amount,
      type: "credit",
      description: `Received on request from ${recipientUser.email}: ${description || "No description"}`,
    });

    res.json({ message: "Request payment successful", balance: senderWallet.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment request failed" });
  }
});


app.post("/api/wallet/apply-offer", authMiddleware, async (req, res) => {
  const { amount, text } = req.body;

  const wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  if (wallet.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  wallet.balance -= amount;
  await wallet.save();

  const txn = await Transaction.create({
    user: req.user.id,
    amount,
    type: "debit",
    description: `Offer applied: ${text}`,
  });

  res.json({ message: `Offer applied: ${text}`, transaction: txn, balance: wallet.balance });
});

app.post("/api/wallet/add-cashback", authMiddleware, async (req, res) => {
  const { amount, text } = req.body;

  const wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  wallet.balance += amount;
  await wallet.save();

  const txn = await Transaction.create({
    user: req.user.id,
    amount,
    type: "credit",
    description: `Cashback claimed: ${text}`,
  });

  res.json({ message: `Cashback claimed: ${text}`, transaction: txn, balance: wallet.balance });
});

// 📊 User Dashboard Analytics
app.get("/api/dashboard/user", authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    const latestTxn = await Transaction.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    const cashback = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), description: /cashback/i } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      balance: wallet.balance,
      lastTransaction: latestTxn,
      cashbackEarned: cashback[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "User dashboard fetch failed" });
  }
});
// 📊 Admin Dashboard Analytics
app.get("/api/dashboard/admin", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyTxns = await Transaction.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const monthlyTxns = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      dailyTransactions: dailyTxns[0]?.total || 0,
      monthlyRevenue: monthlyTxns[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Admin dashboard fetch failed" });
  }
});

// 📊 Graphical Reports: Monthly Transactions
app.get("/api/analytics/transactions/monthly", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalTransactions: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalTransactions: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Map to month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = months.map((m, i) => {
      const match = monthlyData.find((d) => d.month === i + 1);
      return { name: m, Transactions: match?.totalTransactions || 0 };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to load transaction report" });
  }
});

// 📜 Get Transaction History
app.get("/api/transactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

app.post("/api/transactions", authMiddleware, async (req, res) => {
  try {
    const { recipient, amount, note } = req.body;

    // Find recipient user
    const recipientUser = await User.findOne({ email: recipient });
    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Fetch sender's wallet
    const senderWallet = await Wallet.findOne({ user: req.user.id });
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Fetch recipient's wallet
    const recipientWallet = await Wallet.findOne({ user: recipientUser._id });
    if (!recipientWallet) {
      return res.status(500).json({ message: "Recipient wallet not found" });
    }

    // 1️⃣ Deduct from sender
    senderWallet.balance -= amount;
    await senderWallet.save();

    // 2️⃣ Credit to recipient
    recipientWallet.balance += amount;
    await recipientWallet.save();

    // 3️⃣ Log sender's transaction
    const senderTxn = new Transaction({
      user: req.user.id,
      amount,
      type: "transfer",
      description: note || `Transfer to ${recipient}`,
    });
    await senderTxn.save();

    // 4️⃣ Log recipient's transaction
    const recipientTxn = new Transaction({
      user: recipientUser._id,
      amount,
      type: "credit",
      description: `Received from ${req.user.email || "another user"}`,
    });
    await recipientTxn.save();

    res.status(201).json({ message: "Transfer successful" });
  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({ message: "Transaction failed" });
  }
});



// 🚀 Start Server
app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));
