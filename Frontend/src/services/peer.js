// class PeerService {
//     constructor() {
//         if (!this.peer) {
//             this.peer = new RTCPeerConnection({
//                 iceServers: [
//                     {
//                         urls: [
//                             "stun:stun.l.google.com:19302",
//                             "stun:global.stun.twilio.com:3478"
//                         ],
//                     },
//                 ],
//             });
            
//             // Add connection state monitoring
//             this.peer.addEventListener('connectionstatechange', () => {
//                 console.log('Connection state:', this.peer.connectionState);
//             });
            
//             this.peer.addEventListener('iceconnectionstatechange', () => {
//                 console.log('ICE connection state:', this.peer.iceConnectionState);
//             });
//         }
//     }

//     async getAnswer(offer) {
//         if (this.peer) {
//             await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//             const answer = await this.peer.createAnswer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//             return answer;
//         }
//     }

//     async setLocalDescription(answer) {
//         if (this.peer) {
//             await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//         }
//     }

//     async getOffer() {
//         if (this.peer) {
//             const offer = await this.peer.createOffer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//             return offer;
//         }
//     }
    
//     // Clean up method
//     close() {
//         if (this.peer) {
//             this.peer.close();
//             this.peer = null;
//         }
//     }
// }

// export default new PeerService();













// class PeerService {
//     constructor() {
//         if (!this.peer) {
//             this.peer = new RTCPeerConnection({
//                 iceServers: [
//                     {
//                         urls: [
//                             "stun:stun.l.google.com:19302",
//                             "stun:global.stun.twilio.com:3478"
//                         ],
//                     },
//                 ],
//             });
            
//             // Add connection state monitoring
//             this.peer.addEventListener('connectionstatechange', () => {
//                 console.log('Connection state:', this.peer.connectionState);
//             });
            
//             this.peer.addEventListener('iceconnectionstatechange', () => {
//                 console.log('ICE connection state:', this.peer.iceConnectionState);
//             });

//             this.peer.addEventListener('icecandidate', (event) => {
//                 if (event.candidate) {
//                     console.log('New ICE candidate:', event.candidate);
//                     if (this.onIceCandidate) {
//                         this.onIceCandidate(event.candidate);
//                     }
//                 }
//             });

//             this.peer.addEventListener('track', (event) => {
//                 console.log('Received remote track:', event.track.kind);
//                 if (this.onRemoteTrack) {
//                     this.onRemoteTrack(event.streams[0]);
//                 }
//             });
//         }
//     }

//     async getAnswer(offer) {
//         if (this.peer) {
//             await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//             const answer = await this.peer.createAnswer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//             return answer;
//         }
//     }

//     async setLocalDescription(answer) {
//         if (this.peer) {
//             await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//         }
//     }

//     async getOffer() {
//         if (this.peer) {
//             const offer = await this.peer.createOffer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//             return offer;
//         }
//     }

//     async addIceCandidate(candidate) {
//         if (this.peer && this.peer.remoteDescription) {
//             await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
//         }
//     }

//     // Set callback for ICE candidates
//     setOnIceCandidate(callback) {
//         this.onIceCandidate = callback;
//     }

//     // Set callback for remote tracks
//     setOnRemoteTrack(callback) {
//         this.onRemoteTrack = callback;
//     }
    
//     // Clean up method
//     close() {
//         if (this.peer) {
//             this.peer.close();
//             this.peer = null;
//         }
//     }
// }

// export default new PeerService();














// class PeerService {
//     constructor() {
//         this.peer = null;
//         this.onRemoteTrackCallback = null;
//         this.onIceCandidateCallback = null;
//         this.init();
//     }

//     init() {
//         if (!this.peer) {
//             this.peer = new RTCPeerConnection({
//                 iceServers: [
//                     {
//                         urls: [
//                             "stun:stun.l.google.com:19302",
//                             "stun:global.stun.twilio.com:3478"
//                         ],
//                     },
//                 ],
//             });

