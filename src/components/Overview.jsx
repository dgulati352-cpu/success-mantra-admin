import React from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  TrendingUp,
  Users,
  Crown,
  Video,
  ShoppingBag,
  Award,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Send,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Overview = () => {
  const {
    stats,
    courses,
    liveClasses,
    orders,
    students,
    openModal,
    setActiveTab
  } = useAdmin();

  // Chart Mock Data
  const revenueData = [
    { month: 'Jan', revenue: 95000, students: 2800 },
    { month: 'Feb', revenue: 110000, students: 3200 },
    { month: 'Mar', revenue: 145000, students: 4100 },
    { month: 'Apr', revenue: 180000, students: 5400 },
    { month: 'May', revenue: 210000, students: 6800 },
    { month: 'Jun', revenue: 235000, students: 8200 },
    { month: 'Jul', revenue: 260000, students: 10400 },
    { month: 'Aug', revenue: 245000, students: 12450 },
  ];

  const subjectEnrollmentData = [
    { subject: 'Accountancy', count: 18400, color: '#3b82f6' },
    { subject: 'Economics', count: 16200, color: '#10b981' },
    { subject: 'Business St.', count: 14800, color: '#6366f1' },
    { subject: 'Entrepreneur', count: 9800, color: '#a855f7' },
  ];

  const activeLive = liveClasses.find((l) => l.status === 'LIVE NOW');
  const pendingOrders = orders.filter((o) => o.shippingStatus === 'Pending' || o.shippingStatus === 'Processing').slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Announcement */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Session 2026-27 CBSE & CUET Platform Active
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/30">
                100% CBSE Pattern
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Success Mantra Admin Control Center 🎓
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage Class 11 & 12 Commerce (Without Maths) curriculum, Live Studio 2-Teacher doubt streams, NTA CBT Mock Test series, and Official T.S. Grewal bookstore.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openModal('course')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </button>
            <button
              onClick={() => openModal('liveClass')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center space-x-2 transition"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Live Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Key Performance Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-blue-500/50 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Platform Revenue</span>
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.8% from last month</span>
            </div>
          </div>
        </div>

        {/* Active Enrolled Students */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-emerald-500/50 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Enrolled Students</span>
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{stats.totalStudents.toLocaleString('en-IN')}+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              Class 12: <span className="text-white font-bold">{stats.activeStudentsClass12.toLocaleString()}</span> • Class 11: <span className="text-white font-bold">{stats.activeStudentsClass11.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* VIP Memberships */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-amber-500/50 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">VIP Members</span>
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-400">{stats.vipMembers.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              Pass Rate: <span className="text-emerald-400 font-bold">{stats.boardPassRate}% CBSE Success</span>
            </div>
          </div>
        </div>

        {/* Pending Book Orders */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-rose-500/50 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Bookstore Orders</span>
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{orders.filter(o => o.shippingStatus === 'Pending' || o.shippingStatus === 'Processing').length} Orders</div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              T.S. Grewal & Sandeep Garg Shipments
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Growth Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Monthly Platform Revenue Growth</h3>
              <p className="text-xs text-slate-400">VIP Subscription Sales & Bookstore Revenue (2026)</p>
            </div>
            <div className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs font-bold rounded-lg border border-blue-500/20">
              ₹2.45L Aug Forecast
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown Bar Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Subject Enrollments</h3>
              <p className="text-xs text-slate-400">Class 11 & 12 Non-Maths Breakdown</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectEnrollmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val/1000}k`} />
                <YAxis dataKey="subject" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value) => [`${value.toLocaleString()} Students`, 'Enrollments']}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {subjectEnrollmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Studio & Pending Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Studio Active Stream Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <h3 className="font-extrabold text-white text-base">Live Studio Broadcast Monitor</h3>
              </div>
              <button
                onClick={() => setActiveTab('liveStudio')}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
              >
                <span>Full Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeLive ? (
              <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded border border-blue-500/30">
                    {activeLive.subject} • {activeLive.classLevel}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {activeLive.currentViewers} Concurrent Viewers
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm leading-snug">{activeLive.title}</h4>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Instructor: <strong className="text-white">{activeLive.instructor}</strong></span>
                  <span className="text-amber-400 font-medium">2-Teacher Doubt Mode Active</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Key: {activeLive.streamKey}</span>
                  <button
                    onClick={() => openModal('liveClass', activeLive)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition"
                  >
                    Moderate Doubts Queue ({activeLive.doubtsQueue.length})
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-center space-y-3">
                <Video className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No active live studio broadcast currently live.</p>
                <button
                  onClick={() => openModal('liveClass')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Schedule Next Live Class
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>2-Teacher Advantage System: Active</span>
            <span className="text-slate-500">1080p HD Studio Encoder</span>
          </div>
        </div>

        {/* Pending Bookstore Orders Quick Dispatch */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base">Pending Bookstore Orders</h3>
              </div>
              <button
                onClick={() => setActiveTab('bookstore')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <span>Manage All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pendingOrders.length > 0 ? (
                pendingOrders.map((ord) => (
                  <div key={ord.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-white">
                        <span>#{ord.id}</span>
                        <span className="text-slate-400">• {ord.studentName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {ord.items.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => openModal('orderDispatch', ord)}
                      className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-xs font-bold transition whitespace-nowrap"
                    >
                      Dispatch
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">All bookstore orders have been dispatched!</div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Official T.S. Grewal & Sandeep Garg Books</span>
            <span className="text-emerald-400 font-semibold">BlueDart & Delhivery Integrated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
