import React, { useState, useRef } from "react";

function ScanPay() {
  const [cameraAccess, setCameraAccess] = useState(null);
  const videoRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to request camera access
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraAccess(true);
    } catch (error) {
      console.error("Camera access denied:", error);
      setCameraAccess(false);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="scanpay-container">
      <style>{`
        .scanpay-container {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
          width: 60%;
          margin: auto;
          text-align: center;
        }
        h2 {
          color: #333;
        }
          .button-container {
        display: flex;
        justify-content: center; /* Centers the button horizontally */
        margin: 20px 0;}
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
        video {
          width: 100%;
          max-width: 400px;
          border: 2px solid #2c3e50;
          margin-top: 10px;
        }
        input[type="file"] {
          margin-top: 10px;
        }
        img {
          width: 200px;
          height: 300px;
          margin-top: 10px;
          border: 2px solid #ccc;
          border-radius: 5px;
        }
      `}</style>
      <h2>Scan & Pay</h2>

      {/* Camera Access Button */}
      <div className="button-container">
      <button onClick={requestCameraAccess}>Request Camera Permission</button>
    </div>

      {/* Camera Preview */}
      {cameraAccess && (
        <video ref={videoRef} autoPlay playsInline></video>
      )}

      <br />

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