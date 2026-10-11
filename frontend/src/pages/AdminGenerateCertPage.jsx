import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentApi } from '../api/studentApi';
import { eventApi } from '../api/eventApi';
import { certificateApi } from '../api/certificateApi';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import {
  Award,
  Calendar,
  User,
  Sparkles,
  QrCode,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminGenerateCertPage = () => {
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    eventId: '',
    certificateTitle: 'Certificate of Excellence & Completion',
    description: 'Successfully participated in hands-on technical sessions, demonstrated active engagement, and fulfilled all project requirements with highest distinction.',
    issueDate: new Date().toISOString().split('T')[0],
    idPrefix: '',
    customCertificateId: ''
  });

  // Success modal state
  const [generatedCert, setGeneratedCert] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([studentApi.getAllStudents(), eventApi.getAllEvents()])
      .then(([studentsRes, eventsRes]) => {
        if (studentsRes.success && studentsRes.data) {
          setStudents(studentsRes.data);
          if (studentsRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, studentId: studentsRes.data[0].id }));
          }
        }
        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data);
          if (eventsRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, eventId: eventsRes.data[0].id }));
          }
        }
      })
      .catch((err) => {
        showToast('Failed to load students or events list', 'error');
      })
      .finally(() => setLoadingInitial(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.eventId) {
      showToast('Please select a student and an event', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        studentId: Number(formData.studentId),
        eventId: Number(formData.eventId),
        certificateTitle: formData.certificateTitle,
        description: formData.description,
        issueDate: formData.issueDate,
        idPrefix: formData.idPrefix || null,
        customCertificateId: formData.customCertificateId || null
      };

      const res = await certificateApi.generateCertificate(payload);
      if (res.success && res.data) {
        setGeneratedCert(res.data);
        setIsSuccessModalOpen(true);
        showToast('Certificate successfully issued!', 'success');

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#d4af37', '#10b981', '#064e3b', '#ffffff']
        });
      }
    } catch (err) {
      showToast(err.message || 'Error generating certificate', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Find selected student & event for live preview
  const selectedStudent = students.find((s) => String(s.id) === String(formData.studentId));
  const selectedEvent = events.find((e) => String(e.id) === String(formData.eventId));

  return (
    <div style={{ flex: 1, backgroundColor: '#f7faf8', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Navigation back */}
        <div style={{ marginBottom: 20 }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#165b40', fontWeight: 600, fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ color: '#d4af37', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Digital Issuance Desk
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#072418', margin: 0 }}>
            Issue Official Digital Certificate
          </h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>
            Generate a unique certificate record in MySQL, build an OpenPDF certificate document, and embed a scannable ZXing QR code.
          </p>
        </div>

        {loadingInitial ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            Loading student and event data...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: 32
          }}>
            {/* Form Column */}
            <div className="card-white" style={{ padding: 32, border: '1.5px solid #e2e8f0' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Recipient Student *</label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.studentId}) — {s.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Accredited Event *</label>
                  <select
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.eventName} ({e.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    name="certificateTitle"
                    value={formData.certificateTitle}
                    onChange={handleChange}
                    placeholder="e.g. Certificate of Excellence & Completion"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Achievement Description</label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe specific accomplishment or performance grade"
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Date of Issue *</label>
                    <input
                      type="date"
                      required
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Custom ID Prefix (Optional)</label>
                    <input
                      type="text"
                      name="idPrefix"
                      value={formData.idPrefix}
                      onChange={handleChange}
                      placeholder="e.g. AU-WEB or CV-HACK"
                      className="form-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', marginTop: 12 }}
                >
                  <Sparkles size={20} />
                  <span>{submitting ? 'Generating PDF & QR...' : 'Generate & Issue Certificate'}</span>
                </button>
              </form>
            </div>

            {/* Live Visual Preview Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                color: '#165b40',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Live Certificate Preview (Draft)
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: 32,
                border: '6px double #10432f',
                boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  color: '#10432f',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}>
                  CAMPUSVAULT CREDENTIAL REGISTRY
                </div>
                <div style={{ color: '#c59b27', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 16 }}>
                  OFFICIAL DIGITAL RECORD OF ACHIEVEMENT
                </div>

                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10432f', marginBottom: 8 }}>
                  {formData.certificateTitle || 'CERTIFICATE OF EXCELLENCE'}
                </div>

                <div style={{ color: '#64748b', fontSize: '0.825rem', marginBottom: 4 }}>
                  This is proudly presented to certify that
                </div>

                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#072418',
                  fontFamily: 'Outfit, sans-serif',
                  marginBottom: 4
                }}>
                  {selectedStudent ? selectedStudent.fullName : 'Student Name'}
                </div>

                <div style={{ color: '#475569', fontSize: '0.8rem', marginBottom: 12 }}>
                  {selectedStudent ? `${selectedStudent.department} • ${selectedStudent.college}` : 'Department of Computer Science • Apex University'}
                </div>

                <div style={{ color: '#64748b', fontSize: '0.825rem', marginBottom: 4 }}>
                  has actively demonstrated excellence in
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c59b27', marginBottom: 12 }}>
                  {selectedEvent ? selectedEvent.eventName : 'Event Title'}
                </div>

                <p style={{
                  fontSize: '0.8rem',
                  color: '#334155',
                  fontStyle: 'italic',
                  maxWidth: 420,
                  margin: '0 auto 20px',
                  lineHeight: 1.5
                }}>
                  "{formData.description}"
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: 16,
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div>Date: <strong>{formData.issueDate}</strong></div>
                    <div style={{ marginTop: 12, borderTop: '1px solid #94a3b8', width: 100 }}>Dean Records</div>
                  </div>
                  <div>
                    <div style={{
                      width: 50,
                      height: 50,
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 4px',
                      backgroundColor: '#f8fafc'
                    }}>
                      <QrCode size={30} color="#10432f" />
                    </div>
                    <span>Scannable ZXing QR</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#10432f' }}>
                      [ AUTO-GENERATED ID ]
                    </div>
                    <div style={{ marginTop: 12, borderTop: '1px solid #94a3b8', width: 100, marginLeft: 'auto' }}>Exam Director</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal after Certificate Issuance */}
        {generatedCert && (
          <Modal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            title="Certificate Successfully Issued!"
            maxWidth={540}
          >
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                border: '2px solid #86efac',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={36} color="#15803d" />
              </div>

              <h2 style={{ fontSize: '1.4rem', color: '#072418', marginBottom: 6 }}>
                Credential Live on Registry!
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
                Unique Certificate ID has been minted and bound to {generatedCert.studentName}.
              </p>

              {/* ID banner */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: 12,
                padding: '16px',
                marginBottom: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Unique Certificate ID
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#10432f'
                }}>
                  {generatedCert.certificateId}
                </div>
              </div>

              {/* QR Image preview */}
              <div style={{ marginBottom: 24 }}>
                <img
                  src={certificateApi.getQrUrl(generatedCert.certificateId)}
                  alt="Scannable QR"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 10,
                    border: '1.5px solid #e2e8f0',
                    padding: 4,
                    backgroundColor: '#ffffff'
                  }}
                />
                <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 6 }}>
                  Scan with camera to test public verification
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={certificateApi.getDownloadUrl(generatedCert.certificateId)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '12px 20px' }}
                >
                  <Download size={18} />
                  <span>Download PDF Certificate</span>
                </a>

                <Link
                  to={`/verify/${generatedCert.certificateId}`}
                  className="btn btn-secondary"
                  style={{ padding: '12px 20px' }}
                >
                  <ExternalLink size={18} />
                  <span>Open Verification Page</span>
                </Link>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
