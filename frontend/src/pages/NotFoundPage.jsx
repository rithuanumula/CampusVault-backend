import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      backgroundColor: '#f7faf8',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: 480 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: '#fee2e2',
          border: '2px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <ShieldAlert size={40} color="#dc2626" />
        </div>
        <h1 style={{ fontSize: '3rem', color: '#072418', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', color: '#334155', marginBottom: 12 }}>
          Page Not Found
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 28, lineHeight: 1.6 }}>
          The requested page or credential registry path does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};
