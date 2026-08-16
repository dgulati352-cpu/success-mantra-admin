/**
 * webrtcBroadcaster.js
 * Admin-side WebRTC broadcaster.
 * Writes SDP offer + ICE candidates to Firestore live/webrtcSession.
 * Watches for viewer answers and connects each viewer.
 */

import {
  doc,
  setDoc,
  onSnapshot,
  collection,
} from 'firebase/firestore';
import { db } from './firebase';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export class BroadcastSession {
  constructor(mediaStream, onViewerCountChange) {
    this.stream = mediaStream;
    this.onViewerCountChange = onViewerCountChange || (() => {});
    this.pcs = {}; // viewerId -> RTCPeerConnection
    this.unsubAnswers = null;
    this.sessionDocRef = doc(db, 'live', 'webrtcSession');
    this.answersColRef = collection(db, 'live', 'webrtcSession', 'answers');
    this.offerPc = null;
  }

  async start() {
    const offerPc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.offerPc = offerPc;

    this.stream.getTracks().forEach((track) => {
      offerPc.addTrack(track, this.stream);
    });

    const iceCandidates = [];
    offerPc.onicecandidate = (e) => {
      if (e.candidate) iceCandidates.push(e.candidate.toJSON());
    };

    const offer = await offerPc.createOffer({ offerToReceiveVideo: false, offerToReceiveAudio: false });
    await offerPc.setLocalDescription(offer);

    // Wait for ICE gathering (max 5s)
    await new Promise((resolve) => {
      if (offerPc.iceGatheringState === 'complete') return resolve();
      offerPc.onicegatheringstatechange = () => {
        if (offerPc.iceGatheringState === 'complete') resolve();
      };
      setTimeout(resolve, 5000);
    });

    await setDoc(this.sessionDocRef, {
      offer: offerPc.localDescription.toJSON(),
      iceCandidates,
      active: true,
      startedAt: Date.now(),
    });

    // Watch for viewer answers
    this.unsubAnswers = onSnapshot(this.answersColRef, async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === 'added') {
          const viewerId = change.doc.id;
          const data = change.doc.data();
          if (data.answer && !this.pcs[viewerId]) {
            await this._connectViewer(viewerId, data);
          }
        }
        if (change.type === 'removed') {
          const viewerId = change.doc.id;
          if (this.pcs[viewerId]) {
            this.pcs[viewerId].close();
            delete this.pcs[viewerId];
          }
        }
      }
      this.onViewerCountChange(Object.keys(this.pcs).length);
    });
  }

  async _connectViewer(viewerId, data) {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.pcs[viewerId] = pc;

    this.stream.getTracks().forEach((track) => pc.addTrack(track, this.stream));

    await pc.setRemoteDescription(new RTCSessionDescription(data.answer));

    if (data.iceCandidates) {
      for (const c of data.iceCandidates) {
        await pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        pc.close();
        delete this.pcs[viewerId];
        this.onViewerCountChange(Object.keys(this.pcs).length);
      }
    };
  }

  async stop() {
    if (this.unsubAnswers) this.unsubAnswers();
    Object.values(this.pcs).forEach((pc) => pc.close());
    this.pcs = {};
    if (this.offerPc) this.offerPc.close();
    await setDoc(this.sessionDocRef, { active: false, offer: null, iceCandidates: [] }).catch(() => {});
  }
}
