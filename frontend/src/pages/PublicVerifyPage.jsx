import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { certificateApi } from '../api/certificateApi';
import { QrScannerModal } from '../components/QrScannerModal';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Search,
  Camera,
  Download,
  Calendar,
  Building,
  User,
  Award,
  Clock,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PublicVerifyPage = () => {
  const { certificateId: routeCertId } = useParams();
  const navigate = useNavigate();

  const [inputCertId, setInputCertId] = useState(routeCertId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (routeCertId) {
      setInputCertId(routeCertId);
      performVerification(routeCertId, 'QR');
    }
  }, [routeCertId]);

  const performVerification = async (certIdToVerify, method = 'MANUAL_ID') => {
    if (!certIdToVerify || !certIdToVerify.trim()) {
      setErrorMsg('Please enter a Certificate ID');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await certificateApi.verifyCertificate(certIdToVerify.trim(), method);
      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.status === 'VERIFIED') {
          // Trigger celebratory confetti for authentic credential
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#d4af37', '#0e4430', '#ffffff']
          });
        }
      } else {
        setErrorMsg('Failed to process verification response.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to connect to verification registry. Please check server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputCertId.trim()) {
      navigate(`/verify/${encodeURIComponent(inputCertId.trim())}`);
      performVerification(inputCertId.trim(), 'MANUAL_ID');
    }
  };

  const handleQrScanned = (scannedId) => {
    setInputCertId(scannedId);
    navigate(`/verify/${encodeURIComponent(scannedId)}`);
    performVerification(scannedId, 'QR');
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#f7faf8', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 9999,
            backgroundColor: '#e8f5ee',
            color: '#10432f',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12
          }}>
            <ShieldCheck size={16} color="#165b40" />
            Public Verification Authority
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#072418', marginBottom: 12 }}>
            Verify Certificate Authenticity
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 620, margin: '0 auto' }}>
            Check the live institutional database record of any certificate issued by CampusVault by entering the Certificate ID or scanning its QR code.
          </p>
        </div>

        {/* Verification Input Card */}
        <div className="card-white" style={{ padding: 28, marginBottom: 36, border: '1.5px solid #e2e8f0' }}>
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Enter Certificate ID (e.g. AU-WEB-2026-00421)"
                  value={inputCertId}
                  onChange={(e) => setInputCertId(e.target.value)}
                  className="form-input"
                  style={{
                    fontSize: '1.05rem',
                    padding: '14px 16px',
                    fontFamily: 'JetBrains Mono, monospace',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="btn btn-secondary"
                style={{ padding: '14px 20px', fontSize: '0.95rem' }}
                title="Scan with Camera"
              >
                <Camera size={20} color="#10432f" />
                <span>Scan QR</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem', minWidth: 140 }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Verify ID</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick presets */}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: '0.825rem', color: '#64748b' }}>
            <span>Preset test certificates:</span>
            <button
              type="button"
              onClick={() => {
                setInputCertId('AU-WEB-2026-00421');
                navigate('/verify/AU-WEB-2026-00421');
                performVerification('AU-WEB-2026-00421', 'MANUAL_ID');
              }}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '3px 8px',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                color: '#0f172a'
              }}
            >
              AU-WEB-2026-00421 (Valid)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <XCircle size={22} style={{ flexShrink: 0 }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Verification Result Card */}
        {result && (
          <div className="animate-fade-in">
            {/* CASE 1: VERIFIED */}
            {result.status === 'VERIFIED' && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                border: '2px solid #86efac',
                boxShadow: '0 12px 30px -5px rgba(22, 101, 52, 0.12)',
                overflow: 'hidden'
              }}>
                {/* Result Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                  padding: '24px 32px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #86efac'
                    }}>
                      <CheckCircle2 size={30} color="#86efac" />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: '#a7f3d0',
                        textTransform: 'uppercase'
                      }}>
                        Verification Result
                      </div>
                      <h2 style={{ color: '#ffffff', fontSize: '1.6rem', margin: 0 }}>
                        OFFICIALLY VERIFIED
                      </h2>
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 16px',
                    borderRadius: 9999,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}>
                    {result.certificateId}
                  </div>
                </div>

                {/* Details Body */}
                <div style={{ padding: 32 }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 24,
                    marginBottom: 32
                  }}>
                    {/* Student Info */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: 20,
                      borderRadius: 14,
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                        <User size={16} /> RECIPIENT STUDENT
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                        {result.studentName}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                        {result.studentDepartment}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: 4 }}>
                        {result.institutionName}
                      </div>
                    </div>

                    {/* Event Info */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: 20,
                      borderRadius: 14,
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                        <Award size={16} /> EVENT / RECOGNITION
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                        {result.eventName}
                      </div>
                      <div style={{ display: 'inline-block', marginBottom: 6 }}>
                        <span className="badge badge-category">{result.eventCategory}</span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                        Organized by: {result.eventOrganizer}
                      </div>
                    </div>
                  </div>

                  {/* Certificate Statement */}
                  <div style={{
                    padding: 20,
                    borderRadius: 12,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    marginBottom: 28
                  }}>
                    <div style={{ fontWeight: 700, color: '#166534', marginBottom: 6, fontSize: '1.05rem' }}>
                      {result.certificateTitle}
                    </div>
                    {result.description && (
                      <p style={{ color: '#15803d', fontSize: '0.925rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{result.description}"
                      </p>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    paddingTop: 16,
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: '0.875rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={16} />
                        <span>Issue Date: <strong>{result.issueDate}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={16} />
                        <span>Verified At: <strong>{new Date(result.verifiedAt).toLocaleTimeString()}</strong></span>
                      </div>
                    </div>

                    {/* Download PDF button */}
                    <a
                      href={certificateApi.getDownloadUrl(result.certificateId)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      <Download size={18} />
                      <span>Download Official PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: REVOKED */}
            {result.status === 'REVOKED' && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                border: '2px solid #f87171',
                boxShadow: '0 12px 30px -5px rgba(220, 38, 38, 0.12)',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                  padding: '24px 32px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fca5a5'
                  }}>
                    <AlertTriangle size={28} color="#fee2e2" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fca5a5', textTransform: 'uppercase' }}>
                      Security Warning
                    </div>
                    <h2 style={{ color: '#ffffff', fontSize: '1.6rem', margin: 0 }}>
                      CERTIFICATE HAS BEEN REVOKED
                    </h2>
                  </div>
                </div>

                <div style={{ padding: 32 }}>
                  <div style={{
                    padding: 20,
                    backgroundColor: '#fef2f2',
                    borderRadius: 12,
                    border: '1px solid #fecaca',
                    marginBottom: 24
                  }}>
                    <div style={{ color: '#991b1b', fontWeight: 700, marginBottom: 6 }}>
                      Official Revocation Statement:
                    </div>
                    <p style={{ color: '#b91c1c', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {result.revocationReason || 'This certificate has been withdrawn by the academic issuing authority.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, color: '#475569', fontSize: '0.9rem' }}>
                    <div>
                      Certificate ID: <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>{result.certificateId}</strong>
                    </div>
                    {result.studentName && <div>Student: <strong>{result.studentName}</strong></div>}
                    {result.institutionName && <div>Institution: <strong>{result.institutionName}</strong></div>}
                    {result.revokedAt && (
                      <div>Revoked Date: <strong>{new Date(result.revokedAt).toLocaleDateString()}</strong></div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CASE 3: INVALID / NOT FOUND */}
            {result.status === 'INVALID' && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                border: '2px solid #fde047',
                boxShadow: '0 12px 30px -5px rgba(202, 138, 4, 0.1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #713f12 0%, #854d0e 100%)',
                  padding: '24px 32px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fef08a'
                  }}>
                    <XCircle size={28} color="#fef08a" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fef08a', textTransform: 'uppercase' }}>
                      Registry Lookup Result
                    </div>
                    <h2 style={{ color: '#ffffff', fontSize: '1.6rem', margin: 0 }}>
                      INVALID OR UNREGISTERED CREDENTIAL
                    </h2>
                  </div>
                </div>

                <div style={{ padding: 32 }}>
                  <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 20 }}>
                    {result.message}
                  </p>

                  <div style={{
                    backgroundColor: '#fffbeb',
                    borderRadius: 12,
                    padding: 18,
                    border: '1px solid #fef3c7',
                    color: '#92400e',
                    fontSize: '0.9rem',
                    lineHeight: 1.6
                  }}>
                    <strong>Verification Guidance:</strong>
                    <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                      <li>Ensure there are no typing mistakes or missing hyphens in Certificate ID <code>{result.certificateId}</code>.</li>
                      <li>Only certificates officially generated and registered in CampusVault can be verified.</li>
                      <li>Contact the issuing college or event organizer if you believe this is in error.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQrScanned}
      />
    </div>
  );
};
