import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Bell,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Megaphone
} from 'lucide-react';

const BroadcastManager = () => {
  const { broadcasts, sendBroadcast, showToast } = useAdmin();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Commerce Students');
  const [notificationType, setNotificationType] = useState('Push & In-App');

  // Announcement Banner Config state
  const [bannerText, setBannerText] = useState('Session 2026-27 • CBSE Board & CUET Domain Portal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) {
      showToast('Please enter both title and message text', 'warning');
      return;
    }
    sendBroadcast({ title, message, targetAudience, type: notificationType });
    setTitle('');
    setMessage('');
  };

  const handleUpdateBanner = (e) => {
    e.preventDefault();
    showToast('Updated Live Website Announcement Banner!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-rose-400 font-bold mb-1">
            <Bell className="w-4 h-4 text-rose-400" />
            <span>Student Communication & Push Broadcast Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white">Notifications & Announcement Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Send targeted push notifications for upcoming NTA Mock Tests, live streams, and update live website header banners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Send Broadcast Form */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-black text-white">Compose Push Notification</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Notification Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Commerce Full Board Mock Test #04 Announcement"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="All Commerce Students">All Commerce Students</option>
                  <option value="Class 12 Students">Class 12 Students Only</option>
                  <option value="Class 11 Students">Class 11 Students Only</option>
                  <option value="VIP Members">VIP Members Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Notification Channel</label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Push & In-App">Mobile Push & In-App</option>
                  <option value="In-App Notification">In-App Notification</option>
                  <option value="Email Alert">Email Newsletter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Message Content</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your notification message to be dispatched instantly..."
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notification Now</span>
            </button>
          </form>
        </div>

        {/* Website Banner & Sent History */}
        <div className="lg:col-span-6 space-y-6">
          {/* Website Announcement Banner Configurator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-black text-white">Live Website Announcement Banner</h3>
            </div>

            <form onSubmit={handleUpdateBanner} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Banner Pill Text</label>
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-2 text-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-bold">Preview: {bannerText}</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
              >
                Save & Update Website Banner
              </button>
            </form>
          </div>

          {/* Broadcast Log */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white">Broadcast History Log</h3>
            <div className="space-y-3 max-h-56 overflow-y-auto">
              {broadcasts.map((bc) => (
                <div key={bc.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{bc.title}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                      {bc.readRate} Read
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{bc.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Target: {bc.targetAudience}</span>
                    <span>{bc.sentDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastManager;
