import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateApi } from '../api/certificateApi';
import { Award, Download, ExternalLink, Calendar, Search, ArrowLeft } from 'lucide-react';

export const StudentCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateApi.getStudentCertificates()
      .then((res) => {
        if (res.success && res.data) setCertificates(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCerts = certificates.filter((c) =>
    c.certificateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ flex: 1, backgroundColor: '#f0f7ff', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Navigation Bar */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/student/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 600, fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#082f49', marginBottom: 6 }}>
              My Verified Credentials
            </h1>
            <p style={{ color: '#64748b' }}>
              All certificates officially issued to your student account
            </p>
          </div>

          <div style={{ minWidth: 280, position: 'relative' }}>
            <Search size={18} color="#0284c7" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by event or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40, border: '1.5px solid #bae6fd' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading certificates...</div>
        ) : filteredCerts.length === 0 ? (
          <div className="card-white" style={{ padding: 48, textAlign: 'center', border: '1.5px solid #bae6fd' }}>
            <Award size={48} color="#bae6fd" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#334155', marginBottom: 8 }}>No certificates found</h3>
            <p style={{ color: '#64748b' }}>No certificates matching your search query.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
            {filteredCerts.map((cert) => (
              <div key={cert.id} className="card-white" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1.5px solid #e0f2fe' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-category">{cert.eventCategory || 'WORKSHOP'}</span>
                    <span className={`badge ${cert.status === 'ACTIVE' ? 'badge-verified' : 'badge-revoked'}`}>
                      {cert.status === 'ACTIVE' ? 'VERIFIED' : 'REVOKED'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#082f49', marginBottom: 4 }}>
                    {cert.certificateTitle}
                  </h3>
                  <div style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', marginBottom: 12 }}>
                    {cert.eventName}
                  </div>

                  <div style={{
                    backgroundColor: '#f0f9ff',
                    borderRadius: 12,
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 20,
                    border: '1px solid #bae6fd'
                  }}>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Certificate ID</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#082f49' }}>
                        {cert.certificateId}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>
                        Issued: {cert.issueDate}
                      </div>
                    </div>
                    <img
                      src={certificateApi.getQrUrl(cert.certificateId)}
                      alt="QR"
                      style={{ width: 60, height: 60, borderRadius: 6, border: '1px solid #bae6fd', backgroundColor: '#ffffff', padding: 2 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
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
  );
};
