import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Plus,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  Play,
  Square,
  Send,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Monitor,
  AlertCircle,
  Radio,
  Eye,
  Signal,
  Wifi,
  Pin,
  Trash2,
  Shield,
  ScreenShare,
  ScreenShareOff,
  Activity,
  Cpu,
  HardDrive,
  Ban,
  Volume2,
  VolumeX,
  Settings,
  Copy,
  ExternalLink,
  ChevronDown,
  BarChart3,
  Zap,
  Globe,
} from 'lucide-react';

/* ── YouTube-like Logo ──────────────────────────────────────────── */
const YTStudioLogo = () => (
  <svg viewBox="0 0 28 20" width="26" height="18" fill="none">
    <rect width="28" height="20" rx="4" fill="#FF0000" />
    <polygon points="11,5.5 11,14.5 20,10" fill="white" />
  </svg>
);

/* ── Formatters ─────────────────────────────────────────────────── */
const fmtTime = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};
const fmtNum = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

/* ── Chat avatar colour hash ────────────────────────────────────── */
const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ── Stream Health Indicator ────────────────────────────────────── */
const HealthDot = ({ status }) => {
  const map = {
    excellent: { color: 'bg-emerald-500', text: 'text-emerald-400', label: 'Excellent' },
    good:      { color: 'bg-blue-500',    text: 'text-blue-400',    label: 'Good' },
    fair:      { color: 'bg-amber-500',   text: 'text-amber-400',   label: 'Fair' },
    poor:      { color: 'bg-red-500',     text: 'text-red-400',     label: 'Poor' },
  };
  const c = map[status] || map.good;
  return (
    <div className="flex items-center space-x-1.5">
      <span className={`w-2 h-2 rounded-full ${c.color} animate-pulse`}></span>
      <span className={`text-[11px] font-bold ${c.text}`}>{c.label}</span>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
/*  LiveStudioManager — ADMIN ONLY Control Panel                     */
/* ══════════════════════════════════════════════════════════════════ */
const LiveStudioManager = () => {
  const { liveClasses, toggleLiveStatus, resolveDoubt, openModal, showToast } = useAdmin();

  /* ── Stream selection state ────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('All');
  const [selectedId, setSelectedId] = useState(
    liveClasses.find(l => l.status === 'LIVE NOW')?.id || liveClasses[0]?.id
  );
  const stream = liveClasses.find(l => l.id === selectedId) || liveClasses[0];

  /* ── Camera / Mic / Screen ─────────────────────────────────────── */
  const [camOn, setCamOn]         = useState(false);
  const [micOn, setMicOn]         = useState(true);
  const [screenOn, setScreenOn]   = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [quality, setQuality]     = useState('1080p60');

  /* ── Timer ─────────────────────────────────────────────────────── */
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    let iv;
    if (stream?.status === 'LIVE NOW') iv = setInterval(() => setTimer(t => t + 1), 1000);
    else setTimer(0);
    return () => clearInterval(iv);
  }, [stream?.status, stream?.id]);

  /* ── Live metrics (simulated) ─────────────────────────────────── */
  const [viewerCount, setViewerCount]   = useState(stream?.currentViewers || 0);
  const [peakViewers, setPeakViewers]   = useState(stream?.peakViewers || 0);
  const [bitrate, setBitrate]           = useState(4500);
  const [droppedFrames, setDroppedFrames] = useState(0);
  const [streamHealth, setStreamHealth] = useState('excellent');

  useEffect(() => {
    if (stream?.status !== 'LIVE NOW') return;
    const iv = setInterval(() => {
      setViewerCount(v => {
        const next = Math.max(0, v + Math.floor(Math.random() * 20) - 6);
        setPeakViewers(p => Math.max(p, next));
        return next;
      });
      setBitrate(Math.floor(4000 + Math.random() * 1500));
      setDroppedFrames(f => f + (Math.random() > 0.85 ? 1 : 0));
    }, 3000);
    return () => clearInterval(iv);
  }, [stream?.status]);

  /* ── Chat (admin moderator view) ───────────────────────────────── */
  const [chatMessages, setChatMessages] = useState([
    { id: 'c1', name: 'Dhairya Gulati', role: 'OWNER', text: 'Good evening students! Partnership Deed masterclass starts now.', time: '18:24', pinned: false },
    { id: 'c2', name: 'Ananya Sharma', role: 'STUDENT', text: 'Sir please explain Interest on Capital rule 🙏', time: '18:25', pinned: false },
    { id: 'c3', name: 'Rohan Kapoor', role: 'STUDENT', text: 'Is this stream recorded for app revision?', time: '18:26', pinned: false },
    { id: 'c4', name: 'CA Ritu Verma', role: 'MOD', text: '📌 Doubt desk is LIVE. Ask your questions!', time: '18:27', pinned: true },
  ]);
  const [chatInput, setChatInput]   = useState('');
  const [slowMode, setSlowMode]     = useState(false);
  const [subsOnly, setSubsOnly]     = useState(false);
  const chatRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* Auto-scroll chat */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  /* Simulate incoming student messages */
  useEffect(() => {
    if (stream?.status !== 'LIVE NOW') return;
    const names = ['Kabir M.', 'Sanya G.', 'Dev Roy', 'Mehak J.', 'Aryan S.', 'Nisha P.', 'Raj K.', 'Simran T.', 'Vikram B.'];
    const msgs  = [
      'Super clear explanation sir! 🔥', 'Can we write goodwill directly in journal?',
      'T.S. Grewal Q14 solved!', 'Notes PDF milenge kya?',
      'Is this CUET 2026 relevant? 🙏', 'Sir speed thoda slow karo 😅',
      'Thank you for free live class! ❤️', 'First time watching — amazing quality!',
      'Board exam ke liye important hai ye?', 'Sir please repeat the last formula 🙏',
    ];
    const iv = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const text = msgs[Math.floor(Math.random() * msgs.length)];
      setChatMessages(prev => [...prev.slice(-60), {
        id: `c-${Date.now()}`, name, role: 'STUDENT', text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pinned: false,
      }]);
    }, 4200);
    return () => clearInterval(iv);
  }, [stream?.status]);

  /* ── Camera / Screen helpers ───────────────────────────────────── */
  const startCamera = async () => {
    try {
      setMediaError(null);
      const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
      streamRef.current = ms;
      if (videoRef.current) { videoRef.current.srcObject = ms; videoRef.current.play(); }
      setCamOn(true);
    } catch { setMediaError('Camera permission denied. Allow camera access in browser settings.'); }
  };
  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamOn(false);
  };
  const startScreen = async () => {
    try {
      const ms = await navigator.mediaDevices.getDisplayMedia({ video: true });
      streamRef.current = ms;
      if (videoRef.current) { videoRef.current.srcObject = ms; videoRef.current.play(); }
      setScreenOn(true); setCamOn(false);
      ms.getVideoTracks()[0].onended = () => stopScreen();
    } catch { /* user cancelled */ }
  };
  const stopScreen = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setScreenOn(false);
  };

  /* ── Go Live / End ─────────────────────────────────────────────── */
  const goLive = async (targetStatus) => {
    if (targetStatus === 'LIVE NOW') {
      await startCamera();
      toggleLiveStatus(stream.id, 'LIVE NOW');
      setActiveTab('LIVE NOW');
      setViewerCount(Math.floor(Math.random() * 300) + 800);
      setPeakViewers(0);
      setDroppedFrames(0);
      showToast('🔴 You are LIVE! Broadcasting to students now.', 'success');
    } else {
      stopCamera(); stopScreen();
      toggleLiveStatus(stream.id, 'Ended');
      showToast(`Stream ended. Duration: ${fmtTime(timer)} | Peak: ${fmtNum(peakViewers)} viewers.`, 'info');
    }
  };

  /* ── Chat moderation ───────────────────────────────────────────── */
  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: `c-${Date.now()}`, name: 'Admin (You)', role: 'OWNER', text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), pinned: false,
    }]);
    setChatInput('');
  };
  const deleteMessage = (id) => setChatMessages(prev => prev.filter(m => m.id !== id));
  const pinMessage = (id) => {
    setChatMessages(prev => prev.map(m => ({ ...m, pinned: m.id === id ? !m.pinned : m.pinned })));
    showToast('Message pin toggled.', 'info');
  };
  const timeoutUser = (name) => {
    setChatMessages(prev => prev.filter(m => m.name !== name));
    showToast(`${name} timed out from chat.`, 'info');
  };

  /* ── Stream list helpers ───────────────────────────────────────── */
  const counts = {
    All: liveClasses.length,
    'LIVE NOW': liveClasses.filter(l => l.status === 'LIVE NOW').length,
    Upcoming:   liveClasses.filter(l => l.status === 'Upcoming').length,
    Ended:      liveClasses.filter(l => l.status === 'Ended').length,
  };
  const filtered = liveClasses.filter(l => activeTab === 'All' || l.status === activeTab);

  /* ── Role badge styles ─────────────────────────────────────────── */
  const roleBadge = {
    OWNER:   { label: 'ADMIN', bg: 'bg-red-600', text: 'text-white' },
    MOD:     { label: 'MOD',   bg: 'bg-emerald-600', text: 'text-white' },
    STUDENT: { label: '',      bg: '', text: 'text-slate-400' },
  };

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col space-y-0 pb-8">
      {/* CSS */}
      <style>{`
        .scrollbar-admin::-webkit-scrollbar { width: 4px; }
        .scrollbar-admin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-admin::-webkit-scrollbar-thumb { background: #374151; border-radius: 99px; }
        .scrollbar-admin::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>

      {/* ══════════ HEADER ══════════════════════════════════════ */}
      <div className="flex items-center justify-between pb-5">
        <div className="flex items-center space-x-3">
          <YTStudioLogo />
          <div>
            <h1 className="text-white font-black text-lg tracking-tight leading-none">Live Studio</h1>
            <p className="text-slate-500 text-[10px] font-medium">Admin Control Panel · Broadcast & Moderate</p>
          </div>
          {stream?.status === 'LIVE NOW' && (
            <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded flex items-center space-x-1 animate-pulse ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span><span>LIVE</span>
            </span>
          )}
        </div>
        <button
          onClick={() => openModal('liveClass')}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl flex items-center space-x-1.5 transition shadow-lg shadow-red-600/20"
        >
          <Plus className="w-3.5 h-3.5" /> <span>Schedule Stream</span>
        </button>
      </div>

      {/* ══════════ MAIN 3-COLUMN LAYOUT ═══════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ── COL 1: Stream List (3 cols) ─────────────────────── */}
        <div className="lg:col-span-3 flex flex-col space-y-3">
          {/* Tab pills */}
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[10px]">
            {['All', 'LIVE NOW', 'Upcoming', 'Ended'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activeTab === t ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'LIVE NOW' && counts[t] > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                )}
                <span>{t === 'LIVE NOW' ? 'LIVE' : t}</span>
                <span className="opacity-60">{counts[t]}</span>
              </button>
            ))}
          </div>

          {/* Stream cards */}
          <div className="space-y-2 overflow-y-auto max-h-[640px] scrollbar-admin pr-0.5">
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  s.id === selectedId
                    ? 'bg-white/[0.06] border-red-500/50 ring-1 ring-red-500/20'
                    : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${
                    s.status === 'LIVE NOW' ? 'bg-red-600 text-white animate-pulse' :
                    s.status === 'Upcoming' ? 'bg-amber-500/90 text-slate-950' :
                    'bg-slate-700 text-slate-300'
                  }`}>{s.status}</span>
                  {s.status === 'LIVE NOW' && (
                    <span className="text-[10px] text-red-400 font-bold flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{fmtNum(s.currentViewers)}</span>
                    </span>
                  )}
                </div>
                <p className="text-white text-[11px] font-bold leading-snug line-clamp-2">{s.title}</p>
                <p className="text-slate-500 text-[10px] mt-1 flex items-center space-x-1.5">
                  <span>{s.instructor}</span>
                  <span>·</span>
                  <span>{s.scheduledTime}</span>
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── COL 2: Video Preview + Controls (5 cols) ───────── */}
        <div className="lg:col-span-5 flex flex-col space-y-3">

          {/* Video Preview Monitor */}
          <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ aspectRatio: '16/9' }}>
            <video ref={videoRef} playsInline muted autoPlay className={`w-full h-full object-cover ${camOn || screenOn ? '' : 'hidden'}`} />

            {/* Idle / Standby */}
            {!camOn && !screenOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 space-y-4">
                {stream?.status === 'LIVE NOW' ? (
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-red-600/15 border border-red-500/40 flex items-center justify-center mx-auto animate-pulse">
                      <Radio className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-white font-bold text-sm">Stream is LIVE — no video feed</p>
                    <p className="text-slate-500 text-xs">Enable camera or screen share below</p>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <YTStudioLogo />
                    <p className="text-white font-bold text-sm mt-2">Studio Preview</p>
                    <p className="text-slate-500 text-xs">Enable camera or share screen to preview</p>
                    <div className="flex items-center justify-center space-x-2 pt-2">
                      <button onClick={startCamera} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition">
                        <Camera className="w-3 h-3" /> <span>Camera</span>
                      </button>
                      <button onClick={startScreen} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition">
                        <ScreenShare className="w-3 h-3" /> <span>Screen</span>
                      </button>
                    </div>
                    {mediaError && <p className="text-red-400 text-xs mt-2">{mediaError}</p>}
                  </div>
                )}
              </div>
            )}

            {/* LIVE overlay badges */}
            {stream?.status === 'LIVE NOW' && (
              <>
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10">
                  <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span><span>LIVE</span>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">{fmtTime(timer)}</div>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center space-x-1 z-10">
                  <Eye className="w-3 h-3 text-red-400" />
                  <span>{fmtNum(viewerCount)}</span>
                </div>
              </>
            )}
          </div>

          {/* Stream Title + Info */}
          <div className="bg-slate-950 border border-white/10 rounded-xl p-3 space-y-2">
            <h3 className="text-white font-black text-sm leading-snug">{stream?.title}</h3>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
              <span className="text-slate-200 font-bold">{stream?.instructor}</span>
              <span>·</span>
              <span>{stream?.subject} ({stream?.classLevel})</span>
              <span>·</span>
              <span>{stream?.scheduledTime}</span>
              <span>·</span>
              <span>Duration: {stream?.duration}</span>
            </div>
          </div>

          {/* Broadcast Control Bar */}
          <div className="bg-slate-950 border border-white/10 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-black">Broadcast Controls</span>
              {stream?.status === 'LIVE NOW' ? (
                <button onClick={() => goLive('Ended')} className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-black text-xs rounded-lg transition">
                  <Square className="w-3 h-3 fill-white" /> <span>End Stream</span>
                </button>
              ) : (
                <button onClick={() => goLive('LIVE NOW')} className="flex items-center space-x-1.5 px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-lg shadow-lg shadow-red-600/25 transition transform hover:scale-105">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> <span>Go Live</span>
                </button>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button onClick={() => camOn ? stopCamera() : startCamera()}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${camOn ? 'bg-white text-slate-950' : 'bg-white/10 border border-white/15 text-slate-300 hover:text-white'}`}>
                {camOn ? <Camera className="w-3 h-3" /> : <CameraOff className="w-3 h-3" />}
                <span>{camOn ? 'Cam ON' : 'Cam OFF'}</span>
              </button>
              <button onClick={() => setMicOn(m => !m)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${micOn ? 'bg-white text-slate-950' : 'bg-white/10 border border-white/15 text-slate-300 hover:text-white'}`}>
                {micOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                <span>{micOn ? 'Mic ON' : 'Mic OFF'}</span>
              </button>
              <button onClick={() => screenOn ? stopScreen() : startScreen()}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${screenOn ? 'bg-blue-600 text-white' : 'bg-white/10 border border-white/15 text-slate-300 hover:text-white'}`}>
                {screenOn ? <ScreenShareOff className="w-3 h-3" /> : <ScreenShare className="w-3 h-3" />}
                <span>{screenOn ? 'Stop Share' : 'Screen Share'}</span>
              </button>
              <select value={quality} onChange={e => setQuality(e.target.value)}
                className="px-2 py-1.5 bg-white/10 border border-white/15 text-slate-300 text-[11px] rounded-lg focus:outline-none">
                <option value="1080p60">1080p60</option>
                <option value="1080p30">1080p30</option>
                <option value="720p30">720p30</option>
                <option value="480p">480p</option>
              </select>
            </div>
          </div>

          {/* Stream Health Panel (admin only) */}
          <div className="bg-slate-950 border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-white text-xs font-black flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> <span>Stream Health</span>
              </span>
              <HealthDot status={streamHealth} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Viewers', value: fmtNum(viewerCount), icon: <Eye className="w-3.5 h-3.5 text-blue-400" />, sub: `Peak: ${fmtNum(peakViewers)}` },
                { label: 'Bitrate', value: `${bitrate} kbps`, icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, sub: quality },
                { label: 'Dropped', value: String(droppedFrames), icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" />, sub: 'frames' },
                { label: 'Uptime', value: fmtTime(timer), icon: <Clock className="w-3.5 h-3.5 text-emerald-400" />, sub: stream?.duration || '—' },
              ].map(m => (
                <div key={m.label} className="bg-white/[0.04] border border-white/8 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    {m.icon}
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{m.label}</span>
                  </div>
                  <p className="text-white font-black text-sm">{m.value}</p>
                  <p className="text-slate-500 text-[10px]">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RTMP Credentials (admin only) */}
          <div className="bg-slate-950 border border-white/10 rounded-xl p-3 space-y-2">
            <span className="text-white text-xs font-black flex items-center space-x-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-400" /> <span>RTMP Ingestion Credentials</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white/[0.04] border border-white/8 rounded-lg p-2.5">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Server URL</p>
                <div className="flex items-center justify-between">
                  <code className="text-amber-300 text-[11px] font-mono">rtmp://a.rtmp.youtube.com/live2</code>
                  <button onClick={() => { navigator.clipboard?.writeText('rtmp://a.rtmp.youtube.com/live2'); showToast('Copied!', 'info'); }} className="text-slate-500 hover:text-white transition"><Copy className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="bg-white/[0.04] border border-white/8 rounded-lg p-2.5">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Stream Key</p>
                <div className="flex items-center justify-between">
                  <code className="text-slate-300 text-[11px] font-mono">{stream?.streamKey || '—'}</code>
                  <button onClick={() => { navigator.clipboard?.writeText(stream?.streamKey || ''); showToast('Copied!', 'info'); }} className="text-slate-500 hover:text-white transition"><Copy className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── COL 3: Chat Moderator + Doubt Desk (4 cols) ─────── */}
        <div className="lg:col-span-4 flex flex-col space-y-3">

          {/* Live Chat Moderator Panel */}
          <div className="bg-slate-950 border border-white/10 rounded-2xl flex flex-col overflow-hidden" style={{ height: '400px' }}>
            {/* Chat header */}
            <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-black text-xs">Live Chat</span>
                {stream?.status === 'LIVE NOW' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                <span className="text-slate-500 text-[10px]">· MODERATOR VIEW</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => { setSlowMode(!slowMode); showToast(slowMode ? 'Slow mode OFF' : 'Slow mode ON (30s)', 'info'); }}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition ${slowMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}
                  title="Toggle slow mode"
                >
                  🐢 Slow
                </button>
                <button
                  onClick={() => { setSubsOnly(!subsOnly); showToast(subsOnly ? 'Chat open to all' : 'VIP subscribers only chat', 'info'); }}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition ${subsOnly ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}
                  title="Toggle subscribers-only mode"
                >
                  🏅 Subs
                </button>
              </div>
            </div>

            {/* Pinned message */}
            {chatMessages.some(m => m.pinned) && (
              <div className="px-3.5 py-2 bg-blue-500/10 border-b border-blue-500/20 flex items-start space-x-2 flex-shrink-0 text-[11px]">
                <Pin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-blue-300 font-bold text-[10px]">📌 Pinned</span>
                  <p className="text-white">{chatMessages.find(m => m.pinned)?.text}</p>
                </div>
              </div>
            )}

            {/* Chat messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto px-3.5 py-2 space-y-2 scrollbar-admin">
              {chatMessages.map(m => (
                <div key={m.id} className="flex items-start space-x-2 group">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black flex-shrink-0 mt-0.5" style={{ background: avatarColor(m.name) }}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-1.5 flex-wrap">
                      <span className={`text-[11px] font-bold ${m.role === 'OWNER' ? 'text-amber-400' : m.role === 'MOD' ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {m.name}
                      </span>
                      {roleBadge[m.role]?.label && (
                        <span className={`text-[8px] px-1 py-0.5 rounded font-black ${roleBadge[m.role].bg} ${roleBadge[m.role].text}`}>
                          {roleBadge[m.role].label}
                        </span>
                      )}
                      <span className="text-[9px] text-slate-600">{m.time}</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-snug">{m.text}</p>
                  </div>
                  {/* Mod actions — visible on hover */}
                  {m.role === 'STUDENT' && (
                    <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                      <button onClick={() => pinMessage(m.id)} className="p-1 text-slate-500 hover:text-blue-400 transition" title="Pin message"><Pin className="w-3 h-3" /></button>
                      <button onClick={() => deleteMessage(m.id)} className="p-1 text-slate-500 hover:text-red-400 transition" title="Delete message"><Trash2 className="w-3 h-3" /></button>
                      <button onClick={() => timeoutUser(m.name)} className="p-1 text-slate-500 hover:text-amber-400 transition" title="Timeout user"><Ban className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Admin chat input */}
            <div className="px-3.5 py-2 border-t border-white/10 flex-shrink-0">
              <form onSubmit={sendChat} className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">D</div>
                <input
                  type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  placeholder="Send message as Admin..."
                  className="flex-1 bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-white/30"
                />
                <button type="submit" disabled={!chatInput.trim()} className="p-1.5 text-white hover:text-blue-400 transition disabled:opacity-30">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* 2-Teacher Doubt Desk */}
          <div className="bg-slate-950 border border-white/10 rounded-2xl p-3.5 space-y-3 flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white font-black text-xs">2-Teacher Doubt Desk</span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] font-bold rounded border border-blue-500/30">
                  {stream?.doubtsQueue?.filter(d => d.status !== 'Resolved').length || 0} pending
                </span>
              </div>
              <span className="text-[10px] text-slate-500">TA: <strong className="text-emerald-400">{stream?.assistantTeacher}</strong></span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto scrollbar-admin pr-0.5">
              {(stream?.doubtsQueue || []).map(d => (
                <div key={d.id} className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                  d.status === 'Pinned' ? 'bg-amber-500/10 border-amber-500/40' :
                  d.status === 'Resolved' ? 'bg-white/[0.02] border-white/5 opacity-50' :
                  'bg-white/[0.03] border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{d.student}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                      d.status === 'Pinned' ? 'bg-amber-500/20 text-amber-300' :
                      d.status === 'Resolved' ? 'bg-green-500/20 text-green-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>{d.status}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{d.question}</p>
                  {d.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveDoubt(stream.id, d.id)}
                      className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg flex items-center justify-center space-x-1 transition"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Answer & Resolve</span>
                    </button>
                  )}
                </div>
              ))}
              {(!stream?.doubtsQueue || stream.doubtsQueue.length === 0) && (
                <div className="py-6 text-center text-slate-500 text-[11px]">
                  No doubts yet. Go live to receive student questions.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStudioManager;
