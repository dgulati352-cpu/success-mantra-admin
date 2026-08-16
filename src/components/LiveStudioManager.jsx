import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { db } from '../lib/firebase';
import { BroadcastSession } from '../lib/webrtcBroadcaster';
import { doc, onSnapshot, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
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
  Video,
  Signal,
  Wifi,
  Pin,
  Trash2,
  Shield,
  ScreenShare,
  ScreenShareOff,
  Activity,
  Ban,
  Settings,
  Copy,
  Zap,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

/* ── YouTube Studio Logo ────────────────────────────────────────── */
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
/*  LiveStudioManager — ADMIN LIVE CLASS Control Desk                */
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

  /* ── Right Panel Tabbed Interface ──────────────────────────────── */
  const [rightPanelTab, setRightPanelTab] = useState('chat');

  /* ── Firestore Real-time Live Chat Sync ────────────────────────── */
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const broadcasterRef = useRef(null); // WebRTC BroadcastSession instance

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "live", "chats"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.messages)) {
          setChatMessages(data.messages);
        }
      }
    });
    return unsub;
  }, []);

  /* Auto-scroll chat */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  const sendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const chatMsg = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      user: 'Educator',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTa: true
    };

    setChatInput('');

    try {
      await updateDoc(doc(db, "live", "chats"), {
        messages: arrayUnion(chatMsg)
      });
    } catch (err) {
      console.warn("Failed to send message to Firestore", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const updated = chatMessages.filter(m => m.id !== id);
      await setDoc(doc(db, "live", "chats"), { messages: updated });
      showToast("Message deleted from live chat.", "info");
    } catch (err) { console.warn(err); }
  };

  const pinMessage = async (id) => {
    try {
      const updated = chatMessages.map(m => m.id === id ? { ...m, pinned: !m.pinned } : { ...m, pinned: false });
      await setDoc(doc(db, "live", "chats"), { messages: updated });
      showToast("Message pinned to top.", "info");
    } catch (err) { console.warn(err); }
  };

  /* ── Firestore Real-time Doubts Sync ────────────────────────────── */
  const [doubtsQueue, setDoubtsQueue] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "live", "doubts"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.doubts)) {
          setDoubtsQueue(data.doubts);
        }
      }
    });
    return unsub;
  }, []);

  const handleResolveDoubt = async (doubtId) => {
    try {
      const updated = doubtsQueue.map(d => d.id === doubtId ? { ...d, status: 'Resolved' } : d);
      await setDoc(doc(db, "live", "doubts"), { doubts: updated });
      showToast("Doubt marked as Resolved live!", "success");
    } catch (err) {
      console.warn("Failed to resolve doubt:", err);
    }
  };

  const handlePinDoubt = async (doubtId) => {
    try {
      const updated = doubtsQueue.map(d => d.id === doubtId ? { ...d, status: d.status === 'Pinned' ? 'Pending' : 'Pinned' } : d);
      await setDoc(doc(db, "live", "doubts"), { doubts: updated });
      showToast("Doubt status updated!", "info");
    } catch (err) {
      console.warn("Failed to pin doubt:", err);
    }
  };

  /* ── Firestore Real-time Live Poll Sync ────────────────────────── */
  const [pollQuestion, setPollQuestion] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [activePoll, setActivePoll] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "live", "currentPoll"), (snap) => {
      if (snap.exists()) {
        setActivePoll(snap.data());
      } else {
        setActivePoll(null);
      }
    });
    return unsub;
  }, []);

  const handleLaunchPoll = async () => {
    if (!pollQuestion.trim() || !optA.trim() || !optB.trim()) {
      showToast("Please enter at least a question and options A & B.", "warning");
      return;
    }

    const pollData = {
      isActive: true,
      question: pollQuestion.trim(),
      options: [optA.trim(), optB.trim(), optC.trim() || "No Option", optD.trim() || "No Option"].filter(opt => opt !== "No Option"),
      votes: [0, 0, 0, 0],
      showResults: true
    };

    try {
      await setDoc(doc(db, "live", "currentPoll"), pollData);
      showToast("Live poll launched successfully!", "success");
    } catch (err) {
      console.warn("Failed to launch poll in Firestore", err);
    }
  };

  const handleEndPoll = async () => {
    try {
      await updateDoc(doc(db, "live", "currentPoll"), {
        isActive: false
      });
      showToast("Live poll ended.", "info");
    } catch (err) {
      console.warn(err);
    }
  };

  const handleResetPoll = async () => {
    try {
      await setDoc(doc(db, "live", "currentPoll"), {
        isActive: false,
        question: "",
        options: [],
        votes: [],
        showResults: false
      });
      setPollQuestion("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      showToast("Poll reset.", "info");
    } catch (err) {
      console.warn(err);
    }
  };

  /* ── Camera / Screen helpers ───────────────────────────────────── */
  const startCamera = async () => {
    try {
      setMediaError(null);
      const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
      streamRef.current = ms;
      if (videoRef.current) { videoRef.current.srcObject = ms; videoRef.current.play(); }
      setCamOn(true);

      // Start WebRTC broadcast & update Firestore so student side gets teacher video
      try {
        if (broadcasterRef.current) {
          await broadcasterRef.current.stop().catch(() => {});
        }
        const broadcaster = new BroadcastSession(ms, (count) => {
          if (count > 0) setViewerCount(v => Math.max(v, count));
        });
        broadcasterRef.current = broadcaster;
        await broadcaster.start();
      } catch (e) {
        console.warn('WebRTC broadcast start warning:', e);
      }

      // Signal camera active in currentBroadcast doc
      try {
        await updateDoc(doc(db, 'live', 'currentBroadcast'), {
          cameraActive: true,
          updatedAt: Date.now()
        });
      } catch (e) { console.warn(e); }

      return ms;
    } catch {
      setMediaError('Camera permission denied. Allow camera access in browser settings.');
      return null;
    }
  };

  const stopCamera = () => {
    if (broadcasterRef.current) {
      broadcasterRef.current.stop().catch(() => {});
      broadcasterRef.current = null;
    }
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setCamOn(false);
    updateDoc(doc(db, 'live', 'currentBroadcast'), { cameraActive: false, updatedAt: Date.now() }).catch(() => {});
  };

  const startScreen = async () => {
    try {
      const ms = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      streamRef.current = ms;
      if (videoRef.current) { videoRef.current.srcObject = ms; videoRef.current.play(); }
      setScreenOn(true); setCamOn(false);

      try {
        if (broadcasterRef.current) {
          await broadcasterRef.current.stop().catch(() => {});
        }
        const broadcaster = new BroadcastSession(ms, (count) => {
          if (count > 0) setViewerCount(v => Math.max(v, count));
        });
        broadcasterRef.current = broadcaster;
        await broadcaster.start();
      } catch (e) { console.warn(e); }

      ms.getVideoTracks()[0].onended = () => stopScreen();
      return ms;
    } catch { return null; }
  };

  const stopScreen = () => {
    if (broadcasterRef.current) {
      broadcasterRef.current.stop().catch(() => {});
      broadcasterRef.current = null;
    }
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setScreenOn(false);
  };

  /* ── Go Live / End (with WebRTC Broadcasting) ──────────────────── */
  const goLive = async (targetStatus) => {
    if (targetStatus === 'LIVE NOW') {
      const ms = await startCamera();
      toggleLiveStatus(stream.id, 'LIVE NOW');
      setActiveTab('LIVE NOW');
      setViewerCount(Math.floor(Math.random() * 300) + 800);
      setPeakViewers(0);
      setDroppedFrames(0);

      // 🔴 Start WebRTC broadcast so students receive the actual live video
      if (ms) {
        try {
          const broadcaster = new BroadcastSession(ms, (count) => {
            if (count > 0) setViewerCount(v => Math.max(v, count));
          });
          broadcasterRef.current = broadcaster;
          await broadcaster.start();
          showToast('🔴 You are LIVE! Students can now see your camera feed.', 'success');
        } catch (err) {
          console.warn('WebRTC broadcast start failed:', err);
          showToast('🔴 You are LIVE (stream metadata sent, WebRTC unavailable in this browser)', 'success');
        }
      } else {
        showToast('🔴 You are LIVE in the Virtual Classroom!', 'success');
      }
    } else {
      // Stop WebRTC broadcast
      if (broadcasterRef.current) {
        await broadcasterRef.current.stop().catch(() => {});
        broadcasterRef.current = null;
      }
      stopCamera(); stopScreen();
      toggleLiveStatus(stream.id, 'Ended');
      showToast(`Class ended. Duration: ${fmtTime(timer)}`, 'info');
    }
  };

  /* ── Stream list helpers ───────────────────────────────────────── */
  const counts = {
    All: liveClasses.length,
    'LIVE NOW': liveClasses.filter(l => l.status === 'LIVE NOW').length,
    Upcoming:   liveClasses.filter(l => l.status === 'Upcoming').length,
    Ended:      liveClasses.filter(l => l.status === 'Ended').length,
  };
  const filtered = liveClasses.filter(l => activeTab === 'All' || l.status === activeTab);

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col space-y-0 pb-8">
      {/* Custom CSS scrollbars */}
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
            <h1 className="text-white font-black text-lg tracking-tight leading-none">Interactive Live Class Studio</h1>
            <p className="text-slate-500 text-[10px] font-medium">Educator Dashboard · Live Interaction Control</p>
          </div>
          {stream?.status === 'LIVE NOW' && (
            <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded flex items-center space-x-1 animate-pulse ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span><span>LIVE NOW</span>
            </span>
          )}
        </div>
        <button
          onClick={() => openModal('liveClass')}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl flex items-center space-x-1.5 transition shadow-lg shadow-red-600/20"
        >
          <Plus className="w-3.5 h-3.5" /> <span>Schedule Live Class</span>
        </button>
      </div>

      {/* ══════════ MAIN 3-COLUMN LAYOUT ═══════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ── COL 1: Class List (3 cols) ──────────────────────── */}
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

          {/* Cards */}
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

        {/* ── COL 2: Camera Feed + Health (5 cols) ─────────────── */}
        <div className="lg:col-span-5 flex flex-col space-y-3">

          {/* Video Preview */}
          <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in" style={{ aspectRatio: '16/9' }}>
            <video ref={videoRef} playsInline muted autoPlay className={`w-full h-full object-cover ${camOn || screenOn ? '' : 'hidden'}`} />

            {/* Standby / Fallback Graphics */}
            {!camOn && !screenOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 space-y-4">
                {stream?.status === 'LIVE NOW' ? (
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-red-600/15 border border-red-500/40 flex items-center justify-center mx-auto animate-pulse">
                      <Radio className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-white font-bold text-sm">Interactive Live Class is ACTIVE</p>
                    <p className="text-slate-500 text-xs">Enable camera or screen share to start streaming</p>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <YTStudioLogo />
                    <p className="text-white font-bold text-sm mt-2">Classroom Video Monitor</p>
                    <p className="text-slate-500 text-xs">Enable devices to preview camera output</p>
                    <div className="flex items-center justify-center space-x-2 pt-2">
                      <button onClick={startCamera} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition">
                        <Camera className="w-3 h-3" /> <span>Enable Cam</span>
                      </button>
                      <button onClick={startScreen} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition">
                        <ScreenShare className="w-3 h-3" /> <span>Share Screen</span>
                      </button>
                    </div>
                    {mediaError && <p className="text-red-400 text-xs mt-2">{mediaError}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Badges */}
            {stream?.status === 'LIVE NOW' && (
              <>
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10">
                  <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span><span>LIVE CLASS</span>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">{fmtTime(timer)}</div>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center space-x-1 z-10">
                  <Eye className="w-3 h-3 text-red-400" />
                  <span>{fmtNum(viewerCount)} watching</span>
                </div>
              </>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-slate-950 border border-white/10 rounded-xl p-3 space-y-2">
            <h3 className="text-white font-black text-sm leading-snug">{stream?.title}</h3>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
              <span className="text-slate-200 font-bold">Educator: {stream?.instructor}</span>
              <span>·</span>
              <span>{stream?.subject} ({stream?.classLevel})</span>
              <span>·</span>
              <span>Class Time: {stream?.scheduledTime}</span>
            </div>
          </div>

          {/* Educator controls */}
          <div className="bg-slate-950 border border-white/10 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-white text-xs font-black">Classroom Controls</span>
              <div className="flex items-center space-x-2">
                <a
                  href={stream?.meetLink || 'https://meet.google.com/abc-defg-hij'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => goLive('LIVE NOW')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg shadow-lg shadow-emerald-600/25 transition transform hover:scale-105"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>🟢 Launch Google Meet</span>
                </a>

                {stream?.status === 'LIVE NOW' ? (
                  <button onClick={() => goLive('Ended')} className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-black text-xs rounded-lg transition">
                    <Square className="w-3 h-3 fill-white" /> <span>End Live Class</span>
                  </button>
                ) : (
                  <button onClick={() => goLive('LIVE NOW')} className="flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-lg shadow-lg shadow-red-600/25 transition">
                    <Radio className="w-3.5 h-3.5 animate-pulse" /> <span>Start Web Studio</span>
                  </button>
                )}
              </div>
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
                <span>{screenOn ? 'Stop Share' : 'Share Screen'}</span>
              </button>
              <select value={quality} onChange={e => setQuality(e.target.value)}
                className="px-2 py-1.5 bg-white/10 border border-white/15 text-slate-300 text-[11px] rounded-lg focus:outline-none">
                <option value="1080p60">1080p60 (High)</option>
                <option value="720p30">720p (Medium)</option>
                <option value="480p">480p (Low)</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-950 border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-white text-xs font-black flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> <span>Session Diagnostics</span>
              </span>
              <HealthDot status={streamHealth} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Active Students', value: fmtNum(viewerCount), icon: <Users className="w-3.5 h-3.5 text-blue-400" />, sub: `Peak: ${fmtNum(peakViewers)}` },
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
        </div>

        {/* ── COL 3: Chat / Doubts / Polls Panel (4 cols) ─────── */}
        <div className="lg:col-span-4 flex flex-col space-y-3">

          <div className="bg-slate-950 border border-white/10 rounded-2xl flex flex-col overflow-hidden h-[640px]">
            {/* Header Tabs */}
            <div className="flex border-b border-white/10 bg-slate-900 text-xs">
              <button
                onClick={() => setRightPanelTab('chat')}
                className={`flex-1 py-3 font-bold transition flex items-center justify-center space-x-1.5 ${
                  rightPanelTab === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Class Chat</span>
              </button>
              <button
                onClick={() => setRightPanelTab('doubts')}
                className={`flex-1 py-3 font-bold transition flex items-center justify-center space-x-1.5 ${
                  rightPanelTab === 'doubts' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Doubt Desk</span>
              </button>
              <button
                onClick={() => setRightPanelTab('polls')}
                className={`flex-1 py-3 font-bold transition flex items-center justify-center space-x-1.5 ${
                  rightPanelTab === 'polls' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Live Polls</span>
              </button>
            </div>

            {/* TAB 1: Chat Moderator */}
            {rightPanelTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-admin">
                  {chatMessages.map(m => (
                    <div key={m.id} className="flex items-start space-x-2 group">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black flex-shrink-0 mt-0.5" style={{ background: avatarColor(m.user) }}>
                        {m.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline space-x-1.5 flex-wrap">
                          <span className={`text-[11px] font-bold ${m.isTa ? 'text-amber-400' : 'text-slate-300'}`}>
                            {m.user}
                          </span>
                          {m.isTa && (
                            <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black">EDUCATOR</span>
                          )}
                          <span className="text-[9px] text-slate-600">{m.time}</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-snug">{m.text}</p>
                      </div>
                      {/* Mod actions */}
                      {!m.isTa && (
                        <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                          <button onClick={() => pinMessage(m.id)} className="p-1 text-slate-500 hover:text-blue-400 transition" title="Pin message"><Pin className="w-3 h-3" /></button>
                          <button onClick={() => deleteMessage(m.id)} className="p-1 text-slate-500 hover:text-red-400 transition" title="Delete message"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      )}
                    </div>
                  ))}
                  {chatMessages.length === 0 && (
                    <div className="py-8 text-center text-slate-500 text-[11px]">Chat feed is empty.</div>
                  )}
                </div>

                <div className="px-3.5 py-2.5 border-t border-white/10 bg-slate-950 flex-shrink-0">
                  <form onSubmit={sendChat} className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">D</div>
                    <input
                      type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                      placeholder="Send message to class..."
                      className="flex-1 bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-white/30"
                    />
                    <button type="submit" disabled={!chatInput.trim()} className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-30">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: Doubt Desk */}
            {rightPanelTab === 'doubts' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-admin">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-white font-black">Active Doubts Queue</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                    {doubtsQueue.filter(d => d.status !== 'Resolved').length} Pending
                  </span>
                </div>

                <div className="space-y-2.5">
                  {doubtsQueue.map(d => (
                    <div key={d.id} className={`p-3 rounded-xl border text-[11px] space-y-1.5 transition ${
                      d.status === 'Pinned' ? 'bg-amber-500/10 border-amber-500/40 text-slate-200' :
                      d.status === 'Resolved' ? 'bg-white/[0.02] border-white/5 opacity-50 text-slate-400' :
                      'bg-white/[0.03] border-white/10 text-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">{d.student}</span>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${
                            d.status === 'Pinned' ? 'bg-amber-500/20 text-amber-300' :
                            d.status === 'Resolved' ? 'bg-green-500/20 text-green-300' :
                            'bg-slate-800 text-slate-400'
                          }`}>{d.status}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{d.question}</p>
                      
                      {d.status !== 'Resolved' && (
                        <div className="flex items-center justify-end space-x-2 pt-1.5 border-t border-white/5">
                          <button
                            onClick={() => handlePinDoubt(d.id)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white font-bold text-[10px] rounded transition"
                          >
                            {d.status === 'Pinned' ? 'Unpin' : 'Pin to Screen'}
                          </button>
                          <button
                            onClick={() => handleResolveDoubt(d.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded transition flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Resolve</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {doubtsQueue.length === 0 && (
                    <div className="py-8 text-center text-slate-500 text-[11px]">No student doubts submitted yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Polls Creator & Results */}
            {rightPanelTab === 'polls' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-admin">
                {activePoll && activePoll.isActive ? (
                  /* Active Poll Display and Results graph */
                  <div className="bg-purple-500/10 border border-purple-500/30 p-3.5 rounded-xl space-y-3.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 bg-purple-500 text-white font-black rounded uppercase">Active Poll</span>
                      <span className="text-purple-300 font-bold">Collecting Student Responses</span>
                    </div>

                    <p className="font-bold text-white text-xs leading-relaxed">{activePoll.question}</p>

                    <div className="space-y-2">
                      {activePoll.options.map((opt, idx) => {
                        const totalVotes = activePoll.votes.reduce((a, b) => a + b, 0) || 1;
                        const percentage = Math.round(((activePoll.votes[idx] || 0) / totalVotes) * 100);

                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-200 font-bold">{opt}</span>
                              <span className="text-purple-300 font-bold">{percentage}% ({activePoll.votes[idx] || 0})</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleEndPoll}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition"
                      >
                        End Poll
                      </button>
                      <button
                        onClick={handleResetPoll}
                        className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Poll Creator Form */
                  <div className="space-y-3.5">
                    <span className="text-white text-xs font-black block border-b border-white/10 pb-2">Launch Classroom Quiz / Poll</span>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold">Quiz / Poll Question:</label>
                      <input
                        type="text"
                        value={pollQuestion}
                        onChange={e => setPollQuestion(e.target.value)}
                        placeholder="e.g. Rate of Interest on Loan in absence of deed?"
                        className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold">Options:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={optA}
                          onChange={e => setOptA(e.target.value)}
                          placeholder="Option A (e.g. 6% p.a.)"
                          className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={optB}
                          onChange={e => setOptB(e.target.value)}
                          placeholder="Option B (e.g. 12% p.a.)"
                          className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={optC}
                          onChange={e => setOptC(e.target.value)}
                          placeholder="Option C (Optional)"
                          className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={optD}
                          onChange={e => setOptD(e.target.value)}
                          placeholder="Option D (Optional)"
                          className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleLaunchPoll}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      Launch Poll to Students Screen 🚀
                    </button>

                    {activePoll && (
                      <div className="p-3 bg-slate-900 rounded-lg border border-white/10 text-[11px] space-y-1.5">
                        <p className="font-bold text-white">Previous Poll Result:</p>
                        <p className="text-slate-400 font-mono">Q: {activePoll.question}</p>
                        <button
                          onClick={handleResetPoll}
                          className="text-[10px] text-purple-400 font-bold hover:underline"
                        >
                          Clear Previous Results
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStudioManager;
