import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './AuthForm.module.css';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, verifyEmail } = useAuth();
  const email = location.state?.email || user?.email || localStorage.getItem('pendingEmail') || '';
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOtp(email, otp);
      localStorage.removeItem('pendingEmail');
      verifyEmail();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResendMessage('');
    setResendLoading(true);

    try {
      await authAPI.sendOtp(email);
      setResendMessage('OTP sent successfully! Check your email.');
      setOtp('');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to resend OTP'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>Verify Email</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        {error && <div className={styles.error}>{error}</div>}
        {resendMessage && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
          }}>
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              placeholder="000000"
              style={{ fontSize: '24px', letterSpacing: '10px', textAlign: 'center' }}
              required
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '10px', color: '#666' }}>
            Didn't receive the OTP?
          </p>
          <button
            onClick={handleResendOTP}
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

export default VerifyOTP;
