class PeerService {
    constructor() {
        this.peer = null;
        this.onRemoteTrackCallback = null;
        this.onIceCandidateCallback = null;
        this.remoteStream = null;
    }

    init() {
        if (this.peer) {
            this.close();
        }

        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ],
                },
            ],
        });

        this.remoteStream = new MediaStream();
        this.setupEventListeners();
        console.log('Peer connection initialized');
        return this.peer;
    }

    setupEventListeners() {
        // ICE candidate event
        this.peer.addEventListener('icecandidate', (event) => {
            if (event.candidate && this.onIceCandidateCallback) {
                console.log('New ICE candidate:', event.candidate);
                this.onIceCandidateCallback(event.candidate);
            }
        });

        // Track event - FIXED: Properly handle incoming tracks
        this.peer.addEventListener('track', (event) => {
            console.log('Track event received:', event.track.kind, event.streams);
            
            // Add track to our remote stream
            if (event.track) {
                this.remoteStream.addTrack(event.track);
                console.log('Track added to remote stream');
            }

            // Notify callback if we have streams
            if (event.streams && event.streams.length > 0 && this.onRemoteTrackCallback) {
                console.log('Calling remote track callback with stream');
                this.onRemoteTrackCallback(event.streams[0]);
            } else if (this.remoteStream && this.onRemoteTrackCallback) {
                console.log('Calling remote track callback with remoteStream');
                this.onRemoteTrackCallback(this.remoteStream);
            }
        });

        // Connection state monitoring
        this.peer.addEventListener('connectionstatechange', () => {
            console.log('Connection state:', this.peer.connectionState);
            if (this.peer.connectionState === 'connected') {
                console.log('Peers connected!');
            }
        });

        this.peer.addEventListener('iceconnectionstatechange', () => {
            console.log('ICE connection state:', this.peer.iceConnectionState);
        });
    }

    async getAnswer(offer) {
        if (!this.peer) {
            this.init();
        }
        
        try {
            console.log('Creating answer for offer');
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            console.log('Answer created successfully');
            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    }

    async setLocalDescription(answer) {
        if (!this.peer) {
            console.error('Peer connection not initialized');
            return;
        }
        
        try {
            console.log('Setting remote description (answer)');
            await this.peer.setRemoteDescription(answer);
            console.log('Remote description set successfully');
        } catch (error) {
            console.error('Error setting remote description:', error);
            throw error;
        }
    }

    async getOffer() {
        if (!this.peer) {
            this.init();
        }
        
        try {
            console.log('Creating offer');
            const offer = await this.peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await this.peer.setLocalDescription(offer);
            console.log('Offer created successfully');
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    async addIceCandidate(candidate) {
        if (!this.peer) {
            console.error('Peer connection not initialized');
            return;
        }
        
        try {
            await this.peer.addIceCandidate(candidate);
            console.log('ICE candidate added successfully');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }

    // Add local stream to peer connection
    addStream(stream) {
        if (!this.peer) {
            console.error('Peer connection not initialized');
            return;
        }
        
        console.log('Adding local stream to peer connection');
        
        // Clear existing senders
        this.peer.getSenders().forEach(sender => {
            this.peer.removeTrack(sender);
        });

        // Add all tracks from the stream
        stream.getTracks().forEach(track => {
            this.peer.addTrack(track, stream);
        });
    }

    // Get the remote stream
    getRemoteStream() {
        return this.remoteStream;
    }

    // Set callback for remote tracks
    setOnRemoteTrack(callback) {
        this.onRemoteTrackCallback = callback;
    }

    // Set callback for ICE candidates
    setOnIceCandidate(callback) {
        this.onIceCandidateCallback = callback;
    }

    // Clean up
    close() {
        if (this.peer) {
            this.peer.close();
            this.peer = null;
        }
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
            this.remoteStream = null;
        }
        console.log('Peer connection closed');
    }
}

export default new PeerService();