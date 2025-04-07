import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";  
function ScanPay() {
  const [cameraAccess, setCameraAccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const html5QrCodeRef = useRef(null);
  const qrCodeRegionId = "qr-reader";

  // Start QR Code Scanner
  const startQrScanner = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        const cameraId = devices[0].id;

        html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
        html5QrCodeRef.current
          .start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              setScannedResult(decodedText);
              stopQrScanner();
            },
            (errorMessage) => {
              console.log("Scan error:", errorMessage);
            }
          )
          .then(() => {
            setCameraAccess(true);
          });
      }
    } catch (error) {
      console.error("Camera access denied or scanning error:", error);
      setCameraAccess(false);
    }
  };

  // Stop QR Scanner
  const stopQrScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        setCameraAccess(false);
      });
    }
  };

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  const handleConfirmPayment = async () => {
    if (!amount || !upiId) {
      alert("Please enter amount and scan a valid QR.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient: upiId,
          amount: parseFloat(amount),
          note: note,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(`Payment of ₹${amount} to ${upiId} confirmed!`);
        setScannedResult(null);
        setAmount("");
        setNote("");
      } else {
        alert(data.message || "Transaction failed");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Payment failed");
    }
  };
  

  const handleScanAgain = () => {
    setScannedResult(null);
    setAmount("");
    setNote("");
    startQrScanner();
  };

  let upiId = "";
  let name = "";

  if (scannedResult) {
    if (scannedResult.startsWith("upi://")) {
    const params = new URLSearchParams(scannedResult.split("?")[1]);
    upiId = params.get("pa");
    name = decodeURIComponent(params.get("pn") || "");
  } else {
    // Fallback for raw email or text
    upiId = scannedResult;
  }
}

  return (
    <div className="scanpay-container">
      <style>{`
  .scanpay-container {
    padding: 30px;
    background: linear-gradient(135deg, #ffffff, #f0f0f0);
    border-radius: 15px;
    width: 60%;
    margin: auto;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    font-family: 'Arial', sans-serif;
  }
  h2 {
    color: #333;
    margin-bottom: 20px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }
  h3 {
    color: #007bff;
    margin-bottom: 15px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }
  p {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
  }
  .button-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    flex-wrap: wrap;
    gap: 15px;
  }
  button {
    padding: 12px 20px;
    border: none;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    cursor: pointer;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  button:hover {
    background: linear-gradient(135deg, #0056b3, #003f7f);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  #qr-reader {
    width: 300px;
    height: 300px;
    margin: 20px auto;
    border: 2px dashed #007bff;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;
    color: #555;
    font-size: 14px;
  }
  input[type="file"] {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
    max-width: 300px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  input[type="text"], input[type="number"] {
    width: 100%;
    max-width: 300px;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: all 0.3s ease;
  }
  input[type="text"]:focus, input[type="number"]:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }
  img {
    width: 200px;
    height: 200px;
    margin-top: 20px;
    border: 2px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`}</style>

      <h2>Scan & Pay</h2>

      <div className="button-container">
        {!cameraAccess && !scannedResult && (
          <button onClick={startQrScanner}>Start QR Scan</button>
        )}
        {cameraAccess && (
          <button onClick={stopQrScanner}>Stop Camera</button>
        )}
        {scannedResult && (
          <button onClick={() => setScannedResult(null)}>Scan Again</button>
        )}
      </div>

      {/* QR Code Reader */}
      {!scannedResult && <div id={qrCodeRegionId} />}

      {/* Scanned & Form UI */}
      {scannedResult && (
        <div>
          <h3>QR Code Payment</h3>
          <p>Scan or upload QR code to make payment</p>
          <p><strong>Recipient:</strong> {upiId}</p>

          <input type="text" value={upiId} readOnly />
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="QR Payment"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="button-container">
            <button onClick={handleConfirmPayment}>Confirm Payment</button>
          </div>
        </div>
      )}

      {/* Upload QR Code Image */}
      <input type="file" accept="image/*" onChange={handleFileUpload} />

      {/* Display Uploaded Image */}
      {selectedFile && (
        <div>
          <h4>Uploaded QR Code</h4>
          <img src={selectedFile} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default ScanPay;
