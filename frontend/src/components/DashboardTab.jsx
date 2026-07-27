import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardStats, chartStats } from '../data/mockData';
import NewClubModal from './NewClubModal';
import NewEventModal from './NewEventModal';

export default function DashboardTab({ searchQuery, setSearchQuery, filterCategory, setFilterCategory, sortBy, setSortBy, notifications, filteredClubs }) {
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="glass-card p-6 shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80 font-bold">College Club Management</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Professional club operations in a modern premium dashboard</h1>
            <p className="mt-4 max-w-2xl text-slate-300 text-lg">Monitor club performance, manage events, track finances, and keep every campus collaboration aligned in one beautifully designed interface.</p>
          </div>
          <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
            <motion.button
              onClick={() => setIsEventModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40"
            >
              Create Event
            </motion.button>
            <motion.button
              onClick={() => setIsClubModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400/40 hover:bg-slate-900/90 backdrop-blur-md"
            >
              New Club
            </motion.button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 relative z-10">
          {dashboardStats.slice(0, 4).map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 shadow-glass transition-all hover:border-sky-500/30 hover:bg-slate-900/80"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400 group-hover:text-sky-300 transition-colors">{item.label}</p>
              <p className="mt-4 text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.95fr]">
        <section className="space-y-6">
          <div className="glass-card p-6 shadow-glass hover:shadow-sky-500/5 transition-shadow">
            <div className="section-header row">
              <div>
                <p className="section-meta">Performance</p>
                <h2 className="section-title">Engagement & attendance</h2>
              </div>
              <span className="glass-pill bg-sky-500/10 text-sky-300 border border-sky-500/20">Campus activity insights</span>
            </div>

            <div className="section-body grid gap-5 xl:grid-cols-2">
              <div className="rounded-[2rem] bg-slate-950/60 border border-white/5 p-6 hover:bg-slate-900/60 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Monthly events</p>
                    <p className="mt-3 text-3xl font-bold text-white">18 events</p>
                  </div>
                  <span className="rounded-2xl bg-sky-500/15 border border-sky-500/20 px-3 py-1 text-sm font-semibold text-sky-300">+12.5%</span>
                </div>
                <div className="mt-6 space-y-4">
                  {chartStats.monthlyEvents.map((value, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm text-slate-400 font-medium">
                        <span>Week {index + 1}</span>
                        <span className="text-slate-200">{value}</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-900/80 border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(value / 18) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-slate-950/60 border border-white/5 p-6 hover:bg-slate-900/60 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Average attendance</p>
                    <p className="mt-3 text-3xl font-bold text-white">89%</p>
                  </div>
                  <span className="rounded-2xl bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300">Stable</span>
                </div>
                <div className="mt-6 space-y-4">
                  {chartStats.attendance.map((value, index) => (
                    <div key={index} className="grid gap-2 sm:grid-cols-[1fr_auto] border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <p className="text-sm text-slate-400 font-medium">Session {index + 1}</p>
                      <p className="text-sm font-bold text-white">{value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 shadow-glass">
            <div className="section-header row">
              <div>
                <p className="section-meta">Club Performance</p>
                <h2 className="section-title">Top clubs this season</h2>
              </div>
              <span className="glass-pill border border-white/10">Sorted by {sortBy?.toLowerCase()}</span>
            </div>

            <div className="section-body mt-6 grid gap-4 sm:grid-cols-2">
              {filteredClubs.slice(0, 4).map((club, i) => (
                <motion.div 
                  key={club.name} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 hover:border-sky-500/30 transition-all cursor-pointer hover:bg-slate-900/80"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${club.color} text-sm font-bold text-white shadow-lg`}>{club.logo}</div>
                      <div>
                        <p className="font-bold text-white group-hover:text-sky-300 transition-colors">{club.name}</p>
                        <p className="text-sm text-slate-400 font-medium">{club.category}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-sky-300 font-bold">{club.points} pts</span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-900/50 border border-white/5 p-3 text-sm text-slate-400 text-center">
                      Members
                      <p className="mt-1 text-lg font-bold text-white">{club.members}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900/50 border border-white/5 p-3 text-sm text-slate-400 text-center">
                      Events
                      <p className="mt-1 text-lg font-bold text-white">{club.events}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900/50 border border-white/5 p-3 text-sm text-slate-400 text-center">
                      Attendance
                      <p className="mt-1 text-lg font-bold text-white">{club.attendance}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-card p-6 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
            <div className="section-header row relative z-10">
              <div>
                <p className="section-meta">Search & filter</p>
                <h2 className="section-title">Explore club data</h2>
              </div>
            </div>

            <div className="section-body mt-6 space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search clubs</label>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, category..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 focus:bg-slate-900/90"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Category</span>
                  <select
                    value={filterCategory}
                    onChange={(event) => setFilterCategory(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 cursor-pointer"
                  >
                    <option>All</option>
                    <option>Language</option>
                    <option>Arts</option>
                    <option>STEM</option>
                    <option>Science</option>
                    <option>Technology</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 cursor-pointer"
                  >
                    <option>Points</option>
                    <option>Events</option>
                    <option>Attendance</option>
                    <option>Members</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 shadow-glass">
            <div className="section-header row">
              <div>
                <p className="section-meta">Notifications</p>
                <h2 className="section-title">Action required</h2>
              </div>
              <span className="glass-pill bg-rose-500/10 text-rose-300 border border-rose-500/20">{notifications.length} alerts</span>
            </div>

            <div className="section-body mt-6 space-y-3">
              {notifications.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.title} 
                  className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 transition-all hover:border-sky-400/40 hover:bg-slate-900 cursor-pointer group"
                >
                  <p className="font-bold text-white group-hover:text-sky-300 transition-colors">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400 font-medium">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <NewClubModal
        isOpen={isClubModalOpen}
        onClose={() => setIsClubModalOpen(false)}
        onCreated={(club) => console.log('Club created:', club)}
      />
      <NewEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onCreated={(event) => console.log('Event created:', event)}
      />
    </motion.div>
  );
}