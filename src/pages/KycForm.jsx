import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';

const KycForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    userImage: null,
    signatureImage: null,
    documentFront: null,
    documentBack: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.documentType || !formData.documentNumber) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('documentType', formData.documentType);
      submitData.append('documentNumber', formData.documentNumber);
      if (formData.userImage) submitData.append('userImage', formData.userImage);
      if (formData.signatureImage) submitData.append('signatureImage', formData.signatureImage);
      if (formData.documentFront) submitData.append('documentFront', formData.documentFront);
      if (formData.documentBack) submitData.append('documentBack', formData.documentBack);

      const response = await fetch('http://localhost:3000/kyc', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit KYC');
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h2>Success!</h2>
          <p>Your KYC request has been submitted successfully. You will be redirected to the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>KYC Verification</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Submit your identification details and documents for verification.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Document Type *</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
            >
              <option value="">Select Document Type</option>
              <option value="PASSPORT">Passport</option>
              <option value="DRIVING_LICENSE">Driving License</option>
              <option value="NATIONAL_ID">National ID</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Document Number *</label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              placeholder="Enter document number"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Selfie Photo</label>
            <input
              type="file"
              name="userImage"
              accept="image/*"
              onChange={handleChange}
              capture="user"
            />
            <small style={{ color: '#666' }}>Take a clear selfie</small>
          </div>

          <div className={styles.formGroup}>
            <label>Signature Image</label>
            <input
              type="file"
              name="signatureImage"
              accept="image/*"
              onChange={handleChange}
            />
            <small style={{ color: '#666' }}>Upload your signature image</small>
          </div>

          <div className={styles.formGroup}>
            <label>Document Front</label>
            <input
              type="file"
              name="documentFront"
              accept="image/*"
              onChange={handleChange}
            />
            <small style={{ color: '#666' }}>Photo of document front</small>
          </div>

          <div className={styles.formGroup}>
            <label>Document Back</label>
            <input
              type="file"
              name="documentBack"
              accept="image/*"
              onChange={handleChange}
            />
            <small style={{ color: '#666' }}>Photo of document back (if applicable)</small>
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </form>

        <p className={styles.link}>
          <a href="/dashboard">Back to Dashboard</a>
        </p>
      </div>
    </div>
  );
};

export default KycForm;