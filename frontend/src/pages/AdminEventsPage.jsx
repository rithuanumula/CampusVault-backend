import React, { useState, useEffect } from 'react';
import { eventApi } from '../api/eventApi';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Calendar, Plus, Edit2, Trash2, Search, Award, CheckCircle2, Clock } from 'lucide-react';

export const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    category: 'WORKSHOP',
    eventDate: new Date().toISOString().split('T')[0],
    organizer: 'School of Computing & Department of CSE',
    description: '',
    status: 'ACTIVE'
  });
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventApi.getAllEvents(search);
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search]);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentEventId(null);
    setFormData({
      eventName: '',
      category: 'WORKSHOP',
      eventDate: new Date().toISOString().split('T')[0],
      organizer: 'School of Computing & Department of CSE',
      description: '',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setIsEditing(true);
    setCurrentEventId(event.id);
    setFormData({
      eventName: event.eventName,
      category: event.category,
      eventDate: event.eventDate,
      organizer: event.organizer,
      description: event.description || '',
      status: event.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await eventApi.updateEvent(currentEventId, formData);
        showToast('Event updated successfully', 'success');
      } else {
        await eventApi.createEvent(formData);
        showToast('Event created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Error saving event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name, certCount) => {
    if (certCount > 0) {
      showToast(`Cannot delete "${name}" because ${certCount} issued certificate(s) depend on it. Please update status instead.`, 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete event "${name}"?`)) {
      try {
        await eventApi.deleteEvent(id);
        showToast('Event deleted successfully', 'success');
        fetchEvents();
      } catch (err) {
        showToast(err.message || 'Failed to delete event', 'error');
      }
    }
  };

  const filteredEvents = events.filter((e) =>
    selectedCategory === 'ALL' || e.category === selectedCategory
  );

  return (
    <div style={{ flex: 1, backgroundColor: '#f7faf8', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Page Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#072418', marginBottom: 6 }}>
              Event Management
            </h1>
            <p style={{ color: '#64748b' }}>
              Create and manage institutional events, workshops, hackathons, and certifications.
            </p>
          </div>

          <button onClick={openCreateModal} className="btn btn-primary" style={{ padding: '12px 20px' }}>
            <Plus size={18} /> Add New Event
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="card-white" style={{ padding: 18, marginBottom: 28, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search events by title or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['ALL', 'WORKSHOP', 'HACKATHON', 'INTERNSHIP', 'TECHNICAL', 'CULTURAL', 'SEMINAR'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: selectedCategory === cat ? '#10432f' : '#ffffff',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  borderColor: selectedCategory === cat ? '#10432f' : '#cbd5e1'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="card-white" style={{ padding: 48, textAlign: 'center' }}>
            <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#334155', marginBottom: 8 }}>No events found</h3>
            <p style={{ color: '#64748b' }}>Create a new event using the button above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="card-white"
                style={{
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1.5px solid #e2e8f0'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-category">{event.category}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                      {event.eventCode}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#072418', marginBottom: 6 }}>
                    {event.eventName}
                  </h3>

                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: 16 }}>
                    {event.description || 'No description provided.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: '#475569', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={15} color="#165b40" />
                      <span>Date: <strong>{event.eventDate}</strong></span>
                    </div>
                    <div>
                      <span>Organizer: <strong>{event.organizer}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#165b40' }}>
                      <Award size={15} />
                      <span>Issued Certificates: <strong>{event.certificateCount}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => openEditModal(event)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.eventName, event.certificateCount)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#dc2626' }}
                    title={event.certificateCount > 0 ? "Cannot delete event with issued certificates" : "Delete event"}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditing ? 'Edit Event Details' : 'Create New Event'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input
                type="text"
                required
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                placeholder="e.g. React & Full-Stack Cloud Architecture Workshop"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                >
                  <option value="WORKSHOP">WORKSHOP</option>
                  <option value="HACKATHON">HACKATHON</option>
                  <option value="INTERNSHIP">INTERNSHIP</option>
                  <option value="TECHNICAL">TECHNICAL</option>
                  <option value="CULTURAL">CULTURAL</option>
                  <option value="CLUB_ACTIVITY">CLUB_ACTIVITY</option>
                  <option value="SEMINAR">SEMINAR</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Organizer / Department *</label>
              <input
                type="text"
                required
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="e.g. School of Computing & Department of CSE"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of event learning outcomes, syllabus, or awards"
                className="form-textarea"
              />
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
                {submitting ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
