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
  ThumbsUp,
  Share2,
  Settings,
  AlertCircle,
  MoreVertical,
  Bell,
  ChevronDown,
  Radio,
  Eye,
  Signal,
  Wifi,
  Zap,
  Pin,
  Gift,
  Laugh,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  ScreenShare,
  ScreenShareOff,
} from 'lucide-react';

/* ── Inline SVG Icons ──────────────────────────────────────────── */
const YTLogo = () => (
  <svg viewBox="0 0 28 20" width="28" height="20" fill="none">
    <rect width="28" height="20" rx="4" fill="#FF0000" />
    <polygon points="11,5.5 11,14.5 20,10" fill="white" />
  </svg>
);

const SuperChatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
    <path d="M12 15l-4-4h8l-4 4zm0-6 4 4H8l4-4z" />
  </svg>
);

/* ── Formatters ─────────────────────────────────────────────────── */
const fmtTime = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};
const fmtNum = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

/* ── Color palette for chat avatars ──────────────────────────────── */
const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
];
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ── EMOJIS for live reaction bar ─────────────────────────────────── */
const REACTIONS = ['👍', '🔥', '❤️', '😮', '🙏', '💯', '👏', '🎉'];

/* ── Floating reaction particles ─────────────────────────────────── */
const FloatingReaction = ({ emoji, id, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  const left = 10 + Math.random() * 80;
  return (
    <div
      key={id}
      className="absolute bottom-8 text-2xl pointer-events-none select-none z-30"
      style={{
        left: `${left}%`,
        animation: 'floatUp 3.5s ease-out forwards',
      }}
    >
      {emoji}
    </div>
  );
};

/* ── STREAM QUALITY BADGE ──────────────────────────────────────────── */
const QualityBadge = ({ quality }) => {
  const map = {
    'HD 1080p': { color: 'text-emerald-400', icon: <Wifi className="w-3 h-3" /> },
    'HD 720p': { color: 'text-blue-400', icon: <Signal className="w-3 h-3" /> },
    'SD 480p': { color: 'text-amber-400', icon: <Signal className="w-3 h-3" /> },
  };
  const cfg = map[quality] || map['HD 720p'];
  return (
    <div className={`flex items-center space-x-1 text-[10px] font-bold ${cfg.color}`}>
      {cfg.icon}
      <span>{quality}</span>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
/*  Main Component                                                    */
/* ══════════════════════════════════════════════════════════════════ */
const LiveStudioManager = () => {
  const { liveClasses, toggleLiveStatus, resolveDoubt, openModal, showToast } = useAdmin();

  /* Stream selection */
  const [activeTab, setActiveTab] = useState('All');
  const [selectedId, setSelectedId] = useState(
    liveClasses.find((l) => l.status === 'LIVE NOW')?.id || liveClasses[0]?.id
  );
  const stream = liveClasses.find((l) => l.id === selectedId) || liveClasses[0];

  /* Camera / Mic / Screen state */
  const [camOn, setCamOn]     = useState(false);
  const [micOn, setMicOn]     = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [quality, setQuality] = useState('HD 1080p');

  /* Timer */
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    let iv;
    if (stream?.status === 'LIVE NOW') iv = setInterval(() => setTimer(t => t + 1), 1000);
    else setTimer(0);
    return () => clearInterval(iv);
  }, [stream?.status]);

  /* Likes */
  const [likes, setLikes] = useState(stream?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [viewerCount, setViewerCount] = useState(stream?.currentViewers || 0);

  /* Simulate viewers growing */
  useEffect(() => {
    let iv;
    if (stream?.status === 'LIVE NOW') {
      iv = setInterval(() => {
        setViewerCount(v => v + Math.floor(Math.random() * 12) - 3);
      }, 3000);
    }
    return () => clearInterval(iv);
  }, [stream?.status]);

  /* Reactions */
  const [reactions, setReactions] = useState([]);
  const addReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setReactions(r => [...r, { id, emoji }]);
  };
  const removeReaction = useCallback((id) => {
    setReactions(r => r.filter(x => x.id !== id));
  }, []);

  /* Chat */
  const [chatMessages, setChatMessages] = useState([
    { id: 'c1', name: 'Dhairya Gulati',  role: 'OWNER',   text: 'Good evening! Partnership Deed masterclass starts NOW.', time: '18:24', pinned: false, superChat: false },
    { id: 'c2', name: 'Ananya Sharma',   role: 'MEMBER',  text: 'Sir please explain Interest on Capital rule 🙏', time: '18:25', pinned: false, superChat: false },
    { id: 'c3', name: 'Rohan Kapoor',    role: 'STUDENT', text: 'Is this recorded for the app later?', time: '18:26', pinned: false, superChat: false },
    { id: 'c4', name: 'CA Ritu Verma',   role: 'MOD',     text: '📌 Doubt desk is active. Ask your questions!', time: '18:27', pinned: true,  superChat: false },
    { id: 'c5', name: 'Priya Malhotra',  role: 'MEMBER',  text: '🔥 Best Commerce teacher on YouTube!', time: '18:28', pinned: false, superChat: true },
    { id: 'c6', name: 'Aarav Verma',     role: 'STUDENT', text: 'Sir chapter 3 question 14 is confusing', time: '18:29', pinned: false, superChat: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [chatMode, setChatMode] = useState('top'); // 'top' | 'live'
  const chatRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* Auto-scroll chat */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  /* Simulate incoming live chat messages */
  useEffect(() => {
    if (stream?.status !== 'LIVE NOW') return;
    const names = ['Kabir Mehta', 'Sanya Gupta', 'Dev Roy', 'Mehak Jain', 'Aryan Singh', 'Nisha Patel', 'Raj Kumar'];
    const msgs  = [
      'Super clear explanation sir! 🔥', 'Can we write goodwill directly in journal?',
      'T.S. Grewal Q14 solved!', 'Loved the BYJU\'s 2-teacher model!',
      'Is this CUET 2026 relevant? 🙏', '100K subs incoming! 🎉',
      'Sir speed thoda slow karo 😅', 'Notes milenge PDF mein?',
      '❤️ ❤️ ❤️', 'First time watching – Amazing quality!',
    ];
    const iv = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const text = msgs[Math.floor(Math.random() * msgs.length)];
      const isSuper = Math.random() > 0.85;
      setChatMessages(prev => [...prev.slice(-50), {
        id: `c-${Date.now()}`,
        name, role: 'STUDENT', text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pinned: false,
        superChat: isSuper,
      }]);
      if (Math.random() > 0.7) addReaction(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    }, 3800);
    return () => clearInterval(iv);
  }, [stream?.status]);

  /* ── Camera / Screen share ────────────────────────────────────── */
  const startCamera = async () => {
    try {
      setMediaError(null);
      const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
      streamRef.current = ms;
      if (videoRef.current) { videoRef.current.srcObject = ms; videoRef.current.play(); }
      setCamOn(true);
    } catch {
      setMediaError('Camera permission denied. Please allow camera access.');
    }
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
    } catch { /* user cancelled */ }
  };

  const stopScreen = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setScreenOn(false);
  };

  /* ── Go Live ──────────────────────────────────────────────────── */
  const goLive = async (targetStatus) => {
    if (targetStatus === 'LIVE NOW') {
      await startCamera();
      toggleLiveStatus(stream.id, 'LIVE NOW');
      setActiveTab('LIVE NOW');
      showToast('🔴 You are now LIVE!', 'success');
    } else {
      stopCamera();
      stopScreen();
      toggleLiveStatus(stream.id, 'Ended');
      showToast('Stream ended & archived.', 'info');
    }
  };

  /* ── Chat send ───────────────────────────────────────────────── */
  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: `c-${Date.now()}`, name: 'Dhairya Gulati (Admin)',
      role: 'OWNER', text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: false, superChat: false,
    }]);
    setChatInput('');
  };

  /* ── Filtered stream list ─────────────────────────────────────── */
  const counts = {
    All: liveClasses.length,
    'LIVE NOW': liveClasses.filter(l => l.status === 'LIVE NOW').length,
    Upcoming: liveClasses.filter(l => l.status === 'Upcoming').length,
    Ended: liveClasses.filter(l => l.status === 'Ended').length,
  };
  const filtered = liveClasses.filter(l => activeTab === 'All' || l.status === activeTab);

  /* ── Role label colours ──────────────────────────────────────── */
  const roleCfg = {
    OWNER:   { label: '⚙️ Owner',   cls: 'text-amber-400 font-black' },
    MOD:     { label: '🛡️ Mod',     cls: 'text-green-400 font-bold'  },
    MEMBER:  { label: '🏅 Member',  cls: 'text-blue-300 font-semibold'},
    STUDENT: { label: '',            cls: 'text-slate-400'             },
  };

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-full space-y-0 pb-8">
      {/* ─── CSS keyframe injection ─── */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1);   opacity: 1; }
          80%  { transform: translateY(-160px) scale(1.3); opacity: 0.8; }
          100% { transform: translateY(-200px) scale(0.8); opacity: 0; }
        }
        @keyframes superChatSlide {
          from { transform: translateY(-12px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .super-chat-in { animation: superChatSlide 0.35s ease; }
        .scrollbar-yt::-webkit-scrollbar { width: 4px; }
        .scrollbar-yt::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-yt::-webkit-scrollbar-thumb { background: #374151; border-radius: 99px; }
      `}</style>

      {/* ══════════════ TOP STREAM SELECTOR TABS ══════════════════ */}
      <div className="flex items-center justify-between px-1 pb-5">
        <div className="flex items-center space-x-1.5">
          <YTLogo />
          <span className="text-white font-black text-lg tracking-tight ml-2">Live Studio</span>
          {stream?.status === 'LIVE NOW' && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded flex items-center space-x-1 animate-pulse ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span><span>LIVE</span>
            </span>
          )}
        </div>
        <button
          onClick={() => openModal('liveClass')}
          className="px-4 py-2 bg-white text-slate-950 font-black text-xs rounded-full hover:bg-slate-200 flex items-center space-x-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> <span>Schedule Stream</span>
        </button>
      </div>

      {/* ══════════════ MAIN LAYOUT ═══════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[620px]">

        {/* ── LEFT: Stream List ─────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col space-y-3">
          {/* Tab pills */}
          <div className="flex space-x-1 bg-[#0f0f0f] p-1 rounded-xl border border-white/10 text-[11px]">
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
                {t === 'All' ? `All (${counts[t]})` : `${t.split(' ')[0]} ${counts[t]}`}
              </button>
            ))}
          </div>

          {/* Stream cards */}
          <div className="space-y-2.5 overflow-y-auto max-h-[580px] scrollbar-yt pr-0.5">
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition group ${
                  s.id === selectedId
                    ? 'bg-white/5 border-red-500/60 ring-1 ring-red-500/30'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                {/* Thumbnail strip */}
                <div className="relative w-full h-20 rounded-xl bg-slate-900 overflow-hidden mb-2.5">
                  <div className={`absolute inset-0 flex items-center justify-center ${
                    s.status === 'LIVE NOW' ? 'bg-gradient-to-br from-red-900/60 to-slate-900' : 'bg-slate-900'
                  }`}>
                    {s.status === 'LIVE NOW'
                      ? <div className="flex flex-col items-center space-y-1">
                          <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center animate-pulse">
                            <Radio className="w-4 h-4 text-red-400" />
                          </div>
                        </div>
                      : s.status === 'Ended'
                      ? <Play className="w-7 h-7 text-slate-600" />
                      : <Clock className="w-6 h-6 text-slate-600" />
                    }
                  </div>
                  <div className="absolute top-1.5 left-1.5 flex items-center space-x-1">
                    <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${
                      s.status === 'LIVE NOW' ? 'bg-red-600 text-white' :
                      s.status === 'Upcoming' ? 'bg-amber-500 text-slate-950' :
                      'bg-slate-700 text-slate-300'
                    }`}>{s.status}</span>
                  </div>
                  {s.status === 'LIVE NOW' && (
                    <div className="absolute bottom-1.5 right-1.5 flex items-center space-x-1 bg-slate-950/80 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                      <Eye className="w-2.5 h-2.5 text-red-400" />
                      <span>{fmtNum(s.currentViewers)}</span>
                    </div>
                  )}
                </div>

                <p className="text-white text-[11px] font-bold leading-snug line-clamp-2">{s.title}</p>
                <p className="text-slate-400 text-[10px] mt-1">{s.instructor} · {s.scheduledTime}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTRE: YouTube-style Video Player ───────────────── */}
        <div className="lg:col-span-6 flex flex-col space-y-3">

          {/* ─── Video Player Box ─────────────────────────────── */}
          <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
               style={{ aspectRatio: '16/9' }}>

            {/* Video element (webcam / screen) */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${camOn || screenOn ? '' : 'hidden'}`}
            />

            {/* Standby / Idle overlay */}
            {!camOn && !screenOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f0f] space-y-5">
                {stream?.status === 'LIVE NOW' ? (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-red-600/15 border border-red-500/40 flex items-center justify-center mx-auto animate-pulse">
                      <Radio className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-white font-bold text-sm">Camera off — stream is live</p>
                    <p className="text-slate-400 text-xs">Enable camera or screen share to broadcast video</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4 px-8">
                    <YTLogo />
                    <div>
                      <p className="text-white font-black text-lg mt-3">Ready to go live?</p>
                      <p className="text-slate-400 text-xs mt-1">Enable your camera or screen share, then click <strong className="text-red-400">Go Live</strong></p>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-full flex items-center space-x-2 transition"
                      >
                        <Camera className="w-3.5 h-3.5" /> <span>Enable Camera</span>
                      </button>
                      <button
                        onClick={startScreen}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-full flex items-center space-x-2 transition"
                      >
                        <ScreenShare className="w-3.5 h-3.5" /> <span>Share Screen</span>
                      </button>
                    </div>
                    {mediaError && (
                      <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-xl">{mediaError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* LIVE badges overlaid on top-left */}
            {stream?.status === 'LIVE NOW' && (
              <div className="absolute top-3 left-3 flex items-center space-x-2 z-20">
                <div className="flex items-center space-x-1.5 bg-red-600 text-white px-2.5 py-1 rounded text-[11px] font-black animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>LIVE</span>
                </div>
                <div className="bg-slate-950/80 backdrop-blur text-white px-2 py-1 rounded text-[11px] font-mono font-bold">
                  {fmtTime(timer)}
                </div>
              </div>
            )}

            {/* Top-right: viewer count & quality */}
            {stream?.status === 'LIVE NOW' && (
              <div className="absolute top-3 right-3 flex items-center space-x-2 z-20">
                <div className="bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded text-[11px] font-bold text-white flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-red-400" />
                  <span>{fmtNum(viewerCount)} watching</span>
                </div>
                <div className="bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded">
                  <QualityBadge quality={quality} />
                </div>
              </div>
            )}

            {/* Floating emoji reactions */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
              {reactions.map(r => (
                <FloatingReaction
                  key={r.id}
                  id={r.id}
                  emoji={r.emoji}
                  onDone={() => removeReaction(r.id)}
                />
              ))}
            </div>
          </div>

          {/* ─── Title + description row (YouTube style) ───────── */}
          <div className="space-y-2.5">
            <h2 className="text-white font-black text-base leading-snug">{stream?.title}</h2>
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* Left: channel info */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  SM
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Success Mantra</p>
                  <p className="text-slate-400 text-xs">45.8K subscribers</p>
                </div>
                <button className="px-4 py-1.5 bg-white text-slate-950 font-black text-xs rounded-full hover:bg-slate-200 transition">
                  Subscribe
                </button>
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center space-x-2">
                {/* Like / Dislike pill */}
                <div className="flex items-center bg-white/10 border border-white/15 rounded-full overflow-hidden text-xs font-bold">
                  <button
                    onClick={() => {
                      setLiked(l => !l);
                      setLikes(n => liked ? n - 1 : n + 1);
                      if (!liked) addReaction('👍');
                    }}
                    className={`flex items-center space-x-1.5 px-4 py-2 transition hover:bg-white/10 ${liked ? 'text-blue-400' : 'text-white'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{fmtNum(likes)}</span>
                  </button>
                  <div className="w-px h-5 bg-white/20"></div>
                  <button className="px-3 py-2 text-white hover:bg-white/10 transition">
                    <ThumbsUp className="w-4 h-4 rotate-180" />
                  </button>
                </div>

                <button
                  onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('Stream link copied!', 'info'); }}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-white/10 border border-white/15 text-white text-xs font-bold rounded-full hover:bg-white/15 transition"
                >
                  <Share2 className="w-3.5 h-3.5" /> <span>Share</span>
                </button>

                <button className="p-2 bg-white/10 border border-white/15 text-white rounded-full hover:bg-white/15 transition">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stream description card */}
            <div className="bg-white/[0.05] border border-white/10 rounded-xl p-3 text-xs text-slate-300 space-y-1">
              <div className="flex items-center space-x-3 font-bold text-white">
                <span className="text-red-400">{fmtNum(viewerCount)} watching now</span>
                <span className="text-slate-500">·</span>
                <span>{stream?.scheduledTime}</span>
                <span className="text-slate-500">·</span>
                <span>{stream?.classLevel} {stream?.subject}</span>
              </div>
              <p className="text-slate-400">RTMP Ingestion Key: <span className="font-mono text-amber-300">{stream?.streamKey}</span></p>
            </div>
          </div>

          {/* ─── Broadcast Control Bar ───────────────────────── */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: device toggles */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => camOn ? stopCamera() : startCamera()}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  camOn ? 'bg-white text-slate-950' : 'bg-white/10 border border-white/15 text-slate-300 hover:text-white'
                }`}
              >
                {camOn ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
                <span>{camOn ? 'Cam ON' : 'Cam OFF'}</span>
              </button>

              <button
                onClick={() => setMicOn(m => !m)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  micOn ? 'bg-white text-slate-950' : 'bg-white/10 border border-white/15 text-slate-300 hover:text-white'
                }`}
              >
                {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{micOn ? 'Mic ON' : 'Mic OFF'}</span>
              </button>

              <button
                onClick={() => screenOn ? stopScreen() : startScreen()}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  screenOn ? 'bg-blue-600 text-white' : 'bg-white/10 border border-white/15 text-slate-300 hover:text-white'
                }`}
              >
                {screenOn ? <ScreenShareOff className="w-3.5 h-3.5" /> : <ScreenShare className="w-3.5 h-3.5" />}
                <span>{screenOn ? 'Stop Share' : 'Share Screen'}</span>
              </button>

              {/* Quality select */}
              <select
                value={quality}
                onChange={e => setQuality(e.target.value)}
                className="px-2 py-2 bg-white/10 border border-white/15 text-slate-300 text-xs rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option>HD 1080p</option>
                <option>HD 720p</option>
                <option>SD 480p</option>
              </select>
            </div>

            {/* Right: Go Live button */}
            {stream?.status === 'LIVE NOW' ? (
              <button
                onClick={() => goLive('Ended')}
                className="flex items-center space-x-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-black text-xs rounded-xl transition"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>End Stream</span>
              </button>
            ) : (
              <button
                onClick={() => goLive('LIVE NOW')}
                className="flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/30 transition transform hover:scale-105"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Go Live</span>
              </button>
            )}
          </div>

          {/* ─── Emoji Reaction Bar ──────────────────────────── */}
          <div className="flex items-center space-x-2">
            {REACTIONS.map(e => (
              <button
                key={e}
                onClick={() => addReaction(e)}
                className="text-xl hover:scale-125 transition-transform"
                title={`React ${e}`}
              >
                {e}
              </button>
            ))}
            <span className="text-slate-600 text-xs ml-auto">Click to react live ↑</span>
          </div>
        </div>

        {/* ── RIGHT: YouTube Live Chat Panel ───────────────────── */}
        <div className="lg:col-span-3 flex flex-col bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden"
             style={{ maxHeight: '640px' }}>

          {/* Chat header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-white font-black text-sm">Live Chat</span>
              {stream?.status === 'LIVE NOW' && (
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <button
                onClick={() => setChatMode('top')}
                className={`px-2 py-0.5 rounded ${chatMode === 'top' ? 'bg-white/10 text-white' : 'hover:text-white'}`}
              >Top</button>
              <button
                onClick={() => setChatMode('live')}
                className={`px-2 py-0.5 rounded ${chatMode === 'live' ? 'bg-white/10 text-white' : 'hover:text-white'}`}
              >Live</button>
            </div>
          </div>

          {/* Super Chat pinned */}
          {chatMessages.some(m => m.superChat) && (
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 flex-shrink-0">
              <p className="text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">💛 Super Chat</p>
              {chatMessages.filter(m => m.superChat).slice(-1).map(m => (
                <p key={m.id} className="text-white text-xs super-chat-in">
                  <span className="font-bold">{m.name}</span>: {m.text}
                </p>
              ))}
            </div>
          )}

          {/* Pinned message */}
          {chatMessages.some(m => m.pinned) && (
            <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20 flex items-start space-x-2 flex-shrink-0">
              <Pin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-300 text-[10px] font-bold">Pinned by moderator</p>
                <p className="text-white text-xs">{chatMessages.find(m => m.pinned)?.text}</p>
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-yt">
            {chatMessages.filter(m => !m.superChat || chatMode === 'live').map(m => (
              <div key={m.id} className={`flex items-start space-x-2 ${m.superChat ? 'super-chat-in' : ''}`}>
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 mt-0.5"
                  style={{ background: avatarColor(m.name) }}
                >
                  {m.name[0]}
                </div>
                {/* Bubble */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-1.5 flex-wrap">
                    <span className={`text-[11px] font-bold ${roleCfg[m.role]?.cls || 'text-slate-400'}`}>
                      {m.name}
                    </span>
                    {roleCfg[m.role]?.label && (
                      <span className="text-[9px] text-slate-500">{roleCfg[m.role].label}</span>
                    )}
                    <span className="text-[9px] text-slate-600">{m.time}</span>
                  </div>
                  <p className={`text-xs leading-snug mt-0.5 ${m.superChat ? 'text-amber-200' : 'text-slate-200'}`}>
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
            <form onSubmit={sendChat} className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0">
                D
              </div>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Chat..."
                className="flex-1 bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 text-white hover:text-blue-400 transition disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ══════════════ DOUBTS QUEUE BELOW ════════════════════════ */}
      <div className="mt-5 bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h4 className="text-white font-black text-sm">2-Teacher Doubt Desk</h4>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded border border-blue-500/30">
              {stream?.doubtsQueue?.filter(d => d.status !== 'Resolved').length || 0} pending
            </span>
          </div>
          <span className="text-slate-400 text-xs">Assistant: <strong className="text-emerald-400">{stream?.assistantTeacher}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(stream?.doubtsQueue || []).map(d => (
            <div key={d.id} className={`p-3.5 rounded-xl border text-xs space-y-2 ${
              d.status === 'Pinned' ? 'bg-amber-500/10 border-amber-500/40' :
              d.status === 'Resolved' ? 'bg-white/[0.02] border-white/5 opacity-50' :
              'bg-white/[0.04] border-white/10'
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
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg flex items-center justify-center space-x-1.5 transition"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Answer & Resolve</span>
                </button>
              )}
            </div>
          ))}
          {(!stream?.doubtsQueue || stream.doubtsQueue.length === 0) && (
            <div className="col-span-full py-6 text-center text-slate-500 text-xs">
              No doubts in queue. Go live to receive student questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveStudioManager;
