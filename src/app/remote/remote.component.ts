import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-remote',
  imports: [],
  templateUrl: './remote.component.html',
  styleUrl: './remote.component.css'
})
export class RemoteComponent implements OnInit{
  private socket = io("https://wevc.onrender.com");
  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection;

  async useDroidCam(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: "7e3e00ad1b229892f63668fb0d672ec40ae76bad5c48dbe8cc97709eb611f21c" }
      });

      const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
      localVideo.srcObject = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  }

  async ngOnInit() {
    // Use DroidCam or fallback to default camera
    try {
      this.localStream = await this.useDroidCam();
    } catch {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }

    const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
    localVideo.srcObject = this.localStream;

    // WebRTC Configuration
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    // Handle ICE Candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("candidate", event.candidate);
      }
    };

    // Handle Remote Stream
    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Setup signaling
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on("offer", async (offer) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit("answer", answer);
    });

    this.socket.on("answer", async (answer) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socket.on("candidate", async (candidate) => {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  async call() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit("offer", offer);
  }
}
