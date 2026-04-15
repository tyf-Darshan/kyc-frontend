import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import EmailVerificationModal from '../components/EmailVerificationModal';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isEmailVerified, logout, verifyEmail } = useAuth();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [kycRequests, setKycRequests] = useState([]);
  const [kycLoading, setKycLoading] = useState(true);

  useEffect(() => {
    fetchKycRequests();
  }, []);

  const fetchKycRequests = async () => {
    try {
      const response = await fetch('http://localhost:3000/kyc/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setKycRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch KYC requests:', err);
    } finally {
      setKycLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpInput || otpInput.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOtp(user.email, otpInput);
      verifyEmail();
      setShowVerificationModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerification = async () => {
    setError('');
    setResendMessage('');
    setShowVerificationModal(true);
    setSendingOtp(true);

    try {
      await authAPI.sendOtp(user.email);
      setResendMessage('OTP sent successfully! Check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResendMessage('');
    setResendLoading(true);

    try {
      await authAPI.sendOtp(user.email);
      setResendMessage('OTP sent successfully! Check your email.');
      setOtpInput('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h1>E-KYC Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {!isEmailVerified && (
        <div className={styles.verificationBanner}>
          ⚠️ Please verify your email to access all features
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Welcome, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <p>
            Email Status:{' '}
            <span
              style={{
                color: isEmailVerified ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
            </span>
          </p>
        </div>

        {isEmailVerified ? (
          <div className={styles.card}>
            <h3>KYC Status</h3>
            {kycLoading ? (
              <p>Loading KYC status...</p>
            ) : kycRequests.length > 0 ? (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ marginBottom: '15px', color: '#333' }}>📋 Your KYC Applications</h4>
                {kycRequests.map((request) => (
                  <div key={request.id} style={{ 
                    marginBottom: '15px', 
                    padding: '15px', 
                    border: `2px solid ${request.status === 'APPROVED' ? '#28a745' : request.status === 'REJECTED' ? '#dc3545' : '#ffc107'}`,
                    borderRadius: '8px',
                    backgroundColor: request.status === 'APPROVED' ? '#f0f9ff' : request.status === 'REJECTED' ? '#fff5f5' : '#fffbf0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '5px 0' }}><strong>📄 Document Type:</strong> {request.documentType}</p>
                        <p style={{ margin: '5px 0' }}><strong>🔢 Document Number:</strong> {request.documentNumber}</p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Status:</strong> 
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            marginLeft: '8px',
                            fontWeight: 'bold',
                            backgroundColor: request.status === 'APPROVED' ? '#d4edda' : request.status === 'REJECTED' ? '#f8d7da' : '#fff3cd',
                            color: request.status === 'APPROVED' ? '#155724' : request.status === 'REJECTED' ? '#721c24' : '#856404'
                          }}>
                            {request.status === 'PENDING' ? '⏳ Pending Review' : request.status === 'APPROVED' ? '✓ Approved' : '✗ Rejected'}
                          </span>
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}><strong>📅 Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()} {new Date(request.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    {request.status === 'REJECTED' && (
                      <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        backgroundColor: '#fff0f0',
                        borderLeft: '4px solid #dc3545',
                        borderRadius: '4px'
                      }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#dc3545' }}>❌ Rejection Reason:</p>
                        <p style={{ margin: 0, color: '#333', lineHeight: '1.5' }}>{request.adminNotes}</p>
                        <button 
                          style={{
                            marginTop: '12px',
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          onClick={() => navigate('/kyc')}
                        >
                          🔄 Re-apply for KYC
                        </button>
                      </div>
                    )}

                    {request.status === 'APPROVED' && request.verifiedAt && (
                      <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        backgroundColor: '#f0f9ff',
                        borderLeft: '4px solid #28a745',
                        borderRadius: '4px'
                      }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#28a745' }}>✓ Verification Complete</p>
                        <p style={{ margin: 0, color: '#333' }}>Verified on: {new Date(request.verifiedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                ))}
                {kycRequests.some(req => req.status === 'PENDING') && (
                  <p style={{ color: '#ffa500', fontWeight: 'bold' }}>
                    Your KYC is under review. Please wait for admin approval.
                  </p>
                )}
                {kycRequests.every(req => req.status === 'APPROVED') && (
                  <p style={{ color: 'green', fontWeight: 'bold' }}>
                    ✓ Your KYC has been approved!
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p>You haven't submitted a KYC request yet.</p>
                <button className={styles.button} onClick={() => navigate('/kyc')}>
                  Start KYC Verification
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.card}>
            <h3>Email not verified</h3>
            <p style={{ color: '#666', textAlign: 'center' }}>
              Verify your email whenever you’re ready to unlock dashboard actions.
            </p>
            <button className={styles.button} onClick={handleOpenVerification}>
              Verify Email
            </button>
          </div>
        )}
      </div>

      {showVerificationModal && (
        <EmailVerificationModal
          email={user?.email}
          otp={otpInput}
          onOtpChange={(e) =>
            setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))
          }
          onSubmit={handleVerifyEmail}
          onResend={handleResendOTP}
          error={error}
          loading={loading}
          sendingOtp={sendingOtp}
          resendLoading={resendLoading}
          resendMessage={resendMessage}
        />
      )}
    </div>
  );
};

export default Dashboard;
