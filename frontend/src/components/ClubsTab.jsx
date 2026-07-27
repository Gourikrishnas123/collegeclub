import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { executiveCommittee, userRoles, studentActions, adminActions } from '../data/mockData';

export default function ClubsTab() {
  const [systemStatus, setSystemStatus] = useState('Checking...');

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        if (data.dbConnected) {
          setSystemStatus('Online & Connected');
        } else {
          setSystemStatus('Online (DB Error)');
        }
      })
      .catch(() => {
        setSystemStatus('Offline');
      });
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="glass-card p-6 shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="section-header row relative z-10">
          <div>
            <p className="section-meta">Leadership</p>
            <h2 className="section-title">Executive Committee</h2>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">Manage Committee</motion.button>
        </div>

        <div className="section-body mt-6 overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-4 font-bold rounded-tl-2xl">Member</th>
                <th className="px-4 py-4 font-bold">Position</th>
                <th className="px-4 py-4 font-bold">Club</th>
                <th className="px-4 py-4 font-bold rounded-tr-2xl text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {executiveCommittee.map((member, idx) => (
                <motion.tr 
                  key={member.studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-slate-900/60 transition-colors"
                >
                  <td className="px-4 py-4">
                    <p className="font-bold text-white">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.department} • {member.email}</p>
                  </td>
                  <td className="px-4 py-4 font-medium">{member.position}</td>
                  <td className="px-4 py-4 font-medium text-sky-300">{member.club}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                      member.status === 'Active' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-card p-6 shadow-glass">
        <div className="section-header row">
          <div>
            <p className="section-meta">Role-Based Dashboard</p>
            <h2 className="section-title">Admin and student workflows</h2>
          </div>
        </div>
        <div className="section-body mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/5 bg-slate-950/60 p-5 shadow-glass transition-all hover:border-sky-500/30">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-bold">User Roles</p>
            <p className="mt-4 text-3xl font-bold text-white">{userRoles.length}</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/5 bg-slate-950/60 p-5 shadow-glass transition-all hover:border-indigo-500/30">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-bold">Student Tools</p>
            <p className="mt-4 text-sm font-medium text-slate-200 leading-relaxed">{studentActions.join(' • ')}</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/5 bg-slate-950/60 p-5 shadow-glass transition-all hover:border-fuchsia-500/30">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-bold">Admin Tools</p>
            <p className="mt-4 text-sm font-medium text-slate-200 leading-relaxed">{adminActions.join(' • ')}</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/5 bg-slate-950/60 p-5 shadow-glass transition-all hover:border-emerald-500/30">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-bold">System Status</p>
            <p className={`mt-4 text-2xl font-bold ${systemStatus.includes('Online') ? 'text-emerald-400' : systemStatus === 'Checking...' ? 'text-sky-400' : 'text-rose-400'}`}>
              {systemStatus}
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
