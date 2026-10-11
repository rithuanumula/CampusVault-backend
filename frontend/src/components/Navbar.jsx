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
      background: 'linear-gradient(180deg, #072318 0%, #0a3323 100%)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
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
            background: 'linear-gradient(135deg, #165b40 0%, #0c3323 100%)',
            border: '1.5px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(212, 175, 55, 0.3)'
          }}>
            <ShieldCheck size={26} color="#d4af37" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              Campus<span style={{ color: '#d4af37' }}>Vault</span>
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#a7f3d0'
            }}>
              Digital Credential Registry
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: 8 }} className="desktop-nav">
          <Link
            to="/verify"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive('/verify') ? '#ffffff' : '#d1fae5',
              backgroundColor: isActive('/verify') ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={16} color="#d4af37" />
            Verify Credential
          </Link>

          <Link
            to="/events"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive('/events') ? '#ffffff' : '#d1fae5',
              backgroundColor: isActive('/events') ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Calendar size={16} />
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
                  color: isActive('/admin/dashboard') ? '#ffffff' : '#d1fae5',
                  backgroundColor: isActive('/admin/dashboard') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
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
                  color: isActive('/admin/certificates') ? '#ffffff' : '#d1fae5',
                  backgroundColor: isActive('/admin/certificates') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
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
                  color: '#082418',
                  backgroundColor: '#d4af37',
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
                  color: isActive('/admin/students') ? '#ffffff' : '#d1fae5',
                  backgroundColor: isActive('/admin/students') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
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
                  color: isActive('/admin/verifications') ? '#ffffff' : '#d1fae5',
                  backgroundColor: isActive('/admin/verifications') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
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
                  color: isActive('/student/dashboard') ? '#ffffff' : '#d1fae5',
                  backgroundColor: isActive('/student/dashboard') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
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
                  color: isActive('/student/certificates') ? '#ffffff' : '#d1fae5',
                  backgroundColor: isActive('/student/certificates') ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Award size={16} />
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
                <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600 }}>
                  {user?.fullName}
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: isAdmin ? '#d4af37' : '#a7f3d0',
                  textTransform: 'uppercase'
                }}>
                  {isAdmin ? 'Administrator' : `Student (${user?.studentId || 'AU'})`}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
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
                  color: '#ffffff',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
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
                  color: '#082418',
                  background: 'linear-gradient(135deg, #d4af37 0%, #e4c45b 100%)',
                  boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
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
              color: '#ffffff',
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
          background: '#072318',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#d1fae5', padding: '8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ShieldCheck size={18} color="#d4af37" /> Verify Credential
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#d1fae5', padding: '8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Calendar size={18} /> Events
          </Link>
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', padding: '8px 0' }}>Admin Dashboard</Link>
              <Link to="/admin/certificates" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', padding: '8px 0' }}>Certificates</Link>
              <Link to="/admin/certificates/new" onClick={() => setMobileMenuOpen(false)} style={{ color: '#d4af37', padding: '8px 0', fontWeight: 700 }}>+ Issue Certificate</Link>
              <Link to="/admin/students" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', padding: '8px 0' }}>Students</Link>
              <Link to="/admin/verifications" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', padding: '8px 0' }}>Verification Audit Log</Link>
            </>
          )}
          {isStudent && (
            <>
              <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', padding: '8px 0' }}>Student Dashboard</Link>
              <Link to="/student/certificates" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', padding: '8px 0' }}>My Certificates</Link>
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
