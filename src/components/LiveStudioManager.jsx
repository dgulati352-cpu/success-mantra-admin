import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Video,
  Plus,
  Users,
  MessageSquare,
  Pin,
  CheckCircle2,
  Clock,
  Play,
  Square,
  ShieldCheck,
  Sparkles,
  Key,
  Radio,
  Send,
  Camera,
  Mic,
  MicOff,
  Monitor,
  Volume2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const LiveStudioManager = () => {
  const {
    liveClasses,
    toggleLiveStatus,
    resolveDoubt,
    openModal,
    showToast
  } = useAdmin();

  // Tab State: 'All', 'LIVE NOW', 'Upcoming', 'Ended'
  const [activeLiveTab, setActiveLiveTab] = useState('All');
  const [selectedLiveStreamId, setSelectedLiveStreamId] = useState(
    liveClasses.find((l) => l.status === 'LIVE NOW')?.id || liveClasses[0]?.id
  );

  // Broadcast Studio Controls State
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [streamTimer, setStreamTimer] = useState(1420); // seconds

  // Live Timer tick when stream is LIVE NOW
  useEffect(() => {
    const selected = liveClasses.find((l) => l.id === selectedLiveStreamId);
    let interval;
    if (selected && selected.status === 'LIVE NOW') {
      interval = setInterval(() => {
        setStreamTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedLiveStreamId, liveClasses]);

  const formatTimer = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const counts = {
    All: liveClasses.length,
    'LIVE NOW': liveClasses.filter((l) => l.status === 'LIVE NOW').length,
    Upcoming: liveClasses.filter((l) => l.status === 'Upcoming').length,
    Ended: liveClasses.filter((l) => l.status === 'Ended').length,
  };

  const filteredStreams = liveClasses.filter((l) => {
    if (activeLiveTab === 'All') return true;
    return l.status === activeLiveTab;
  });

  const selectedStream =
    liveClasses.find((l) => l.id === selectedLiveStreamId) ||
    filteredStreams[0] ||
    liveClasses[0];

  const handleGoLiveToggle = (streamId, targetStatus) => {
    toggleLiveStatus(streamId, targetStatus);
    if (targetStatus === 'LIVE NOW') {
      setActiveLiveTab('LIVE NOW');
      setSelectedLiveStreamId(streamId);
      showToast(`⚡ Broadcast is now LIVE! Streaming to student portal.`, 'success');
    } else {
      showToast(`Broadcast ended successfully and saved to course archive.`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-rose-400 font-bold mb-1">
            <Radio className="w-4 h-4 animate-pulse text-rose-500" />
            <span>Interactive Live Studio & Doubt Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white">Live Studio 2-Teacher Control Desk</h2>
          <p className="text-xs text-slate-400 mt-1">
            BYJU'S 2-Teacher Advantage: 1 Master Teacher explaining live + 1 Assistant Teacher resolving individual doubt queries live.
          </p>
        </div>

        <button
          onClick={() => openModal('liveClass')}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* Main Grid: Stream Selector + Interactive Studio & Doubts Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stream List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            {['All', 'LIVE NOW', 'Upcoming', 'Ended'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveLiveTab(status)}
                className={`flex-1 py-2 font-extrabold rounded-xl transition flex items-center justify-center space-x-1 ${
                  activeLiveTab === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    status === 'LIVE NOW' && counts[status] > 0
                      ? 'bg-rose-500 text-white animate-pulse'
                      : activeLiveTab === status
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>

          {/* List of Streams */}
          <div className="space-y-3">
            {filteredStreams.length > 0 ? (
              filteredStreams.map((stream) => {
                const isSelected = stream.id === selectedStream?.id;

                return (
                  <div
                    key={stream.id}
                    onClick={() => setSelectedLiveStreamId(stream.id)}
                    className={`p-5 rounded-3xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-blue-500/80 ring-1 ring-blue-500/40 shadow-xl'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded border border-blue-500/30">
                        {stream.subject} • {stream.classLevel}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${
                          stream.status === 'LIVE NOW'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : stream.status === 'Upcoming'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {stream.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm leading-snug">{stream.title}</h4>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                      <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                        <Users className="w-3.5 h-3.5" />
                        <span>{stream.currentViewers} Watching</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{stream.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">
                  No streams found in "{activeLiveTab}" tab.
                </p>
                <button
                  onClick={() => setActiveLiveTab('All')}
                  className="px-4 py-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold transition"
                >
                  View All Streams ({liveClasses.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Studio Broadcast Player & Live Doubts Queue */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {selectedStream ? (
            <>
              {/* Top Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-bold text-xs rounded border border-blue-500/30">
                      {selectedStream.subject} ({selectedStream.classLevel})
                    </span>
                    <span className="text-xs text-slate-400">Master: <strong className="text-white">{selectedStream.instructor}</strong></span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{selectedStream.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedStream.status === 'LIVE NOW' ? (
                    <button
                      onClick={() => handleGoLiveToggle(selectedStream.id, 'Ended')}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center space-x-2 transition"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>End Live Stream</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGoLiveToggle(selectedStream.id, 'LIVE NOW')}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition transform hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Go LIVE NOW</span>
                    </button>
                  )}
                </div>
              </div>

              {/* LIVE STUDIO BROADCAST VIDEO PREVIEW PLAYER */}
              <div className="relative aspect-video rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl group">
                {selectedStream.status === 'LIVE NOW' ? (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
                      alt="Live Broadcast Preview"
                      className={`w-full h-full object-cover opacity-80 ${!isCameraOn ? 'filter blur-md' : ''}`}
                    />

                    {/* Live Stream Overlay Top */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-lg shadow-md flex items-center space-x-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white"></span>
                          <span>LIVE</span>
                        </span>
                        <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono text-xs rounded-lg border border-slate-800">
                          {formatTimer(streamTimer)}
                        </span>
                      </div>

                      <div className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-slate-800 flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>{selectedStream.currentViewers} Students Online</span>
                      </div>
                    </div>

                    {/* Live Watermark Center / Faculty Banner */}
                    <div className="absolute bottom-16 left-4 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-xs text-white max-w-xs space-y-0.5 shadow-lg">
                      <p className="font-black text-amber-400">{selectedStream.instructor}</p>
                      <p className="text-[11px] text-slate-300">Live Accountancy: Partnership Deed & Goodwill</p>
                    </div>

                    {/* Interactive Studio Broadcast Controls Bottom Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setIsCameraOn(!isCameraOn)}
                          className={`p-2 rounded-xl transition ${isCameraOn ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'}`}
                          title={isCameraOn ? 'Disable Camera' : 'Enable Camera'}
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsMicOn(!isMicOn)}
                          className={`p-2 rounded-xl transition ${isMicOn ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'}`}
                          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                        >
                          {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setIsScreenSharing(!isScreenSharing)}
                          className={`p-2 rounded-xl transition ${isScreenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
                          title="Share Screen"
                        >
                          <Monitor className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                        <span className="text-emerald-400 font-bold">1080p HD • 60 FPS</span>
                        <span>Key: {selectedStream.streamKey}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Offline / Standby Studio Preview */
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                      <Radio className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Studio Standby Mode</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        Stream Key: <code className="text-amber-400">{selectedStream.streamKey}</code>. Click "Go LIVE NOW" to start studio broadcast.
                      </p>
                    </div>
                    <button
                      onClick={() => handleGoLiveToggle(selectedStream.id, 'LIVE NOW')}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Live Broadcast</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Technical Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">RTMP Stream Key</span>
                  <span className="font-mono text-amber-300 font-semibold">{selectedStream.streamKey}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Assistant Faculty (Doubts)</span>
                  <span className="text-amber-400 font-bold">{selectedStream.assistantTeacher}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Studio Health</span>
                  <span className="text-emerald-400 font-bold">Excellent Signal • 4500 kbps</span>
                </div>
              </div>

              {/* 2-Teacher Doubt Queue Moderator Console */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-black text-white">Live Student Doubts Queue</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    {selectedStream.doubtsQueue.length} Active Doubts Pending
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {selectedStream.doubtsQueue.length > 0 ? (
                    selectedStream.doubtsQueue.map((doubt) => (
                      <div
                        key={doubt.id}
                        className={`p-4 rounded-2xl border transition space-y-2 ${
                          doubt.status === 'Pinned'
                            ? 'bg-amber-500/10 border-amber-500/40 text-slate-200'
                            : doubt.status === 'Resolved'
                            ? 'bg-slate-950/60 border-slate-800 opacity-60 text-slate-400'
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <strong className="text-white">{doubt.student}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">{doubt.time}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              doubt.status === 'Pinned'
                                ? 'bg-amber-500/20 text-amber-300'
                                : doubt.status === 'Resolved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {doubt.status}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed">{doubt.question}</p>

                        <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800/80">
                          {doubt.status !== 'Resolved' && (
                            <button
                              onClick={() => resolveDoubt(selectedStream.id, doubt.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Answer & Resolve</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                      No unanswered student doubts in queue right now.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">Select a live stream to moderate doubts</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveStudioManager;
