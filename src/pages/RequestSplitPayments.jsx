import React from "react";
import { useNavigate } from "react-router-dom";

function RequestSplitPayments() {
  const navigate = useNavigate();

  return (
    <div className="request-split-container">
      <h2>Request & Split Payments</h2>
      <div className="options">
        <button onClick={() => navigate("/request-money")}>Request Money</button>
        <button onClick={() => navigate("/split-bills")}>Split Bills</button>
      </div>
    </div>
  );
}

export default RequestSplitPayments;

