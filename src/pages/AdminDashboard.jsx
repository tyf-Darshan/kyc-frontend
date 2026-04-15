import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchKycRequests();
  }, [user]);

  const fetchKycRequests = async () => {
    try {
      const response = await fetch('http://localhost:3000/kyc/admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch KYC requests');
      const data = await response.json();
      setKycRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3000/kyc/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'APPROVED', adminNotes: '' }),
      });
      if (!response.ok) throw new Error('Failed to approve');
      await fetchKycRequests();
      setExpandedId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionNotes[id] || rejectionNotes[id].trim() === '') {
      alert('Please add comments for rejection');
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3000/kyc/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'REJECTED', adminNotes: rejectionNotes[id] }),
      });
      if (!response.ok) throw new Error('Failed to reject');
      await fetchKycRequests();
      setExpandedId(null);
      setRejectionNotes({ ...rejectionNotes, [id]: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading KYC requests...</div>;

  const pendingCount = kycRequests.filter(r => r.status === 'PENDING').length;
  const approvedCount = kycRequests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = kycRequests.filter(r => r.status === 'REJECTED').length;

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h1>🔐 Admin Dashboard - KYC Management</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.content}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div className={styles.card} style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>📋 Pending</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{pendingCount}</p>
          </div>
          <div className={styles.card} style={{ backgroundColor: '#d4edda', borderLeft: '4px solid #28a745' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✓ Approved</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{approvedCount}</p>
          </div>
          <div className={styles.card} style={{ backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>✗ Rejected</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{rejectedCount}</p>
          </div>
        </div>

        <h2>All KYC Applications ({kycRequests.length})</h2>

        {kycRequests.length === 0 ? (
          <div className={styles.card} style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No KYC applications found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {kycRequests.map((request) => (
              <div 
                key={request.id} 
                className={styles.card}
                style={{
                  borderLeft: `4px solid ${
                    request.status === 'PENDING' ? '#ffc107' :
                    request.status === 'APPROVED' ? '#28a745' : '#dc3545'
                  }`,
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
              >
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                      👤 {request.user.name}
                    </h3>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Email:</strong> {request.user.email}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Document:</strong> {request.documentType} - {request.documentNumber}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Status:</strong> 
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        marginLeft: '8px',
                        fontWeight: 'bold',
                        backgroundColor: 
                          request.status === 'PENDING' ? '#fff3cd' :
                          request.status === 'APPROVED' ? '#d4edda' : '#f8d7da',
                        color: 
                          request.status === 'PENDING' ? '#856404' :
                          request.status === 'APPROVED' ? '#155724' : '#721c24'
                      }}>
                        {request.status}
                      </span>
                    </p>
                    <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>
                      Submitted: {new Date(request.createdAt).toLocaleDateString()} {new Date(request.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>
                    {expandedId === request.id ? '▼' : '▶'}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === request.id && (
                  <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                    {/* Document Images */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ marginBottom: '15px', color: '#333' }}>📸 Uploaded Documents</h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '15px'
                      }}>
                        {request.userImage && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                              border: '2px solid #ddd',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              marginBottom: '8px'
                            }}>
                              <img 
                                src={`http://localhost:3000/uploads/${request.userImage}`}
                                alt="Selfie" 
                                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                              />
                            </div>
                            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>👤 Selfie</p>
                          </div>
                        )}
                        {request.documentFront && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                              border: '2px solid #ddd',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              marginBottom: '8px'
                            }}>
                              <img 
                                src={`http://localhost:3000/uploads/${request.documentFront}`}
                                alt="Document Front" 
                                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                              />
                            </div>
                            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>📄 Front</p>
                          </div>
                        )}
                        {request.documentBack && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                              border: '2px solid #ddd',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              marginBottom: '8px'
                            }}>
                              <img 
                                src={`http://localhost:3000/uploads/${request.documentBack}`}
                                alt="Document Back" 
                                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                              />
                            </div>
                            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>📄 Back</p>
                          </div>
                        )}
                        {request.signatureImage && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                              border: '2px solid #ddd',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              marginBottom: '8px'
                            }}>
                              <img 
                                src={`http://localhost:3000/uploads/${request.signatureImage}`}
                                alt="Signature" 
                                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                              />
                            </div>
                            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>✍️ Signature</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Previous Admin Notes (if any) */}
                    {request.adminNotes && (
                      <div style={{
                        marginBottom: '20px',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderLeft: '3px solid #dc3545',
                        borderRadius: '4px'
                      }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#dc3545' }}>📝 Admin Notes:</p>
                        <p style={{ margin: 0, color: '#333' }}>{request.adminNotes}</p>
                      </div>
                    )}

                    {/* Action Section - Only for Pending */}
                    {request.status === 'PENDING' && (
                      <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px'
                      }}>
                        <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>⚙️ Review Decision</h4>

                        {/* Rejection Comment Field - Show when user clicks reject or has rejection notes */}
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ 
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>
                            Comments for Rejection (required if rejecting):
                          </label>
                          <textarea
                            value={rejectionNotes[request.id] || ''}
                            onChange={(e) => setRejectionNotes({
                              ...rejectionNotes,
                              [request.id]: e.target.value
                            })}
                            placeholder="Provide feedback on why the KYC is being rejected (e.g., 'Document quality is poor', 'Information mismatch', etc.)"
                            style={{
                              width: '100%',
                              minHeight: '80px',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontFamily: 'Arial, sans-serif',
                              fontSize: '14px'
                            }}
                          />
                          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                            These comments will be visible to the user
                          </small>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap'
                        }}>
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={actionLoading === request.id}
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              opacity: actionLoading === request.id ? 0.6 : 1,
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                          >
                            {actionLoading === request.id ? '⏳ Processing...' : '✓ Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={actionLoading === request.id}
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              opacity: actionLoading === request.id ? 0.6 : 1,
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                          >
                            {actionLoading === request.id ? '⏳ Processing...' : '✗ Reject'}
                          </button>
                          <button
                            onClick={() => {
                              setExpandedId(null);
                              setRejectionNotes({ ...rejectionNotes, [request.id]: '' });
                            }}
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;