//             // Set up event listeners
//             this.setupEventListeners();
//         }
//     }

//     setupEventListeners() {
//         // ICE candidate event
//         this.peer.addEventListener('icecandidate', (event) => {
//             if (event.candidate && this.onIceCandidateCallback) {
//                 console.log('New ICE candidate:', event.candidate);
//                 this.onIceCandidateCallback(event.candidate);
//             }
//         });

//         // Track event - THIS IS CRUCIAL FOR REMOTE VIDEO
//         this.peer.addEventListener('track', (event) => {
//             console.log('Received remote track:', event.track.kind, event.streams);
//             if (event.streams && event.streams[0] && this.onRemoteTrackCallback) {
//                 console.log('Setting remote stream via callback');
//                 this.onRemoteTrackCallback(event.streams[0]);
//             }
//         });

//         // Connection state monitoring
//         this.peer.addEventListener('connectionstatechange', () => {
//             console.log('Connection state:', this.peer.connectionState);
//         });

//         this.peer.addEventListener('iceconnectionstatechange', () => {
//             console.log('ICE connection state:', this.peer.iceConnectionState);
//         });

//         this.peer.addEventListener('signalingstatechange', () => {
//             console.log('Signaling state:', this.peer.signalingState);
//         });
//     }

//     async getAnswer(offer) {
//         try {
//             console.log('Creating answer for offer');
//             await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//             const answer = await this.peer.createAnswer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//             console.log('Answer created successfully');
//             return answer;
//         } catch (error) {
//             console.error('Error creating answer:', error);
//             throw error;
//         }
//     }

//     async setLocalDescription(answer) {
//         try {
//             console.log('Setting remote description (answer)');
//             await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//             console.log('Remote description set successfully');
//         } catch (error) {
//             console.error('Error setting remote description:', error);
//             throw error;
//         }
//     }

//     async getOffer() {
//         try {
//             console.log('Creating offer');
//             const offer = await this.peer.createOffer({
//                 offerToReceiveAudio: true,
//                 offerToReceiveVideo: true
//             });
//             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//             console.log('Offer created successfully');
//             return offer;
//         } catch (error) {
//             console.error('Error creating offer:', error);
//             throw error;
//         }
//     }

//     async addIceCandidate(candidate) {
//         try {
//             if (this.peer.remoteDescription) {
//                 await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
//                 console.log('ICE candidate added successfully');
//             }
//         } catch (error) {
//             console.error('Error adding ICE candidate:', error);
//         }
//     }

//     // Add local stream to peer connection
//     addStream(stream) {
//         if (!this.peer) return;
        
//         console.log('Adding local stream to peer connection');
//         stream.getTracks().forEach(track => {
//             this.peer.addTrack(track, stream);
//         });
//     }

//     // Set callback for remote tracks
//     setOnRemoteTrack(callback) {
//         this.onRemoteTrackCallback = callback;
//     }

//     // Set callback for ICE candidates
//     setOnIceCandidate(callback) {
//         this.onIceCandidateCallback = callback;
//     }

//     // Get peer connection state
//     getConnectionState() {
//         return this.peer ? this.peer.connectionState : 'closed';
//     }

//     // Clean up
//     close() {
//         if (this.peer) {
//             this.peer.close();
//             this.peer = null;
//         }
//     }
// }

// // Export a new instance
// export default new PeerService();















// class PeerService {
//     constructor() {
//         this.peer = null;
//         this.onRemoteTrackCallback = null;
//         this.onIceCandidateCallback = null;
//         // Don't auto-init, we'll init when needed
//     }

//     init() {
//         if (this.peer) {
//             this.close();
//         }

//         this.peer = new RTCPeerConnection({
//             iceServers: [
//                 {
//                     urls: [
//                         "stun:stun.l.google.com:19302",
//                         "stun:global.stun.twilio.com:3478"
//                     ],
//                 },
//             ],
//         });

//         // Set up event listeners
//         this.setupEventListeners();
//         console.log('Peer connection initialized');
//     }

