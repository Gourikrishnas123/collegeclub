import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardTab from './components/DashboardTab';
import ClubsTab from './components/ClubsTab';
import ActivitiesTab from './components/ActivitiesTab';
import ReportsTab from './components/ReportsTab';
import { clubs, notifications } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Dashboard state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Points');
  
  // Activities state
  const [activitySearch, setActivitySearch] = useState('');
  const [activityFilterStatus, setActivityFilterStatus] = useState('All');

  const filteredClubs = useMemo(() => {
    return clubs
      .filter((club) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = club.name.toLowerCase().includes(query) || club.category.toLowerCase().includes(query) || club.coordinator.toLowerCase().includes(query);
        const matchesCategory = filterCategory === 'All' || club.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'Points') return b.points - a.points;
        if (sortBy === 'Events') return b.events - a.events;
        if (sortBy === 'Attendance') return b.attendance - a.attendance;
        if (sortBy === 'Members') return b.members - a.members;
        return 0;
      });
  }, [searchQuery, filterCategory, sortBy]);

  const tabs = ['Dashboard', 'Clubs & Members', 'Activities', 'Reports'];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-['Outfit',sans-serif] selection:bg-sky-500/30">
      <div className="dashboard-shell space-y-8">
        
        {/* Header Navigation */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-card z-30 border-white/10 bg-slate-950/80 p-4 shadow-glass backdrop-blur-2xl sticky top-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-500 text-xl font-bold text-white shadow-lg shadow-sky-500/20">CC</div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400">Club HQ</p>
                <h2 className="truncate text-xl font-bold text-white">College Club Control Center</h2>
              </div>
            </div>
            
            <div className="flex p-1 rounded-full bg-slate-900/80 border border-white/5 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2.5 text-sm font-bold transition-colors z-10 ${
                    activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <main className="min-h-[600px] relative">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && (
              <DashboardTab 
                key="Dashboard"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                notifications={notifications}
                filteredClubs={filteredClubs}
              />
            )}
            
            {activeTab === 'Clubs & Members' && (
              <ClubsTab key="Clubs" />
            )}
            
            {activeTab === 'Activities' && (
              <ActivitiesTab 
                key="Activities"
                activitySearch={activitySearch}
                setActivitySearch={setActivitySearch}
                activityFilterStatus={activityFilterStatus}
                setActivityFilterStatus={setActivityFilterStatus}
              />
            )}
            
            {activeTab === 'Reports' && (
              <ReportsTab key="Reports" />
            )}
          </AnimatePresence>
        </main>

        <footer className="glass-card p-6 shadow-glass border-white/5 mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-400">Built for student clubs — all activity data, budget tracking, and event planning in one place.</p>
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">© 2026 College Club HQ</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
