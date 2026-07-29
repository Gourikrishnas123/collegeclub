import React, { useState } from 'react';
import Button from '../common/Button';

const AddTransactionForm = ({ onSubmit, onClose }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Events');
  const [type, setType] = useState('out');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Events', 'Equipment', 'Sponsorship', 'Dues', 'Venue', 'Supplies', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      setError('Description and amount are required.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await onSubmit({
        description,
        category,
        type,
        amount: Number(amount),
        date
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>RECORD TRANSACTION</h3>

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
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Venue deposit for Hackathon"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="out">DEBIT (Out / Expense)</option>
                <option value="in">CREDIT (In / Revenue)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <Button variant="secondary" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'SAVING...' : 'SAVE TRANSACTION'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;
