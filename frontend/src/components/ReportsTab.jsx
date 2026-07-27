import React from 'react';
import { motion } from 'framer-motion';
import { reportCards, budgetRequests } from '../data/mockData';
import { Download, PieChart, TrendingUp, DollarSign } from 'lucide-react';

export default function ReportsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="glass-card p-6 shadow-glass relative overflow-hidden">
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="section-header row relative z-10">
          <div>
            <p className="section-meta">Analytics</p>
            <h2 className="section-title">Performance Reports</h2>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20">
            <Download size={16} /> Export PDF
          </motion.button>
        </div>

        <div className="section-body mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 relative z-10">
          {reportCards.map((card, idx) => (
            <motion.div 
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-3xl border border-white/5 bg-slate-950/60 p-6 shadow-glass hover:bg-slate-900/80 transition-all hover:border-fuchsia-500/30"
            >
              <div className="flex items-center gap-3 text-slate-400 group-hover:text-fuchsia-300 transition-colors">
                {idx % 2 === 0 ? <PieChart size={20} /> : <TrendingUp size={20} />}
                <p className="text-sm uppercase tracking-[0.24em] font-bold">{card.label}</p>
              </div>
              <p className="mt-4 text-4xl font-bold text-white">{card.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="glass-card p-6 shadow-glass relative overflow-hidden">
        <div className="section-header row relative z-10">
          <div>
            <p className="section-meta">Finances</p>
            <h2 className="section-title">Budget Requests</h2>
          </div>
        </div>

        <div className="section-body mt-6 overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-4 font-bold rounded-tl-2xl">Club</th>
                <th className="px-4 py-4 font-bold">Type</th>
                <th className="px-4 py-4 font-bold">Amount</th>
                <th className="px-4 py-4 font-bold rounded-tr-2xl text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {budgetRequests.map((request, idx) => (
                <motion.tr 
                  key={`${request.club}-${request.amount}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-slate-900/60 transition-colors"
                >
                  <td className="px-4 py-4 font-bold text-white">{request.club}</td>
                  <td className="px-4 py-4 font-medium text-slate-400">{request.type}</td>
                  <td className="px-4 py-4 font-bold text-emerald-400 flex items-center gap-1">
                    <DollarSign size={14} /> {request.amount.replace('₹', '')}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold border ${
                      request.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 
                      request.status === 'Pending' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 
                      'bg-sky-500/10 text-sky-300 border-sky-500/20'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
}
