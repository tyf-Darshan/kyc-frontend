import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/kotak.css';

const KycForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    documentType: 'PAN_CARD',
    documentNumber: '',
    userImage: null,
    signatureImage: null,
    documentFront: null,
    documentBack: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  return (
    <div className="kotak-app-wrapper">
      {/* Utility Top Bar */}
      <header className="top-header">
        <div className="logo-section">
          <h2 style={{margin:0, color: '#222B5F'}}>kotak</h2>
          <small style={{fontSize: '10px', color: '#666'}}>Kotak Mahindra Bank</small>
        </div>
        <div className="crn-bar">
          Sitemap | Welcome <span>New User</span><br />
          CRN: ****1287 | Profile | Change Password | <span style={{color: 'red', cursor: 'pointer'}}>Logout</span>
        </div>
      </header>

      {/* Area A: Main Red Nav Ribbon */}
      <nav className="red-ribbon-nav">
        <a href="#" className="nav-link active">Home</a>
        <a href="#" className="nav-link">Payment/Transfer</a>
        <a href="#" className="nav-link">Banking</a>
        <a href="#" className="nav-link">BillPay</a>
        <a href="#" className="nav-item nav-link" style={{background: 'white', color: 'red', margin: '8px', padding: '5px 15px', borderRadius: '4px'}}>Apply Now</a>
      </nav>

      {/* Dashboard Main Content */}
      <main className="main-dashboard">
        <div className="dashboard-tabs">
          <div className="tab-item active">Your Assets (+)</div>
          <div className="tab-item">Your Liabilities (-)</div>
          <div className="tab-item">Your Messages ✉</div>
        </div>

        <div className="summary-strip">
          <div className="summary-item">
            <small>What you have</small>
            <div className="val-pos">175648.43</div>
          </div>
          <div className="summary-item">
            <small>What you owe</small>
            <div className="val-neg">0.00</div>
          </div>
        </div>

        {/* KYC Verification Form Section */}
        <div className="kyc-dashboard-content">
          <div style={{background: '#fff9f9', padding: '15px', borderLeft: '5px solid red', marginBottom: '20px'}}>
            <h4 style={{margin:0}}>Action Required: Complete Digital KYC</h4>
            <small>Your account features are currently limited. Follow the 3 steps below.</small>
          </div>

          <div className="stepper-visual" style={{display:'flex', gap:'20px', marginBottom:'30px'}}>
             <div style={{fontWeight: step===1?'bold':'normal', color: step===1?'red':'#666'}}>1. Identity</div>
             <div style={{color: '#ccc'}}>➤</div>
             <div style={{fontWeight: step===2?'bold':'normal', color: step===2?'red':'#666'}}>2. Documents</div>
             <div style={{color: '#ccc'}}>➤</div>
             <div style={{fontWeight: step===3?'bold':'normal', color: step===3?'red':'#666'}}>3. Finalize</div>
          </div>

          {/* Form Step Logic */}
          <form style={{maxWidth: '500px'}}>
            {step === 1 && (
              <div>
                <label>PAN Card Number</label>
                <input type="text" name="documentNumber" className="kotak-input" placeholder="ABCDE1234F" onChange={handleInputChange}/>
                <button type="button" className="btn-kotak-red" onClick={() => setStep(2)}>Continue</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <label>Upload Aadhaar / ID Front</label>
                <input type="file" name="documentFront" className="kotak-input" onChange={handleInputChange}/>
                <button type="button" className="btn-kotak-red" onClick={() => setStep(3)}>Continue</button>
              </div>
            )}

            {step === 3 && (
              <div>
                <label>Live Selfie Capture</label>
                <input type="file" name="userImage" className="kotak-input" capture="user" onChange={handleInputChange}/>
                <button type="submit" className="btn-kotak-red">Submit Application</button>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Area B: Floating Ask Keya */}
      <div className="keya-bot-container">
        <div style={{background: '#fff', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'}}>
           <img src="https://img.icons8.com/color/96/assistant.png" className="keya-avatar" alt="Keya" />
        </div>
        <div style={{fontSize: '11px', fontWeight: 'bold', marginTop: '5px'}}>Ask Keya</div>
      </div>
    </div>
  );
};

export default KycForm;