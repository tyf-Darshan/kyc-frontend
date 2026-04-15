import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import styles from './AuthForm.module.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setMessage('OTP sent to your email. Please check your inbox.');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>Forgot Password</h2>
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
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
        <p className={styles.link}>
          Remembered password? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
