import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Search,
  Plus,
  Video,
  ExternalLink,
  Bell,
  Sparkles,
  Filter,
  GraduationCap,
  FileCheck2,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

const Header = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedBatchFilter,
    setSelectedBatchFilter,
    liveClasses,
    openModal,
    showToast,
    broadcasts
  } = useAdmin();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const activeLive = liveClasses.find((l) => l.status === 'LIVE NOW');

  return (
    <header className="sticky top-0 z-20 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-md">
      {/* Left: Search & Filter */}
      <div className="flex items-center space-x-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, students, books, test series..."
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Batch Filter Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          {['All', 'Class 12', 'Class 11'].map((batch) => (
            <button
              key={batch}
              onClick={() => setSelectedBatchFilter(batch)}
              className={`px-3 py-1 font-bold rounded-lg transition ${
                selectedBatchFilter === batch
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {batch}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Quick Actions & Live Indicator & Portal Link */}
      <div className="flex items-center space-x-3">
        {/* Live Studio Indicator widget */}
        {activeLive ? (
          <button
            onClick={() => openModal('liveClass', activeLive)}
            className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold hover:bg-rose-500/20 transition"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>LIVE NOW: {activeLive.currentViewers} Viewers</span>
          </button>
        ) : (
          <button
            onClick={() => openModal('liveClass')}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-300 font-semibold hover:text-white transition"
          >
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>Schedule Live Studio</span>
          </button>
        )}

        {/* Quick Action Dropdown Trigger */}
        <div
          className="relative"
          onMouseEnter={() => setShowQuickCreate(true)}
          onMouseLeave={() => setShowQuickCreate(false)}
        >
          <button
            onClick={() => setShowQuickCreate(!showQuickCreate)}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Create</span>
          </button>

          {showQuickCreate && (
            <div className="absolute right-0 top-full pt-1.5 w-56 z-50">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1">
                <button
                  onClick={() => {
                    openModal('course');
                    setShowQuickCreate(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition text-left"
                >
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>Add New Course</span>
                </button>
                <button
                  onClick={() => {
                    openModal('liveClass');
                    setShowQuickCreate(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition text-left"
                >
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Schedule Live Class</span>
                </button>
                <button
                  onClick={() => {
                    openModal('testBuilder');
                    setShowQuickCreate(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition text-left"
                >
                  <FileCheck2 className="w-4 h-4 text-purple-400" />
                  <span>Publish NTA Mock Test</span>
                </button>
                <button
                  onClick={() => {
                    openModal('book');
                    setShowQuickCreate(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition text-left"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Add Book to Store</span>
                </button>
                <button
                  onClick={() => {
                    openModal('broadcast');
                    setShowQuickCreate(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition text-left"
                >
                  <Bell className="w-4 h-4 text-rose-400" />
                  <span>Send Push Notification</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition relative"
            title="Recent Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-extrabold text-white">Recent System Alerts</h4>
                <span className="text-[10px] text-blue-400 font-bold">{broadcasts.length} Sent</span>
              </div>
              <div className="space-y-3 mt-3 max-h-64 overflow-y-auto">
                {broadcasts.map((bc) => (
                  <div key={bc.id} className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1 text-xs">
                    <p className="font-bold text-white leading-snug">{bc.title}</p>
                    <p className="text-[11px] text-slate-400">{bc.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{bc.sentDate}</span>
                      <span className="text-emerald-400 font-semibold">{bc.readRate} Read</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Portal External Link */}
        <a
          href="https://success-mantra-theta.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl transition flex items-center space-x-1.5 text-xs font-semibold"
          title="Open Live Student Portal"
        >
          <span>Live Web Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
};

export default Header;
