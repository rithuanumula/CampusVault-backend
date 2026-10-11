import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateApi } from '../api/certificateApi';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  Award,
  Search,
  Download,
  ExternalLink,
  ShieldAlert,
  Calendar,
  User,
  PlusCircle,
  Eye,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const AdminCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Revoke Modal
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedCertToRevoke, setSelectedCertToRevoke] = useState(null);
  const [revokeReason, setRevokeReason] = useState('Violation of academic integrity guidelines');
  const [revoking, setRevoking] = useState(false);

  // Details Modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCertDetails, setSelectedCertDetails] = useState(null);

  const { showToast } = useToast();

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await certificateApi.getAllCertificates(search);
      if (res.success && res.data) {
        setCertificates(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [search]);

  const openRevokeModal = (cert) => {
    setSelectedCertToRevoke(cert);
    setRevokeReason('Violation of academic integrity guidelines');
    setIsRevokeModalOpen(true);
  };

  const handleRevokeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCertToRevoke) return;

    setRevoking(true);
    try {
      await certificateApi.revokeCertificate(selectedCertToRevoke.id, revokeReason);
      showToast(`Certificate ${selectedCertToRevoke.certificateId} has been revoked.`, 'success');
      setIsRevokeModalOpen(false);
      fetchCertificates();
    } catch (err) {
      showToast(err.message || 'Error revoking certificate', 'error');
    } finally {
      setRevoking(false);
    }
  };

  const openDetailsModal = (cert) => {
    setSelectedCertDetails(cert);
    setIsDetailsModalOpen(true);
  };

  const filteredCerts = certificates.filter((c) =>
    statusFilter === 'ALL' || c.status === statusFilter
  );

  return (
    <div style={{ flex: 1, backgroundColor: '#f0f7ff', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#082f49', marginBottom: 6 }}>
              Issued Certificates Registry
            </h1>
            <p style={{ color: '#64748b' }}>
              Inspect, download, search, and manage revocations for all institutional credentials.
            </p>
          </div>

          <Link to="/admin/certificates/new" className="btn btn-primary" style={{ padding: '12px 20px' }}>
            <PlusCircle size={18} /> Issue New Certificate
          </Link>
        </div>

        {/* Filter bar */}
        <div className="card-white" style={{ padding: 18, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid #bae6fd' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} color="#0284c7" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by ID, student name, or event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['ALL', 'ACTIVE', 'REVOKED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: statusFilter === st ? '#0284c7' : '#ffffff',
                  color: statusFilter === st ? '#ffffff' : '#475569',
                  borderColor: statusFilter === st ? '#0284c7' : '#bae6fd'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card-white" style={{ overflow: 'hidden', border: '1.5px solid #bae6fd' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading certificates...</div>
          ) : filteredCerts.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Award size={48} color="#bae6fd" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#334155', marginBottom: 8 }}>No certificates found</h3>
              <p style={{ color: '#64748b' }}>Issue a new certificate to populate the registry.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f9ff', borderBottom: '1px solid #bae6fd', color: '#0369a1', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 20px' }}>Certificate ID</th>
                    <th style={{ padding: '14px 20px' }}>Student Recipient</th>
                    <th style={{ padding: '14px 20px' }}>Event</th>
                    <th style={{ padding: '14px 20px' }}>Issue Date</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCerts.map((cert) => (
                    <tr
                      key={cert.id}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#082f49' }}>
                        {cert.certificateId}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#082f49' }}>{cert.studentName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cert.studentCode} • {cert.studentDepartment}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 500, color: '#334155' }}>{cert.eventName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cert.certificateTitle}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748b' }}>
                        {cert.issueDate}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${cert.status === 'ACTIVE' ? 'badge-verified' : 'badge-revoked'}`}>
                          {cert.status === 'ACTIVE' ? 'VERIFIED' : 'REVOKED'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            onClick={() => openDetailsModal(cert)}
                            className="btn btn-secondary btn-sm"
                            style={{ border: '1px solid #bae6fd' }}
                            title="View Metadata & QR"
                          >
                            <Eye size={13} color="#0284c7" />
                          </button>

                          <a
                            href={certificateApi.getDownloadUrl(cert.certificateId)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ border: '1px solid #bae6fd' }}
                            title="Download PDF"
                          >
                            <Download size={13} color="#0284c7" />
                          </a>

                          <Link
                            to={`/verify/${cert.certificateId}`}
                            className="btn btn-secondary btn-sm"
                            style={{ border: '1px solid #bae6fd' }}
                            title="Verify in Public Registry"
                          >
                            <ExternalLink size={13} color="#0284c7" />
                          </Link>

                          {cert.status === 'ACTIVE' && (
                            <button
                              onClick={() => openRevokeModal(cert)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#dc2626', border: '1px solid #fecaca' }}
                              title="Revoke Certificate"
                            >
                              <ShieldAlert size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Certificate Details Modal */}
        {selectedCertDetails && (
          <Modal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title="Certificate Registry Details"
            maxWidth={580}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                backgroundColor: '#f0f9ff',
                borderRadius: 12,
                padding: 18,
                border: '1.5px solid #bae6fd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: 700 }}>
                    Certificate ID
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.25rem', fontWeight: 800, color: '#082f49' }}>
                    {selectedCertDetails.certificateId}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span className={`badge ${selectedCertDetails.status === 'ACTIVE' ? 'badge-verified' : 'badge-revoked'}`}>
                      {selectedCertDetails.status}
                    </span>
                  </div>
                </div>

                <img
                  src={certificateApi.getQrUrl(selectedCertDetails.certificateId)}
                  alt="QR"
                  style={{ width: 80, height: 80, borderRadius: 8, border: '1px solid #bae6fd', padding: 2, backgroundColor: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Recipient:</span>
                  <div style={{ fontWeight: 600, color: '#082f49' }}>{selectedCertDetails.studentName}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Student Roll:</span>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#082f49' }}>{selectedCertDetails.studentCode}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Department:</span>
                  <div style={{ color: '#334155' }}>{selectedCertDetails.studentDepartment}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Institution:</span>
                  <div style={{ color: '#334155' }}>{selectedCertDetails.studentCollege}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Event:</span>
                  <div style={{ fontWeight: 600, color: '#082f49' }}>{selectedCertDetails.eventName}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Date of Issue:</span>
                  <div style={{ color: '#334155' }}>{selectedCertDetails.issueDate}</div>
                </div>
              </div>

              {selectedCertDetails.status === 'REVOKED' && (
                <div style={{ padding: 14, backgroundColor: '#fee2e2', borderRadius: 8, border: '1px solid #fca5a5', color: '#991b1b', fontSize: '0.85rem' }}>
                  <strong>Revocation Reason:</strong> {selectedCertDetails.revocationReason}
                  <div style={{ marginTop: 4, fontSize: '0.75rem' }}>
                    Revoked at: {new Date(selectedCertDetails.revokedAt).toLocaleString()}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <a
                  href={certificateApi.getDownloadUrl(selectedCertDetails.certificateId)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <Download size={16} /> Download Official PDF
                </a>
              </div>
            </div>
          </Modal>
        )}

        {/* Certificate Revocation Modal */}
        {selectedCertToRevoke && (
          <Modal
            isOpen={isRevokeModalOpen}
            onClose={() => setIsRevokeModalOpen(false)}
            title="Revoke Certificate"
            maxWidth={500}
          >
            <form onSubmit={handleRevokeSubmit}>
              <div style={{
                padding: 16,
                backgroundColor: '#fef2f2',
                borderRadius: 10,
                border: '1px solid #fecaca',
                color: '#991b1b',
                fontSize: '0.875rem',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 4 }}>
                  <AlertTriangle size={18} /> Warning: Irreversible Action
                </div>
                <div>
                  You are about to revoke Certificate <strong>{selectedCertToRevoke.certificateId}</strong> issued to <strong>{selectedCertToRevoke.studentName}</strong>.
                  Future public verification requests will report status as <strong>REVOKED</strong>.
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Revocation Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Provide detailed justification for auditing"
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setIsRevokeModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={revoking}
                  className="btn btn-danger"
                >
                  {revoking ? 'Revoking...' : 'Confirm Revocation'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};
