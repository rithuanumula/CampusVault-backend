import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { certificateApi } from '../api/certificateApi';
import { studentApi } from '../api/studentApi';
import { Award, Download, Calendar, ExternalLink, ShieldCheck, User, Building, QrCode, FileText } from 'lucide-react';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, certsRes] = await Promise.all([
          studentApi.getStudentProfile(),
          certificateApi.getStudentCertificates()
        ]);

        if (profRes.success && profRes.data) {
          setProfile(profRes.data);
        }
        if (certsRes.success && certsRes.data) {
          setCertificates(certsRes.data);
        }
      } catch (err) {
        console.error('Error loading student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ flex: 1, backgroundColor: '#f0f7ff', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          borderRadius: 20,
          padding: '36px 32px',
          color: '#ffffff',
          marginBottom: 36,
          boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25)',
          border: '1.5px solid #bae6fd'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ color: '#e0f2fe', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                Verified Student Portal
              </div>
              <h1 style={{ color: '#ffffff', fontSize: '2.1rem', marginBottom: 8 }}>
                Welcome, {user?.fullName || 'Student'}!
              </h1>
              <p style={{ color: '#e0f2fe', fontSize: '0.95rem' }}>
                Access and manage your digitally verified credentials and transcripts.
              </p>
            </div>

            <Link
              to="/student/certificates"
              className="btn"
              style={{
                backgroundColor: '#ffffff',
                color: '#0284c7',
                fontWeight: 700,
                padding: '12px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Award size={18} />
              <span>View All ({certificates.length}) Certificates</span>
            </Link>
          </div>
        </div>

        {/* Profile Card & Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 40
        }}>
          {/* Profile Card */}
          <div className="card-white" style={{ padding: 24, border: '1.5px solid #e0f2fe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0284c7', marginBottom: 16 }}>
              <User size={20} />
              <h3 style={{ fontSize: '1.1rem', color: '#082f49' }}>Academic Profile</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Student Roll No: </span>
                <strong style={{ fontFamily: 'JetBrains Mono, monospace', color: '#082f49' }}>
                  {profile?.studentId || user?.studentId || 'AU-2026-00421'}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Department: </span>
                <strong style={{ color: '#082f49' }}>{profile?.department || 'Computer Science and Engineering'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>College: </span>
                <strong style={{ color: '#082f49' }}>{profile?.college || 'Apex University Institute of Technology'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Academic Year: </span>
                <strong style={{ color: '#082f49' }}>{profile?.academicYear || '4th Year (2023-2027)'}</strong>
              </div>
            </div>
          </div>

          {/* Stats: Credentials Count */}
          <div className="card-white" style={{ padding: 24, border: '1.5px solid #e0f2fe', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0284c7' }}>
              <Award size={20} />
              <h3 style={{ fontSize: '1.1rem', color: '#082f49' }}>Credentials Earned</h3>
            </div>
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0284c7', fontFamily: 'Outfit, sans-serif' }}>
                {certificates.length}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                All registered and verified on MySQL ledger
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284c7', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 100% Cryptographically Validated
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.5rem', color: '#082f49' }}>
              My Digital Certificates
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              Loading your certificates...
            </div>
          ) : certificates.length === 0 ? (
            <div className="card-white" style={{ padding: 48, textAlign: 'center' }}>
              <Award size={48} color="#bae6fd" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#334155', marginBottom: 8 }}>No certificates issued yet</h3>
              <p style={{ color: '#64748b', maxWidth: 460, margin: '0 auto' }}>
                Once you participate and complete events or workshops, your certificates will be issued here with verifiable QR codes.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 24
            }}>
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="card-white"
                  style={{
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1.5px solid #e0f2fe',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Top row: Category & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span className="badge badge-category">{cert.eventCategory || 'WORKSHOP'}</span>
                      <span className={`badge ${cert.status === 'ACTIVE' ? 'badge-verified' : 'badge-revoked'}`}>
                        {cert.status === 'ACTIVE' ? 'VERIFIED' : 'REVOKED'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: '#082f49', marginBottom: 6 }}>
                      {cert.certificateTitle}
                    </h3>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0284c7', marginBottom: 12 }}>
                      {cert.eventName}
                    </div>

                    {cert.description && (
                      <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 16 }}>
                        {cert.description}
                      </p>
                    )}

                    {/* Metadata Box with scannable QR Code */}
                    <div style={{
                      backgroundColor: '#f0f9ff',
                      borderRadius: 12,
                      padding: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      marginBottom: 20,
                      border: '1px solid #bae6fd'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Certificate ID:</span>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#082f49' }}>
                            {cert.certificateId}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}>
                          <Calendar size={14} color="#0284c7" />
                          <span>{cert.issueDate}</span>
                        </div>
                      </div>

                      {/* QR Thumbnail */}
                      <img
                        src={certificateApi.getQrUrl(cert.certificateId)}
                        alt="QR Code"
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          border: '1px solid #bae6fd',
                          backgroundColor: '#ffffff',
                          padding: 2
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                    <a
                      href={certificateApi.getDownloadUrl(cert.certificateId)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <Download size={15} />
                      <span>Download PDF</span>
                    </a>

                    <Link
                      to={`/verify/${cert.certificateId}`}
                      className="btn btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem', border: '1px solid #bae6fd' }}
                      title="Open Public Verification"
                    >
                      <ExternalLink size={15} color="#0284c7" />
                      <span>Verify</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
