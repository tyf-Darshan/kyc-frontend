import './styles/kotak.css';
import React, { useState } from 'react';
import '../styles/kotak.css';
import KycStepper from './KycStepper';

const KycLanding = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="kotak-container">
      {/* Kotak Header Mimic */}
      <header className="kotak-header">
        <div className="logo">KOTAK <span className="clone-tag">Clone</span></div>
        <div className="support">Help & Support</div>
      </header>

      <main className="kyc-content">
        <h2>Complete Your Digital KYC</h2>
        <p>Follow 3 simple steps to activate your account</p>

        {/* Progress Tracker */}
        <div className="stepper-wrapper">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. PAN</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Aadhaar</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Video KYC</div>
        </div>

        {/* The 3-Step Component Logic */}
        <div className="form-card">
          <KycStepper step={currentStep} setStep={setCurrentStep} />
        </div>
      </main>
    </div>
  );
};

export default KycLanding;