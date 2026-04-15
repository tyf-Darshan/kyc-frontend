import React from 'react';
import styles from './EmailVerificationModal.module.css';

const EmailVerificationModal = ({
  email,
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  error,
  loading,
  sendingOtp,
  resendLoading,
  resendMessage,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit code to {email}</p>

        {error && <div className={styles.error}>{error}</div>}
        {resendMessage && <div className={styles.success}>{resendMessage}</div>}
        {sendingOtp && <div className={styles.info}>Sending OTP... Please wait.</div>}

        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={otp}
            onChange={onOtpChange}
            maxLength="6"
            placeholder="000000"
            style={{
              fontSize: '24px',
              letterSpacing: '10px',
              textAlign: 'center',
              padding: '15px',
              marginBottom: '20px',
              border: '2px solid #ddd',
              borderRadius: '4px',
            }}
            required
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
            Didn't receive the code?
          </p>
          <button
            onClick={onResend}
            disabled={resendLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px',
            }}
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
