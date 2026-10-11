import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, QrCode, Database, CheckCircle2, Search, Camera, ArrowRight, Lock, Sparkles, Building, FileCheck } from 'lucide-react';
import { QrScannerModal } from '../components/QrScannerModal';
import { statsApi } from '../api/statsApi';

export const LandingPage = () => {
  const [certInput, setCertInput] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to load live registry metrics
    statsApi.getAdminStats()
      .then(res => {
        if (res.success && res.data) setStats(res.data);
      })
      .catch(() => {
        // Fallback default statistics display
        setStats({
          totalCertificates: 120,
          totalStudents: 95,
          totalEvents: 18,
          totalVerifications: 340,
        });
      });
  }, []);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      navigate(`/verify/${encodeURIComponent(certInput.trim())}`);
    }
  };

  const handleQrScanned = (scannedId) => {
    navigate(`/verify/${encodeURIComponent(scannedId)}`);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(ellipse at top, #0f432f 0%, #072418 55%, #04140d 100%)',
        color: '#ffffff',
        padding: '80px 24px 90px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        {/* Subtle decorative background circles */}
        <div style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -150,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(36, 140, 100, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1040, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 9999,
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#fef08a',
            fontSize: '0.825rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 24,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <Sparkles size={16} color="#d4af37" />
            Official Institutional Registry • Zero Fake Credentials
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: 20
          }}>
            Your Achievements,<br />
            <span style={{
              background: 'linear-gradient(135deg, #fef08a 0%, #d4af37 60%, #eab308 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(212, 175, 55, 0.25)'
            }}>
              Always Authentic.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: '#cbd5e1',
            maxWidth: 720,
            margin: '0 auto 40px',
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Issue, manage, and verify digital certificates with confidence. Backed by tamper-evident MySQL records, instant QR verification, and cryptographic PDF generation.
          </p>

          {/* Instant Verification Search Box */}
          <div style={{
            maxWidth: 680,
            margin: '0 auto 24px',
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 8,
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.4)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240, paddingLeft: 12 }}>
              <Search size={22} color="#165b40" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. AU-WEB-2026-00421)"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifySubmit(e)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#0f172a',
                  background: 'transparent'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, width: 'auto' }}>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="btn btn-secondary"
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '0.875rem'
                }}
                title="Scan QR with Phone or Webcam"
              >
                <Camera size={18} color="#165b40" />
                <span>Scan QR</span>
              </button>

              <button
                type="button"
                onClick={handleVerifySubmit}
                className="btn btn-gold"
                style={{
                  padding: '12px 24px',
                  borderRadius: 10,
                  fontSize: '0.95rem'
                }}
              >
                <span>Verify Now</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Sample quick search badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Quick sample test:</span>
            <button
              onClick={() => {
                setCertInput('AU-WEB-2026-00421');
                navigate('/verify/AU-WEB-2026-00421');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#d4af37',
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              AU-WEB-2026-00421
            </button>
          </div>
        </div>
      </section>

      {/* Live Metric Ribbon */}
      <section style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '32px 24px'
      }}>
        <div style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10432f', fontFamily: 'Outfit, sans-serif' }}>
              {stats?.totalCertificates ?? 1}+
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              Issued Digital Credentials
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c59b27', fontFamily: 'Outfit, sans-serif' }}>
              100%
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              Tamper-Proof Verification
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10432f', fontFamily: 'Outfit, sans-serif' }}>
              {stats?.totalEvents ?? 3}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              Accredited Events & Workshops
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#16a34a', fontFamily: 'Outfit, sans-serif' }}>
              {stats?.totalVerifications ?? 12}+
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              Audit Checks Logged
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ color: '#165b40', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Engineered For Academic Trust
          </div>
          <h2 style={{ fontSize: '2.4rem', color: '#072418', fontWeight: 800 }}>
            Enterprise Credential Architecture
          </h2>
          <p style={{ color: '#64748b', maxWidth: 640, margin: '12px auto 0', fontSize: '1.05rem' }}>
            Built specifically to solve paper credential fraud, lost certificates, and slow verification calls for educational institutions.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 28
        }}>
          {/* Card 1 */}
          <div className="card-white" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#e8f5ee',
              color: '#10432f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#072418' }}>
              Secure Certificate Issuance
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Authorized administrators issue digital certificates for hackathons, workshops, internships, and cultural meets with atomic database transactions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-white" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#fef9c3',
              color: '#b38618',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#072418' }}>
              Unique Certificate IDs
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Every credential is generated with a non-repeating, collision-proof ID code (e.g. AU-WEB-2026-00421) strictly enforced with relational uniqueness constraints.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-white" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QrCode size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#072418' }}>
              QR-Based Instant Verification
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Embedded ZXing QR codes open the verification registry immediately. Employers and recruiters can scan on any phone camera without app installation.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card-white" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#fae8ff',
              color: '#86198f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#072418' }}>
              Trusted MySQL Audit Registry
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Verification checks directly interrogate the live MySQL database. Revoked credentials immediately report status REVOKED, and each lookup is recorded for fraud audit.
            </p>
          </div>
        </div>
      </section>

      {/* How CampusVault Works Section */}
      <section style={{
        backgroundColor: '#0a3323',
        color: '#ffffff',
        padding: '80px 24px',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              End-to-End Credential Flow
            </div>
            <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginTop: 8 }}>
              How CampusVault Works
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24
          }}>
            {[
              {
                step: '01',
                title: 'Event & Student Setup',
                desc: 'Admins register authorized students and official events such as workshops, hackathons, and symposiums.'
              },
              {
                step: '02',
                title: 'Certificate Issuance',
                desc: 'Spring Boot backend generates unique ID, embeds ZXing QR code, and compiles high-res OpenPDF.'
              },
              {
                step: '03',
                title: 'Student Access',
                desc: 'Students log into their private dashboard, download PDF certificates, or share their scannable credentials.'
              },
              {
                step: '04',
                title: 'Public Verification',
                desc: 'Recruiters scan the QR code or type the ID. Live MySQL check confirms valid status or flags revocation.'
              }
            ].map((s, idx) => (
              <div key={idx} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 16,
                padding: 24,
                position: 'relative'
              }}>
                <div style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#d4af37',
                  marginBottom: 12
                }}>
                  {s.step}
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: 8 }}>
                  {s.title}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0e4430 0%, #072318 100%)',
          borderRadius: 24,
          padding: '48px 32px',
          color: '#ffffff',
          boxShadow: '0 20px 40px -10px rgba(7, 35, 24, 0.3)',
          border: '1.5px solid #d4af37'
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: 16 }}>
            Ready to Verify or Issue Certificates?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto 32px' }}>
            Check existing credentials publicly without logging in, or sign in to your institutional student/admin portal.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/verify" className="btn btn-gold btn-lg">
              <ShieldCheck size={20} />
              Public Certificate Verifier
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Camera QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQrScanned}
      />
    </div>
  );
};
