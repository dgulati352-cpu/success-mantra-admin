import React from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  LayoutDashboard,
  GraduationCap,
  Video,
  FileCheck2,
  ShoppingBag,
  Crown,
  Users,
  Bell,
  Settings,
  Sparkles,
  BookOpen,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { activeTab, setActiveTab, liveClasses, orders, courses, tests } = useAdmin();

  const activeLiveCount = liveClasses.filter((l) => l.status === 'LIVE NOW').length;
  const pendingOrdersCount = orders.filter((o) => o.shippingStatus === 'Pending' || o.shippingStatus === 'Processing').length;

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'courses', label: 'Courses & Chapters', icon: GraduationCap, badge: courses.length },
    { id: 'liveStudio', label: 'Live Studio & Doubts', icon: Video, badge: activeLiveCount > 0 ? 'LIVE' : null, badgeColor: 'bg-rose-500 text-white animate-pulse' },
    { id: 'mockTests', label: 'NTA CBT Test Engine', icon: FileCheck2, badge: tests.length },
    { id: 'bookstore', label: 'Official Bookstore', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Orders` : null, badgeColor: 'bg-amber-500 text-slate-950 font-extrabold' },
    { id: 'vipMembership', label: 'VIP Memberships', icon: Crown, badge: 'PRO', badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black' },
    { id: 'students', label: 'Student Directory', icon: Users, badge: null },
    { id: 'broadcast', label: 'Push Broadcasts', icon: Bell, badge: null },
    { id: 'settings', label: 'Platform Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 select-none backdrop-blur-xl">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-600/30 ring-2 ring-white/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight leading-none">
                  Success Mantra
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1 font-medium truncate max-w-[160px]">
                Class 11 & 12 • Commerce
              </span>
            </div>
          </div>

          {/* Session Banner Badge */}
          <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-bold text-[11px]">Session 2026-27</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-semibold rounded border border-emerald-500/30">
              CBSE & CUET
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-500 tracking-wider">
            Management Console
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Faculty Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Admin Avatar"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <p className="text-xs font-black text-white leading-tight">Dhairya Gulati</p>
              <p className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Chief Admin
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Settings"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
