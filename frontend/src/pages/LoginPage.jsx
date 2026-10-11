import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, LogIn, Lock, Mail, KeyRound, UserCheck, Sparkles } from 'lucide-react';

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

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      backgroundColor: '#f7faf8'
    }}>
      <div style={{
        maxWidth: 460,
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #072318 0%, #0c3323 100%)',
          padding: '32px 28px',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #165b40 0%, #0c3323 100%)',
            border: '1.5px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
          }}>
            <ShieldCheck size={28} color="#d4af37" />
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: 6 }}>
            Institutional Portal Login
          </h2>
          <p style={{ color: '#a7f3d0', fontSize: '0.85rem' }}>
            Secure sign in for Administrators and Students
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: 32 }}>
          {/* Quick Demo Autofill Bar */}
          <div style={{
            padding: 12,
            backgroundColor: '#f0fdf4',
            borderRadius: 12,
            border: '1px solid #bbf7d0',
            marginBottom: 24
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#166534',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8
            }}>
              <Sparkles size={14} color="#166534" />
              1-Click Demo Credentials
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => fillCredentials('admin@campusvault.edu', 'Admin@123')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #86efac',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#14532d',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🎓 Dean / Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('rithika@campusvault.edu', 'Student@123')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #86efac',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#14532d',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                👩‍🎓 Student (Rithika)
              </button>
            </div>
          </div>

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
                <Mail size={16} color="#64748b" /> Institutional Email
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
                <KeyRound size={16} color="#64748b" /> Password
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
            <Link to="/register" style={{ color: '#165b40', fontWeight: 700 }}>
              Register Here
            </Link>
          </div>

          <div style={{ marginTop: 14, textAlign: 'center', fontSize: '0.825rem', color: '#94a3b8' }}>
            External recruiter?{' '}
            <Link to="/verify" style={{ color: '#d4af37', fontWeight: 600 }}>
              Verify Certificate Without Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
