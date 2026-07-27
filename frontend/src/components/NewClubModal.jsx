import React, { useState } from 'react';
import Modal from './Modal';
import { API_URL } from '../config';

export default function NewClubModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    category: 'STEM',
    logo: '🏛️',
    points: 0,
    events: 0,
    attendance: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create club');
      const created = await res.json();
      onCreated?.(created);
      setForm({ name: '', category: 'STEM', logo: '🏛️', points: 0, events: 0, attendance: 0 });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Club">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Club Name</label>
          <input
            required
            value={form.name}
            onChange={handleChange('name')}
            placeholder="e.g. Chess Club"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
          <select
            value={form.category}
            onChange={handleChange('category')}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 cursor-pointer"
          >
            <option>Language</option>
            <option>Arts</option>
            <option>STEM</option>
            <option>Science</option>
            <option>Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Logo (emoji)</label>
          <input
            value={form.logo}
            onChange={handleChange('logo')}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Points</label>
            <input
              type="number"
              value={form.points}
              onChange={handleChange('points')}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Events</label>
            <input
              type="number"
              value={form.events}
              onChange={handleChange('events')}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Attendance %</label>
            <input
              type="number"
              value={form.attendance}
              onChange={handleChange('attendance')}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40 disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Club'}
        </button>
      </form>
    </Modal>
  );
}