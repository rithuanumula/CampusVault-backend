import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Lock, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      background: '#04140d',
      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      color: '#94a3b8',
      fontSize: '0.875rem',
      padding: '48px 24px 24px'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 36,
          marginBottom: 36
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#0e382c',
                border: '1px solid #d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#d4af37" />
              </div>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff'
              }}>
                Campus<span style={{ color: '#d4af37' }}>Vault</span>
              </span>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.6, maxWidth: 320 }}>
              Official institutional digital certificate authority. Cryptographic QR generation, tamper-proof audit trails, and instant public credential verification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>
              Verification & Registry
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <Link to="/verify" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#d4af37'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  Public Certificate Verifier
                </Link>
              </li>
              <li>
                <Link to="/verify/AU-WEB-2026-00421" style={{ color: '#94a3b8' }} onMouseOver={e => e.target.style.color = '#d4af37'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  Verify Sample Certificate
                </Link>
              </li>
              <li>
                <Link to="/events" style={{ color: '#94a3b8' }} onMouseOver={e => e.target.style.color = '#d4af37'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  Institutions & Event Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>
              Portals & Access
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Institutional Login</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8' }}>Student Self-Registration</Link></li>
              <li><Link to="/student/dashboard" style={{ color: '#94a3b8' }}>Student Credential Vault</Link></li>
              <li><Link to="/admin/dashboard" style={{ color: '#94a3b8' }}>Admin Issuance Desk</Link></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>
              Security & Verification Guarantee
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a7f3d0' }}>
                <CheckCircle2 size={16} />
                <span>Zero Hardcoded Verifications</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a7f3d0' }}>
                <Lock size={16} />
                <span>Spring Security + JWT Auth</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a7f3d0' }}>
                <Award size={16} />
                <span>Direct MySQL 8 Cryptographic Audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 24,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          <div>
            © 2026 CampusVault — Digital Certificate Verification System. Built for Higher Education Excellence.
          </div>
          <div style={{ display: 'flex', gap: 18, color: '#64748b', fontSize: '0.8rem' }}>
            <span>Backend: Java Spring Boot 3</span>
            <span>Database: MySQL 8</span>
            <span>Frontend: React.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
