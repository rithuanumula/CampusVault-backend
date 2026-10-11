import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: '3px solid #d1fae5',
          borderTopColor: '#10432f',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ color: '#10432f', fontWeight: 600, fontSize: '0.9rem' }}>
          Verifying CampusVault session credentials...
        </div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return (
      <div style={{
        maxWidth: 600,
        margin: '80px auto',
        padding: 32,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        border: '1px solid #fee2e2',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <ShieldCheck size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ color: '#991b1b', marginBottom: 8 }}>Access Restricted</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          Your current account role (<strong>{user?.role}</strong>) does not have authorization to view this administrative resource.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};
