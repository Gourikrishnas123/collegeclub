import React, { useState } from 'react';
import Button from '../common/Button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const UploadDropzone = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (files) => {
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileList.length + selectedFiles.length > 20) {
      setError('Maximum 20 images per upload event allowed.');
      return;
    }
    setError('');

    const newFiles = [...selectedFiles, ...fileList];
    setSelectedFiles(newFiles);

    const newPreviews = fileList.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setCaptions(prev => [...prev, ...new Array(fileList.length).fill('')]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newCaptions = captions.filter((_, i) => i !== index);

    // revoke object URL
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    setCaptions(newCaptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Event title is required.');
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Please select at least one image to upload.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      captions.forEach((cap) => {
        formData.append('captions', cap || '');
      });

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading gallery event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>UPLOAD GALLERY EVENT</h3>

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
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Hackathon 2026"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Short Description</label>
              <input
                type="text"
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of event..."
              />
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: '2px dashed var(--line-strong)',
              backgroundColor: 'var(--bg)',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
            onClick={() => document.getElementById('file-upload-input').click()}
          >
            <Upload size={24} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>
              DRAG & DROP IMAGES HERE OR CLICK TO BROWSE
            </div>
            <div style={{ fontSize: '10px', color: 'var(--fg-dim)', marginTop: '4px' }}>
              PNG, JPG, WEBP UP TO 10MB (MAX 20 IMAGES)
            </div>
            <input
              id="file-upload-input"
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Image Previews Grid */}
          {previews.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '10px',
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid var(--line)',
              marginBottom: '16px'
            }}>
              {previews.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', border: '1px solid var(--line-strong)' }}>
                  <img
                    src={src}
                    alt={`Preview ${idx}`}
                    style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: 'var(--danger)',
                      color: 'var(--bg)',
                      border: 'none',
                      padding: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={12} />
                  </button>
                  <input
                    type="text"
                    placeholder="Caption"
                    value={captions[idx] || ''}
                    onChange={(e) => {
                      const updated = [...captions];
                      updated[idx] = e.target.value;
                      setCaptions(updated);
                    }}
                    style={{
                      width: '100%',
                      fontSize: '9px',
                      padding: '2px 4px',
                      backgroundColor: 'var(--panel)',
                      color: 'var(--fg)',
                      border: 'none',
                      borderTop: '1px solid var(--line)'
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="secondary" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary" disabled={loading || selectedFiles.length === 0}>
              {loading ? 'UPLOADING...' : `SUBMIT EVENT (${selectedFiles.length} IMAGES)`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDropzone;
