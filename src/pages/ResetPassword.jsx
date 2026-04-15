import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import styles from './AuthForm.module.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email || '';
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(email, otp, password);
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>Reset Password</h2>
        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.formGroup}>
            <label>OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="Enter 6-digit OTP"
              maxLength="6"
            />
          </div>
          <div className={styles.formGroup}>
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New password"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className={styles.link}>
          Go back to <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
