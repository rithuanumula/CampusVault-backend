import React, { useState, useEffect } from 'react';
import { eventApi } from '../api/eventApi';
import { Calendar, Award, Building, Search, Tag, ExternalLink } from 'lucide-react';

export const EventsCatalogPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    eventApi.getAllEvents(search)
      .then((res) => {
        if (res.success && res.data) setEvents(res.data);
      })
      .finally(() => setLoading(false));
  }, [search]);

  const filtered = events.filter((e) => categoryFilter === 'ALL' || e.category === categoryFilter);

  return (
    <div style={{ flex: 1, backgroundColor: '#f7faf8', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            <Calendar size={16} /> Official Accreditation Catalog
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#072418', marginBottom: 12 }}>
            Institutional Events & Workshops
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto' }}>
            Browse registered workshops, hackathons, and certifications whose credentials are authentic and verified through CampusVault.
          </p>
        </div>

        {/* Filter */}
        <div className="card-white" style={{ padding: 18, marginBottom: 32, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search event title or organizer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['ALL', 'WORKSHOP', 'HACKATHON', 'INTERNSHIP', 'TECHNICAL', 'CULTURAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: categoryFilter === cat ? '#10432f' : '#ffffff',
                  color: categoryFilter === cat ? '#ffffff' : '#475569',
                  borderColor: categoryFilter === cat ? '#10432f' : '#cbd5e1'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading event directory...</div>
        ) : filtered.length === 0 ? (
          <div className="card-white" style={{ padding: 48, textAlign: 'center' }}>
            <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#334155' }}>No events match your criteria</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
            {filtered.map((evt) => (
              <div key={evt.id} className="card-white" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-category">{evt.category}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#64748b' }}>
                      {evt.eventCode}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#072418', marginBottom: 6 }}>
                    {evt.eventName}
                  </h3>

                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: 16 }}>
                    {evt.description || 'Accredited institutional program.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={15} color="#165b40" />
                      <span>Date: <strong>{evt.eventDate}</strong></span>
                    </div>
                    <div>
                      <span>Organizer: <strong>{evt.organizer}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#165b40', marginTop: 4 }}>
                      <Award size={15} />
                      <span>Total Certificates Issued: <strong>{evt.certificateCount}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
