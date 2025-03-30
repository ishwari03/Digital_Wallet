import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // 🔹 Navbar ko import kiya
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import FundManagement from "./pages/FundManagement";
import BillPayment from "./pages/BillPayment";
import CashBackOffers from "./pages/CashBackOffers";
import RequestSplitPayments from "./pages/RequestSplitPayments";
import ScanPay from "./pages/ScanPay";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
function App() {
  return (
    <>
      <Navbar />  {/* 🔹 Navbar ko har page ke upar dikhane ke liye add kiya */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/funds" element={<FundManagement />} />
        <Route path="/billpayment" element={<BillPayment />} />
        <Route path="/cashback-offers" element={<CashBackOffers />} />
        <Route path="/request-split-payments" element={<RequestSplitPayments />} />
        <Route path="/scan-pay" element={<ScanPay />} />
        <Route path="/notifications" element = {<Notifications/>} />
        <Route path="/analytics" element={<Analytics />} />

        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
