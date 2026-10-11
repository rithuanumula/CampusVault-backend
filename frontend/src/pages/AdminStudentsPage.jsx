import React, { useState, useEffect } from 'react';
import { studentApi } from '../api/studentApi';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Users, Plus, Edit2, Search, Award, Mail, Building, GraduationCap, CheckCircle2 } from 'lucide-react';

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    college: 'Apex University Institute of Technology',
    department: 'Computer Science and Engineering',
    academicYear: '4th Year (2023-2027)',
    password: 'Student@123',
    status: 'ACTIVE'
  });
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getAllStudents(search);
      if (res.success && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentStudentId(null);
    setFormData({
      fullName: '',
      email: '',
      studentId: '',
      college: 'Apex University Institute of Technology',
      department: 'Computer Science and Engineering',
      academicYear: '4th Year (2023-2027)',
      password: 'Student@123',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student.id);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      studentId: student.studentId,
      college: student.college,
      department: student.department,
      academicYear: student.academicYear,
      password: '',
      status: student.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await studentApi.updateStudent(currentStudentId, formData);
        showToast('Student profile updated', 'success');
      } else {
        await studentApi.createStudent(formData);
        showToast('Student enrolled and account provisioned', 'success');
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      showToast(err.message || 'Error processing student record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#f0f7ff', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#082f49', marginBottom: 6 }}>
              Student Management
            </h1>
            <p style={{ color: '#64748b' }}>
              Maintain student enrollment rosters, user accounts, and credential records.
            </p>
          </div>

          <button onClick={openCreateModal} className="btn btn-primary" style={{ padding: '12px 20px' }}>
            <Plus size={18} /> Register Student
          </button>
        </div>

        {/* Search Bar */}
        <div className="card-white" style={{ padding: 18, marginBottom: 24, border: '1.5px solid #bae6fd' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#0284c7" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name, roll number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="card-white" style={{ overflow: 'hidden', border: '1.5px solid #bae6fd' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading students...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Users size={48} color="#bae6fd" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#334155', marginBottom: 8 }}>No students found</h3>
              <p style={{ color: '#64748b' }}>Add students using the "Register Student" button above.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f9ff', borderBottom: '1px solid #bae6fd', color: '#0369a1', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 20px' }}>Roll / ID</th>
                    <th style={{ padding: '14px 20px' }}>Full Name</th>
                    <th style={{ padding: '14px 20px' }}>Department</th>
                    <th style={{ padding: '14px 20px' }}>Academic Year</th>
                    <th style={{ padding: '14px 20px' }}>Certificates</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#082f49' }}>
                        {student.studentId}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#082f49' }}>{student.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{student.email}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#334155' }}>
                        <div>{student.department}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.college}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>
                        {student.academicYear}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 6,
                          backgroundColor: student.certificateCount > 0 ? '#e0f2fe' : '#f1f5f9',
                          color: student.certificateCount > 0 ? '#0284c7' : '#64748b',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}>
                          <Award size={13} /> {student.certificateCount}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${student.status === 'ACTIVE' ? 'badge-verified' : 'badge-invalid'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => openEditModal(student)}
                          className="btn btn-secondary btn-sm"
                          style={{ border: '1px solid #bae6fd' }}
                        >
                          <Edit2 size={13} color="#0284c7" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Registering/Editing Student */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditing ? 'Edit Student Details' : 'Register New Student'}
          maxWidth={600}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. A Rithika Reddy"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@campusvault.edu"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student ID / Roll No</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g. AU-2026-00421"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Department / Branch *</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">College / Institute *</label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year *</label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="e.g. 4th Year (2023-2027)"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isEditing ? 'New Password (Optional)' : 'Password *'}</label>
                <input
                  type="password"
                  required={!isEditing}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEditing ? 'Leave blank to preserve' : 'Default: Student@123'}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Saving...' : isEditing ? 'Update Student' : 'Save & Provision Account'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
