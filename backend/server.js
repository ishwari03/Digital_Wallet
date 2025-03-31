const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
dotenv.config();
connectDB()
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow requests from frontend
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/transactionRoutes"));

app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`Route available: ${r.route.path}`);
    }
  });
  
  console.log("✅ Auth Routes Loaded:", require("./routes/authRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
