import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { API_URL } from '../config';

export default function NewEventModal({ isOpen, onClose, onCreated }) {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ title: '', club: '', date: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/api/clubs`)
        .then((res) => res.json())
        .then(setClubs)
        .catch(() => setClubs([]));
    }
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create event');
      const created = await res.json();
      onCreated?.(created);
      setForm({ title: '', club: '', date: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Event Title</label>
          <input
            required
            value={form.title}
            onChange={handleChange('title')}
            placeholder="e.g. Annual Chess Tournament"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Club</label>
          <select
            required
            value={form.club}
            onChange={handleChange('club')}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 cursor-pointer"
          >
            <option value="">Select a club</option>
            {clubs.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
          <input
            required
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            rows={3}
            placeholder="Optional details..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40 disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </Modal>
  );
}