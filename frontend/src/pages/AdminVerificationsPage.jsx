import React, { useState, useEffect } from 'react';
import { statsApi } from '../api/statsApi';
import { useToast } from '../context/ToastContext';
import { History, Search, ShieldCheck, AlertTriangle, XCircle, ArrowLeft, ArrowRight, Globe } from 'lucide-react';

export const AdminVerificationsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const { showToast } = useToast();

  const fetchRecords = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await statsApi.getVerificationHistory(search, pageNum, 15);
      if (res.success && res.data) {
        setRecords(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
        setPage(pageNum);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load verification logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(0);
  }, [search]);

  return (
    <div style={{ flex: 1, backgroundColor: '#f7faf8', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#072418', marginBottom: 6 }}>
              Verification Audit Trail
            </h1>
            <p style={{ color: '#64748b' }}>
              Full audit log of all QR scans and manual certificate lookups performed across the platform. Total records: {totalElements}.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="card-white" style={{ padding: 18, marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search audit trail by Certificate ID or remarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Audit Table */}
        <div className="card-white" style={{ overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading verification logs...</div>
          ) : records.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <History size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#334155', marginBottom: 8 }}>No verification logs found</h3>
              <p style={{ color: '#64748b' }}>Verification attempts will appear here automatically.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 20px' }}>Log ID</th>
                    <th style={{ padding: '14px 20px' }}>Certificate ID Queried</th>
                    <th style={{ padding: '14px 20px' }}>Method</th>
                    <th style={{ padding: '14px 20px' }}>Result</th>
                    <th style={{ padding: '14px 20px' }}>Client IP</th>
                    <th style={{ padding: '14px 20px' }}>Timestamp</th>
                    <th style={{ padding: '14px 20px' }}>Audit Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.8rem' }}>
                        #{r.id}
                      </td>
                      <td style={{ padding: '16px 20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#072418' }}>
                        {r.certificateId}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          backgroundColor: r.verificationMethod === 'QR' ? '#e0f2fe' : '#f1f5f9',
                          color: r.verificationMethod === 'QR' ? '#0369a1' : '#475569',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {r.verificationMethod}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${
                          r.verificationResult === 'VERIFIED'
                            ? 'badge-verified'
                            : r.verificationResult === 'REVOKED'
                            ? 'badge-revoked'
                            : 'badge-invalid'
                        }`}>
                          {r.verificationResult}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#64748b' }}>
                        {r.clientIp || '127.0.0.1'}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.85rem' }}>
                        {new Date(r.verificationTimestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.85rem' }}>
                        {r.remarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination controls */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
            fontSize: '0.85rem',
            color: '#64748b'
          }}>
            <div>
              Page {page + 1} of {totalPages} ({totalElements} total entries)
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={page === 0}
                onClick={() => fetchRecords(page - 1)}
                className="btn btn-secondary btn-sm"
              >
                <ArrowLeft size={14} /> Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => fetchRecords(page + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
