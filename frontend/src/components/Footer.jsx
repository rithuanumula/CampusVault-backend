import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Lock, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      background: '#ffffff',
      borderTop: '1.5px solid #e0f2fe',
      color: '#64748b',
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
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                border: '1px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.25)'
              }}>
                <ShieldCheck size={18} color="#ffffff" />
              </div>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#082f49'
              }}>
                Campus<span style={{ color: '#0284c7' }}>Vault</span>
              </span>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.6, maxWidth: 320 }}>
              Official institutional digital certificate authority. Cryptographic QR generation, tamper-proof audit trails, and instant public credential verification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ color: '#082f49', fontWeight: 700, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>
              Verification & Registry
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <Link to="/verify" style={{ color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#0284c7'} onMouseOut={e => e.target.style.color = '#64748b'}>
                  Public Certificate Verifier
                </Link>
              </li>
              <li>
                <Link to="/verify/AU-WEB-2026-00421" style={{ color: '#64748b' }} onMouseOver={e => e.target.style.color = '#0284c7'} onMouseOut={e => e.target.style.color = '#64748b'}>
                  Verify Sample Certificate
                </Link>
              </li>
              <li>
                <Link to="/events" style={{ color: '#64748b' }} onMouseOver={e => e.target.style.color = '#0284c7'} onMouseOut={e => e.target.style.color = '#64748b'}>
                  Institutions & Event Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <div style={{ color: '#082f49', fontWeight: 700, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>
              Portals & Access
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link to="/login" style={{ color: '#64748b' }} onMouseOver={e => e.target.style.color = '#0284c7'} onMouseOut={e => e.target.style.color = '#64748b'}>Institutional Login</Link></li>
              <li><Link to="/register" style={{ color: '#64748b' }} onMouseOver={e => e.target.style.color = '#0284c7'} onMouseOut={e => e.target.style.color = '#64748b'}>Student Self-Registration</Link></li>
              <li><Link to="/student/dashboard" style={{ color: '#64748b' }} onMouseOver={e => e.target.style.color = '#0284c7'} onMouseOut={e => e.target.style.color = '#64748b'}>Student Credential Vault</Link></li>
              <li><Link to="/admin/dashboard" style={{ color: '#64748b' }} onMouseOver={e => e.target.style.color = '#0284c7'} onMouseOut={e => e.target.style.color = '#64748b'}>Admin Issuance Desk</Link></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <div style={{ color: '#082f49', fontWeight: 700, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>
              Security & Trust Guarantee
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', background: '#f0f9ff', padding: '6px 12px', borderRadius: 8, border: '1px solid #bae6fd' }}>
                <CheckCircle2 size={16} />
                <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>Zero Hardcoded Verifications</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', background: '#f0f9ff', padding: '6px 12px', borderRadius: 8, border: '1px solid #bae6fd' }}>
                <Lock size={16} />
                <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>Spring Security + JWT Auth</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', background: '#f0f9ff', padding: '6px 12px', borderRadius: 8, border: '1px solid #bae6fd' }}>
                <Award size={16} />
                <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>Direct MySQL 8 Cryptographic Audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
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
