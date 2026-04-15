import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import styles from './AuthForm.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate('/login', {
        state: {
          message: 'Registration successful. You can login now and verify email later from the dashboard.',
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>Register</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimum 8 characters"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className={styles.link}>
          Already have an account?{' '}
          <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
