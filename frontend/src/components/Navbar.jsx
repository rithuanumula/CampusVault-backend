import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Award, FileText, Calendar, Users, History, LogIn, LogOut, UserPlus, Menu, X, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1.5px solid #e0f2fe',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px -2px rgba(14, 165, 233, 0.08)'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            border: '1.5px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 14px rgba(14, 165, 233, 0.25)'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#082f49',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              Campus<span style={{ color: '#0284c7' }}>Vault</span>
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0284c7'
            }}>
              Digital Credential Registry
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: 6 }} className="desktop-nav">
          <Link
            to="/verify"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive('/verify') ? '#0284c7' : '#475569',
              backgroundColor: isActive('/verify') ? '#f0f9ff' : 'transparent',
              border: isActive('/verify') ? '1px solid #bae6fd' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={16} color="#0284c7" />
            Verify Credential
          </Link>

          <Link
            to="/events"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive('/events') ? '#0284c7' : '#475569',
              backgroundColor: isActive('/events') ? '#f0f9ff' : 'transparent',
              border: isActive('/events') ? '1px solid #bae6fd' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={16} color="#0284c7" />
            Events
          </Link>

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/admin/dashboard') ? '#0284c7' : '#475569',
                  backgroundColor: isActive('/admin/dashboard') ? '#f0f9ff' : 'transparent',
                  border: isActive('/admin/dashboard') ? '1px solid #bae6fd' : '1px solid transparent'
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/certificates"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/admin/certificates') ? '#0284c7' : '#475569',
                  backgroundColor: isActive('/admin/certificates') ? '#f0f9ff' : 'transparent',
                  border: isActive('/admin/certificates') ? '1px solid #bae6fd' : '1px solid transparent'
                }}
              >
                Certificates
              </Link>
              <Link
                to="/admin/certificates/new"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <PlusCircle size={16} />
                Issue Certificate
              </Link>
              <Link
                to="/admin/students"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/admin/students') ? '#0284c7' : '#475569',
                  backgroundColor: isActive('/admin/students') ? '#f0f9ff' : 'transparent',
                  border: isActive('/admin/students') ? '1px solid #bae6fd' : '1px solid transparent'
                }}
              >
                Students
              </Link>
              <Link
                to="/admin/verifications"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/admin/verifications') ? '#0284c7' : '#475569',
                  backgroundColor: isActive('/admin/verifications') ? '#f0f9ff' : 'transparent',
                  border: isActive('/admin/verifications') ? '1px solid #bae6fd' : '1px solid transparent'
                }}
              >
                Audit Log
              </Link>
            </>
          )}

          {/* Student Navigation */}
          {isStudent && (
            <>
              <Link
                to="/student/dashboard"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/student/dashboard') ? '#0284c7' : '#475569',
                  backgroundColor: isActive('/student/dashboard') ? '#f0f9ff' : 'transparent',
                  border: isActive('/student/dashboard') ? '1px solid #bae6fd' : '1px solid transparent'
                }}
              >
                My Dashboard
              </Link>
              <Link
                to="/student/certificates"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/student/certificates') ? '#0284c7' : '#475569',
                  backgroundColor: isActive('/student/certificates') ? '#f0f9ff' : 'transparent',
                  border: isActive('/student/certificates') ? '1px solid #bae6fd' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Award size={16} color="#0284c7" />
                My Certificates
              </Link>
            </>
          )}
        </nav>

        {/* Right CTA / Auth Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ textAlign: 'right', display: 'none' }} className="user-meta">
                <div style={{ color: '#0f172a', fontSize: '0.875rem', fontWeight: 600 }}>
                  {user?.fullName}
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  textTransform: 'uppercase'
                }}>
                  {isAdmin ? 'Administrator' : `Student (${user?.studentId || 'AU'})`}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#0369a1',
                  padding: '8px 14px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'background 0.2s'
                }}
                title="Log out of CampusVault"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link
                to="/login"
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0284c7',
                  background: '#f0f9ff',
                  border: '1.5px solid #bae6fd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <LogIn size={16} />
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  boxShadow: '0 2px 10px rgba(14, 165, 233, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <UserPlus size={16} />
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#082f49',
              cursor: 'pointer',
              display: 'flex',
              padding: 6
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e0f2fe',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#0284c7', padding: '8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ShieldCheck size={18} color="#0284c7" /> Verify Credential
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#475569', padding: '8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Calendar size={18} color="#0284c7" /> Events
          </Link>
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', padding: '8px 0' }}>Admin Dashboard</Link>
              <Link to="/admin/certificates" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', padding: '8px 0' }}>Certificates</Link>
              <Link to="/admin/certificates/new" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0284c7', padding: '8px 0', fontWeight: 700 }}>+ Issue Certificate</Link>
              <Link to="/admin/students" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', padding: '8px 0' }}>Students</Link>
              <Link to="/admin/verifications" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', padding: '8px 0' }}>Verification Audit Log</Link>
            </>
          )}
          {isStudent && (
            <>
              <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', padding: '8px 0' }}>Student Dashboard</Link>
              <Link to="/student/certificates" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', padding: '8px 0' }}>My Certificates</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .user-meta { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
