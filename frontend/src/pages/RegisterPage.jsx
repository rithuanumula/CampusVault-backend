import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, UserPlus, Mail, Lock, Building, GraduationCap, Calendar, User } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: '',
    college: 'Apex University Institute of Technology',
    department: 'Computer Science and Engineering',
    academicYear: '4th Year (2023-2027)'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const user = await register(formData);
      showToast('Registration successful! Welcome to CampusVault.', 'success');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      backgroundColor: '#f0f7ff'
    }}>
      <div style={{
        maxWidth: 580,
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        border: '1.5px solid #bae6fd',
        boxShadow: '0 20px 40px -15px rgba(14, 165, 233, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          padding: '28px 32px',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.45rem', marginBottom: 6 }}>
            Student Account Registration
          </h2>
          <p style={{ color: '#e0f2fe', fontSize: '0.85rem' }}>
            Register to access and download your verified institutional certificates
          </p>
        </div>

        <div style={{ padding: 32 }}>
          {errorMsg && (
            <div style={{
              padding: 12,
              backgroundColor: '#fee2e2',
              borderRadius: 8,
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '0.85rem',
              marginBottom: 20
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. A Rithika Reddy"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student ID / Roll No *</label>
                <input
                  type="text"
                  required
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. 21BCE0421"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@campusvault.edu"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">College / Institution *</label>
                <input
                  type="text"
                  required
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  required
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="e.g. 4th Year (2023-2027)"
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 24, padding: '12px 20px', fontSize: '1rem' }}
            >
              {loading ? 'Registering Account...' : 'Create Student Account'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#0284c7', fontWeight: 700 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