//     setupEventListeners() {
//         // ICE candidate event
//         this.peer.addEventListener('icecandidate', (event) => {
//             if (event.candidate && this.onIceCandidateCallback) {
//                 console.log('New ICE candidate:', event.candidate);
//                 this.onIceCandidateCallback(event.candidate);
//             }
//         });

//         // Track event - THIS IS CRUCIAL FOR REMOTE VIDEO
//         this.peer.addEventListener('track', (event) => {
//             console.log('Received remote track:', event.track.kind, event.streams);
//             if (event.streams && event.streams[0] && this.onRemoteTrackCallback) {
//                 console.log('Setting remote stream via callback');
//                 this.onRemoteTrackCallback(event.streams[0]);
//             }
//         });

//         // Connection state monitoring
//         this.peer.addEventListener('connectionstatechange', () => {
//             console.log('Connection state:', this.peer.connectionState);
//         });

//         this.peer.addEventListener('iceconnectionstatechange', () => {
//             console.log('ICE connection state:', this.peer.iceConnectionState);
//         });

//         this.peer.addEventListener('signalingstatechange', () => {
//             console.log('Signaling state:', this.peer.signalingState);
//         });
//     }

//     async getAnswer(offer) {
//         if (!this.peer) {
//             this.init();
//         }
        
//         try {
//             console.log('Creating answer for offer');
//             await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//             const answer = await this.peer.createAnswer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//             console.log('Answer created successfully');
//             return answer;
//         } catch (error) {
//             console.error('Error creating answer:', error);
//             throw error;
//         }
//     }

//     async setLocalDescription(answer) {
//         if (!this.peer) {
//             console.error('Peer connection not initialized');
//             return;
//         }
        
//         try {
//             console.log('Setting remote description (answer)');
//             await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//             console.log('Remote description set successfully');
//         } catch (error) {
//             console.error('Error setting remote description:', error);
//             throw error;
//         }
//     }

//     async getOffer() {
//         if (!this.peer) {
//             this.init();
//         }
        
//         try {
//             console.log('Creating offer');
//             const offer = await this.peer.createOffer({
//                 offerToReceiveAudio: true,
//                 offerToReceiveVideo: true
//             });
//             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//             console.log('Offer created successfully');
//             return offer;
//         } catch (error) {
//             console.error('Error creating offer:', error);
//             throw error;
//         }
//     }

//     async addIceCandidate(candidate) {
//         if (!this.peer) {
//             console.error('Peer connection not initialized');
//             return;
//         }
        
//         try {
//             if (this.peer.remoteDescription) {
//                 await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
//                 console.log('ICE candidate added successfully');
//             }
//         } catch (error) {
//             console.error('Error adding ICE candidate:', error);
//         }
//     }

//     // Add local stream to peer connection
//     addStream(stream) {
//         if (!this.peer) {
//             console.error('Peer connection not initialized');
//             return;
//         }
        
//         console.log('Adding local stream to peer connection');
//         // Remove existing tracks first
//         const senders = this.peer.getSenders();
//         senders.forEach(sender => {
//             if (sender.track) {
//                 this.peer.removeTrack(sender);
//             }
//         });

//         // Add new tracks
//         stream.getTracks().forEach(track => {
//             this.peer.addTrack(track, stream);
//         });
//     }

//     // Set callback for remote tracks
//     setOnRemoteTrack(callback) {
//         this.onRemoteTrackCallback = callback;
//     }

//     // Set callback for ICE candidates
//     setOnIceCandidate(callback) {
//         this.onIceCandidateCallback = callback;
//     }

//     // Get peer connection state
//     getConnectionState() {
//         return this.peer ? this.peer.connectionState : 'closed';
//     }

//     // Clean up
//     close() {
//         if (this.peer) {
//             this.peer.close();
//             this.peer = null;
//             console.log('Peer connection closed');
//         }
//     }
// }

// // Export a new instance
// export default new PeerService();
















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