import React, { useState } from 'react';
import Button from '../common/Button';

const PostNoticeForm = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('General');
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tags = ['Urgent', 'Events', 'Finance', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      setError('Title and notice content are required.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await onSubmit({ title, body, tag, pinned });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error posting notice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>POST ANNOUNCEMENT</h3>

        {error && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(255, 92, 77, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            fontSize: '11px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mandatory General Body Meeting"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Tag Category</label>
              <select
                className="form-select"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                {tags.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Pin to Top</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                />
                PIN THIS NOTICE TO TOP
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notice Details</label>
            <textarea
              className="form-textarea"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the details of your announcement here..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <Button variant="secondary" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'POSTING...' : 'PUBLISH NOTICE'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostNoticeForm;
