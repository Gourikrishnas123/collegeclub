import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { activities, calendarEvents } from '../data/mockData';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

export default function ActivitiesTab({ activitySearch, setActivitySearch, activityFilterStatus, setActivityFilterStatus }) {
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = activity.title.toLowerCase().includes(activitySearch.toLowerCase()) || activity.club.toLowerCase().includes(activitySearch.toLowerCase());
      const matchesStatus = activityFilterStatus === 'All' || activity.status === activityFilterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [activitySearch, activityFilterStatus]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <section className="glass-card p-6 shadow-glass relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="section-header row relative z-10">
            <div>
              <p className="section-meta">Events</p>
              <h2 className="section-title">All Campus Activities</h2>
            </div>
            <div className="flex items-center gap-3">
              <input
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder="Search events..."
                className="w-48 rounded-full border border-white/10 bg-slate-950/75 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
              />
              <select
                value={activityFilterStatus}
                onChange={(e) => setActivityFilterStatus(e.target.value)}
                className="rounded-full border border-white/10 bg-slate-950/75 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 cursor-pointer"
              >
                <option>All</option>
                <option>Upcoming</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="section-body mt-6 grid gap-4 sm:grid-cols-2 relative z-10">
            {filteredActivities.map((activity, idx) => (
              <motion.div 
                key={activity.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group rounded-3xl border border-white/5 bg-slate-950/60 p-5 hover:bg-slate-900/80 hover:border-indigo-500/30 transition-all cursor-pointer shadow-glass"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{activity.club}</span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">{activity.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    activity.status === 'Upcoming' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                    activity.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                    activity.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                    'bg-sky-500/10 text-sky-300 border-sky-500/20'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">{activity.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-xl">
                    <Calendar size={16} className="text-indigo-400" /> {activity.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-xl">
                    <Clock size={16} className="text-indigo-400" /> {activity.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-xl col-span-2">
                    <MapPin size={16} className="text-indigo-400" /> {activity.venue}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="glass-card p-6 shadow-glass">
            <div className="section-header row">
              <div>
                <p className="section-meta">Schedule</p>
                <h2 className="section-title">Calendar</h2>
              </div>
            </div>
            <div className="section-body mt-6 space-y-3">
              {calendarEvents.slice(0, 5).map((event, idx) => (
                <motion.div 
                  key={event.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl bg-slate-950/60 p-4 border border-white/5 flex gap-4 items-center hover:bg-slate-900 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex-shrink-0">
                    <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Clock size={12} /> {event.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}
