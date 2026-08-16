import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  Database
} from 'lucide-react';

const SettingsManager = () => {
  const { showToast } = useAdmin();

  const [siteName, setSiteName] = useState('Success Mantra');
  const [supportEmail, setSupportEmail] = useState('support@successmantra.com');
  const [supportPhone, setSupportPhone] = useState('+91 1800-123-4567');
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_994820194819');
  const [enableUpi, setEnableUpi] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Platform settings and payment gateway configurations saved!', 'success');
  };

  const auditLogs = [
    { action: 'Published NTA CBT Mock Test #04', admin: 'Dhairya Gulati', time: '2026-08-16 10:15' },
    { action: 'Dispatched Order #ORD-98421 via BlueDart', admin: 'Dhairya Gulati', time: '2026-08-15 14:32' },
    { action: 'Updated Live Stream Status for Accountancy', admin: 'CA Shivam Grewal', time: '2026-08-14 18:00' },
    { action: 'Added T.S. Grewal Chapter 2 Handwritten PDF Notes', admin: 'Content Admin', time: '2026-08-13 11:20' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-bold mb-1">
            <Settings className="w-4 h-4" />
            <span>System Configuration & Security Audit</span>
          </div>
          <h2 className="text-2xl font-black text-white">Platform Settings & Integrations</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure payment gateways, branding details, and view security audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* General & Payment Settings Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-black text-white pb-3 border-b border-slate-800">General Platform Credentials</h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Toll-Free Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <h4 className="text-sm font-extrabold text-white pt-3 border-t border-slate-800">Payment Gateway Integrations</h4>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Razorpay Live API Key</label>
              <input
                type="text"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <input
                type="checkbox"
                id="upiCheck"
                checked={enableUpi}
                onChange={(e) => setEnableUpi(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
              />
              <label htmlFor="upiCheck" className="text-xs font-bold text-slate-200">
                Enable Instant UPI Autopay & QR Code Checkout (PhonePe / Google Pay / Paytm)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </form>
        </div>

        {/* Audit Log & Admin Credentials */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-black text-white">Active Chief Admin Profile</h3>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Dhairya Gulati"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40"
              />
              <div>
                <h4 className="font-bold text-white text-sm">Dhairya Gulati</h4>
                <p className="text-xs text-blue-400 font-semibold">Super Administrator & Platform Owner</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Last login: Today from paschim-vihar-delhi</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-black text-white">System Audit Trail</h3>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log, i) => (
                <div key={i} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1 text-xs">
                  <p className="font-bold text-white">{log.action}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>By {log.admin}</span>
                    <span className="font-mono">{log.time}</span>
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

export default SettingsManager;
