import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, LogIn, Lock, Mail, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');

      // Direct to corresponding dashboard
      const destination = location.state?.from?.pathname || (user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard');
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      backgroundColor: '#f0f7ff'
    }}>
      <div style={{
        maxWidth: 460,
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        border: '1.5px solid #bae6fd',
        boxShadow: '0 20px 40px -15px rgba(14, 165, 233, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          padding: '32px 28px',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: '#ffffff',
            border: '1.5px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
          }}>
            <ShieldCheck size={30} color="#0284c7" />
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: 6 }}>
            Institutional Portal Login
          </h2>
          <p style={{ color: '#e0f2fe', fontSize: '0.85rem' }}>
            Secure sign in for Administrators and Students
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: 32 }}>
          {errorMsg && (
            <div style={{
              padding: 12,
              backgroundColor: '#fee2e2',
              borderRadius: 8,
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '0.85rem',
              marginBottom: 20
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={16} color="#0284c7" /> Institutional Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campusvault.edu"
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <KeyRound size={16} color="#0284c7" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px 20px', fontSize: '1rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </button>
          </form>

          {/* Links */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Student without an account?{' '}
            <Link to="/register" style={{ color: '#0284c7', fontWeight: 700 }}>
              Register Here
            </Link>
          </div>

          <div style={{ marginTop: 14, textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
            External recruiter?{' '}
            <Link to="/verify" style={{ color: '#0284c7', fontWeight: 600 }}>
              Verify Certificate Without Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
