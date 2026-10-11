import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '../api/statsApi';
import { certificateApi } from '../api/certificateApi';
import {
  Users,
  Calendar,
  Award,
  ShieldCheck,
  AlertTriangle,
  History,
  PlusCircle,
  Download,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi.getAdminStats()
      .then((res) => {
        if (res.success && res.data) setStats(res.data);
      })
      .catch((err) => console.error('Failed to load admin stats', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ flex: 1, backgroundColor: '#f0f7ff', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 36
        }}>
          <div>
            <div style={{ color: '#0284c7', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              Administrative Command Center
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#082f49', margin: 0 }}>
              CampusVault Institutional Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/admin/events" className="btn btn-secondary" style={{ border: '1px solid #bae6fd' }}>
              <Calendar size={16} color="#0284c7" /> Manage Events
            </Link>
            <Link to="/admin/students" className="btn btn-secondary" style={{ border: '1px solid #bae6fd' }}>
              <Users size={16} color="#0284c7" /> Manage Students
            </Link>
            <Link to="/admin/certificates/new" className="btn btn-primary">
              <PlusCircle size={18} /> Issue New Certificate
            </Link>
          </div>
        </div>

        {/* 6 Key Stat Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 20,
          marginBottom: 40
        }}>
          {/* Total Students */}
          <div className="card-white" style={{ padding: 20, borderLeft: '4px solid #0284c7', border: '1.5px solid #e0f2fe', borderLeftWidth: 4, borderLeftColor: '#0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>Students</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#082f49', fontFamily: 'Outfit, sans-serif' }}>
              {loading ? '...' : (stats?.totalStudents ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>Registered Profiles</div>
          </div>

          {/* Total Events */}
          <div className="card-white" style={{ padding: 20, borderLeft: '4px solid #0369a1', border: '1.5px solid #e0f2fe', borderLeftWidth: 4, borderLeftColor: '#0369a1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>Events</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#082f49', fontFamily: 'Outfit, sans-serif' }}>
              {loading ? '...' : (stats?.totalEvents ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>Accredited Programs</div>
          </div>

          {/* Total Certificates */}
          <div className="card-white" style={{ padding: 20, borderLeft: '4px solid #0ea5e9', border: '1.5px solid #e0f2fe', borderLeftWidth: 4, borderLeftColor: '#0ea5e9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>Certificates</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#082f49', fontFamily: 'Outfit, sans-serif' }}>
              {loading ? '...' : (stats?.totalCertificates ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>Issued Credentials</div>
          </div>

          {/* Active Verified */}
          <div className="card-white" style={{ padding: 20, borderLeft: '4px solid #10b981', border: '1.5px solid #e0f2fe', borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>Active</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <ShieldCheck size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#059669', fontFamily: 'Outfit, sans-serif' }}>
              {loading ? '...' : (stats?.activeCertificates ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: 4 }}>Valid in Registry</div>
          </div>

          {/* Revoked */}
          <div className="card-white" style={{ padding: 20, borderLeft: '4px solid #ef4444', border: '1.5px solid #e0f2fe', borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>Revoked</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <AlertTriangle size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#dc2626', fontFamily: 'Outfit, sans-serif' }}>
              {loading ? '...' : (stats?.revokedCertificates ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 4 }}>Flagged / Withdrawn</div>
          </div>

          {/* Total Verifications */}
          <div className="card-white" style={{ padding: 20, borderLeft: '4px solid #38bdf8', border: '1.5px solid #e0f2fe', borderLeftWidth: 4, borderLeftColor: '#38bdf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>Audit Checks</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <History size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#082f49', fontFamily: 'Outfit, sans-serif' }}>
              {loading ? '...' : (stats?.totalVerifications ?? 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>Verification Queries</div>
          </div>
        </div>

        {/* Dual Panel: Recent Certificates & Verification Logs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: 28
        }}>
          {/* Panel 1: Recent Certificates */}
          <div className="card-white" style={{ padding: 24, border: '1.5px solid #e0f2fe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.15rem', color: '#082f49' }}>Recently Issued Certificates</h3>
              </div>
              <Link to="/admin/certificates" style={{ color: '#0284c7', fontSize: '0.825rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>Loading certificates...</div>
            ) : (!stats?.recentCertificates || stats.recentCertificates.length === 0) ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>No certificates issued yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.recentCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '0.85rem', color: '#082f49' }}>
                          {cert.certificateId}
                        </span>
                        <span className={`badge ${cert.status === 'ACTIVE' ? 'badge-verified' : 'badge-revoked'}`} style={{ fontSize: '0.7rem' }}>
                          {cert.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                        {cert.studentName} — <span style={{ color: '#64748b', fontWeight: 400 }}>{cert.eventName}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <a
                        href={certificateApi.getDownloadUrl(cert.certificateId)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ border: '1px solid #bae6fd' }}
                        title="Download PDF"
                      >
                        <Download size={14} color="#0284c7" />
                      </a>
                      <Link
                        to={`/verify/${cert.certificateId}`}
                        className="btn btn-secondary btn-sm"
                        style={{ border: '1px solid #bae6fd' }}
                        title="Verify Publicly"
                      >
                        <ExternalLink size={14} color="#0284c7" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel 2: Live Verification Audit Log */}
          <div className="card-white" style={{ padding: 24, border: '1.5px solid #e0f2fe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.15rem', color: '#082f49' }}>Recent Verification Audit Logs</h3>
              </div>
              <Link to="/admin/verifications" style={{ color: '#0284c7', fontSize: '0.825rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                Full Audit Log <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>Loading audit logs...</div>
            ) : (!stats?.recentVerifications || stats.recentVerifications.length === 0) ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>No verification attempts logged yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.recentVerifications.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '0.85rem', color: '#082f49' }}>
                          {v.certificateId}
                        </span>
                        <span className={`badge ${
                          v.verificationResult === 'VERIFIED'
                            ? 'badge-verified'
                            : v.verificationResult === 'REVOKED'
                            ? 'badge-revoked'
                            : 'badge-invalid'
                        }`} style={{ fontSize: '0.7rem' }}>
                          {v.verificationResult}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                          {v.verificationMethod}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        IP: {v.clientIp || '127.0.0.1'} • {new Date(v.verificationTimestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
