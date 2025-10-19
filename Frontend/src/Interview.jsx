// Correct
import axios from "./config/axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import peer from "./services/peer";
import io from "socket.io-client";

import { BiSolidMicrophone } from "react-icons/bi";
import { BiSolidMicrophoneOff } from "react-icons/bi";
import { IoVideocam } from "react-icons/io5";
import { IoVideocamOff } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";

export default function Interview() {
    const { user } = useContext(AuthContext)
    const { id } = useParams();
    
    const [socket, setSocket] = useState(null);
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [mic, setMic] = useState(true);
    const [camera, setCamera] = useState(true);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Configure peer service callbacks
    useEffect(() => {
        peer.setOnIceCandidate((candidate) => {
            if (socket && remoteSocketId) {
                console.log('Sending ICE candidate to:', remoteSocketId);
                socket.emit("ice-candidate", {
                    to: remoteSocketId,
                    candidate
                });
            }
        });

        peer.setOnRemoteTrack((stream) => {
            console.log('Remote track callback - Stream received:', stream);
            if (stream && stream.getTracks().length > 0) {
                console.log('Remote stream has tracks:', stream.getTracks().length);
                setRemoteStream(stream);
                setIsCallActive(true);
                setConnectionStatus('connected');
            }
        });

        return () => {
            peer.close();
        };
    }, [socket, remoteSocketId]);

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        const handleUserJoined = (data) => {
            console.log("User joined:", data);
            if (data.email !== user.email) {
                setRemoteSocketId(data.socketId);
                setConnectionStatus('user_joined');
            }
        };

        const handleRoomJoin = (data) => {
            console.log("Joined room:", data);
            if (data.existingUsers && data.existingUsers.length > 0) {
                const targetUser = data.existingUsers.find(u => u.role !== user.role);
                if (targetUser) {
                    setRemoteSocketId(targetUser.socketId);
                    setConnectionStatus('user_joined');
                }
            }
        };

        const handleIncomingCall = async ({ from, offer }) => {
            console.log("Incoming call from:", from);
            setRemoteSocketId(from);
            setConnectionStatus('incoming_call');
            
            try {
                // Get user media
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: true, 
                    video: true 
                });
                setMyStream(stream);
                
                // Initialize peer and add stream
                peer.init();
                peer.addStream(stream);
                
                // Create and send answer
                const answer = await peer.getAnswer(offer);
                socket.emit("call:accepted", { to: from, answer });
                
                setIsCallActive(true);
                setConnectionStatus('call_established');
                
            } catch (error) {
                console.error("Error handling incoming call:", error);
                alert("Error accessing camera/microphone. Please check permissions.");
            }
        };

        const handleCallAccepted = async ({ from, answer }) => {
            console.log("Call accepted by:", from);
            setConnectionStatus('call_accepted');
            try {
                await peer.setLocalDescription(answer);
                setIsCallActive(true);
                setConnectionStatus('call_established');
            } catch (error) {
                console.error("Error setting remote description:", error);
            }
        };

        const handleUserLeft = (data) => {
            console.log("User left:", data);
            if (data.socketId === remoteSocketId) {
                setRemoteSocketId(null);
                setIsCallActive(false);
                setConnectionStatus('user_left');
                handleEndCall();
            }
        };

        const handleIceCandidate = async ({ from, candidate }) => {
            console.log("Received ICE candidate from:", from);
            try {
                await peer.addIceCandidate(candidate);
            } catch (error) {
                console.error("Error adding ICE candidate:", error);
            }
        };

        // Register event listeners
        socket.on("user:joined", handleUserJoined);
        socket.on("room:join", handleRoomJoin);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("user:left", handleUserLeft);
        socket.on("ice-candidate", handleIceCandidate);

        // Cleanup
        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("room:join", handleRoomJoin);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("user:left", handleUserLeft);
            socket.off("ice-candidate", handleIceCandidate);
        };
    }, [socket, user, remoteSocketId]);

    // Join room when interview details are available
    useEffect(() => {
        if (!socket || !interviewDetails || !user) return;

        const roomId = interviewDetails._id;
        console.log("Joining room:", roomId);
        socket.emit("room:join", {
            email: user.email,
            roomId: roomId,
            role: user.role
        });
    }, [socket, interviewDetails, user]);

    // Fetch interview details
    useEffect(() => {
        (async() => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/api/interview/specificInterview/${id}`, { 
                    headers: { Authorization: token } 
                });
                console.log("Interview details:", response.data.interview);
                setInterviewDetails(response.data.interview);
            } catch (error) {
                console.log("Error fetching interview details:", error);
            }
        })();
    }, [id]);

    // Handle local stream display
    useEffect(() => {
        if (myStream && localVideoRef.current) {
            console.log("Setting local video stream");
            localVideoRef.current.srcObject = myStream;
            localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
        }
    }, [myStream]);

    // Handle remote stream display - FIXED: Better remote stream handling
    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            console.log("Setting remote video stream, tracks:", remoteStream.getTracks().length);
            remoteVideoRef.current.srcObject = remoteStream;
            
            // Force play the remote video
            const playRemoteVideo = async () => {
                try {
                    await remoteVideoRef.current.play();
                    console.log("Remote video playing successfully");
                } catch (error) {
                    console.error("Error playing remote video:", error);
                }
            };
            
            playRemoteVideo();
            
            // Listen for new tracks being added
            remoteStream.onaddtrack = (event) => {
                console.log('New track added to remote stream:', event.track.kind);
                remoteVideoRef.current.srcObject = remoteStream;
                playRemoteVideo();
            };
        }
    }, [remoteStream]);

    const handleCallUser = useCallback(async () => {
        console.log("Making call to:", remoteSocketId);
        if (!remoteSocketId) {
            console.error("No remote socket ID available");
            alert("No user available to call. Please wait for the candidate to join.");
            return;
        }

        try {
            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: true 
            });
            
            setMyStream(stream);

            // Initialize peer and add stream
            peer.init();
            peer.addStream(stream);
            
            // Create and send offer
            const offer = await peer.getOffer();
            socket.emit("user:call", { to: remoteSocketId, offer });
            
            setIsCallActive(true);
            setConnectionStatus('call_initiated');
            
        } catch (error) {
            console.error("Error calling user:", error);
            alert("Error accessing camera/microphone. Please check permissions.");
        }
    }, [remoteSocketId, socket]);

    const handleEndCall = useCallback(() => {
        console.log("Ending call");
        
        // Stop local stream
        if (myStream) {
            myStream.getTracks().forEach(track => {
                track.stop();
            });
            setMyStream(null);
        }
        
        // Stop remote stream
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => {
                track.stop();
            });
            setRemoteStream(null);
        }
        
        // Reset states
        setRemoteSocketId(null);
        setIsCallActive(false);
        setConnectionStatus('disconnected');
        
        // Close peer connection
        peer.close();
    }, [myStream, remoteStream]);

    // Debug function to check streams
    const checkStreams = () => {
        console.log('=== STREAM DEBUG INFO ===');
        console.log('Local Stream:', myStream);
        console.log('Remote Stream:', remoteStream);
        if (myStream) {
            console.log('Local Tracks:', myStream.getTracks().length);
            myStream.getTracks().forEach((track, i) => {
                console.log(`Local Track ${i}:`, track.kind, track.readyState);
            });
        }
        if (remoteStream) {
            console.log('Remote Tracks:', remoteStream.getTracks().length);
            remoteStream.getTracks().forEach((track, i) => {
                console.log(`Remote Track ${i}:`, track.kind, track.readyState);
            });
        }
        console.log('Connection Status:', connectionStatus);
        console.log('Remote Socket ID:', remoteSocketId);
        console.log('========================');
    };

    return (
        <div className="relative">
            <div>
                <div className='px-6 md:px-32 py-14 bg-gray-50'>
                    <div className='mt-16 flex items-center justify-center'>
                        {interviewDetails && (
                            <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 text-center">
                                <h1 className="text-3xl text-gray-800 font-bold mb-4">
                                    {interviewDetails.jobId.title}
                                </h1>
                                <div className="text-2xl text-indigo-500 font-semibold mb-8">
                                    {interviewDetails.hrId.companyName}
                                </div>

                                {user.role === "HR" && (
                                    <>
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                                                <div className="text-xl text-gray-800 font-bold mb-2">
                                                    {user.name}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {user.email}
                                                </div>
                                            </div>
                    
                                            <p className="text-2xl text-gray-400">→</p>
                    
                                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                                                <div className="text-xl text-gray-800 font-bold mb-2">
                                                    {interviewDetails.applicantId.name}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {interviewDetails.applicantId.email}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {!isCallActive ? (
                                            <button 
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleCallUser}
                                                disabled={!remoteSocketId}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                                </svg>
                                                {remoteSocketId ? "Start Video Call" : "Waiting for candidate..."}
                                            </button>
                                        ) : (
                                            <button 
                                                className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                                onClick={handleEndCall}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                                End Call
                                            </button>
                                        )}
                                    </>
                                )}

                                {user.role === "User" && (
                                    <>
                                        <div className="bg-gray-50 rounded-2xl p-6 my-8 border-2 border-gray-200">
                                            <div className="text-2xl text-gray-800 font-bold mb-2">
                                                {user.name}
                                            </div>
                                            <div className="text-gray-500 text-base mb-4">
                                                {user.email}
                                            </div>
                                        </div>
                                        
                                        {isCallActive ? (
                                            <button 
                                                className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                                onClick={handleEndCall}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                                End Call
                                            </button>
                                        ) : (
                                            <div className="text-gray-600 text-lg">
                                                {remoteSocketId ? "Ready for call - waiting for HR to start..." : "Waiting for HR to join the room..."}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {
                myStream && <div className="w-screen h-screen absolute top-0 left-0 bg-black">
                    <div className="relative">
                        <video 
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-80 h-48 bg-black rounded-lg absolute bottom-0 right-0 z-20"
                            />

                        <video 
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-screen bg-black rounded-lg z-50"
                        />

                        <div className="absolute bottom-3 flex items-center justify-center w-full z-50 gap-4">
                            <button className={`rounded-lg ${camera ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={() => {
                                const videoTrack = myStream?.getVideoTracks()[0];
                                if (videoTrack) {
                                    videoTrack.enabled = !videoTrack.enabled;
                                    setCamera(videoTrack.enabled);
                                }
                            }}>{camera ? <IoVideocam /> : <IoVideocamOff />}</button>
                            <button className={`rounded-lg ${mic ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={() => {
                                const audioTrack = myStream?.getAudioTracks()[0];
                                if (audioTrack) {
                                    audioTrack.enabled = !audioTrack.enabled;
                                    setMic(audioTrack.enabled);
                                }
                            }}>{mic ? <BiSolidMicrophone /> : <BiSolidMicrophoneOff />}</button>
                            <button className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-lg z-50 text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" onClick={handleEndCall}><MdCallEnd /></button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}






















// import axios from "./config/axios";
// import { useCallback, useContext, useEffect, useRef, useState } from "react"
// import { useParams } from "react-router-dom";
// import { AuthContext } from "./context/AuthContext";
// import peer from "./services/peer";
// import io from "socket.io-client";

// export default function Interview() {
//     const { user } = useContext(AuthContext)
//     const { id } = useParams();
    
//     const [socket, setSocket] = useState(null);
//     const [remoteSocketId, setRemoteSocketId] = useState(null);
//     const [myStream, setMyStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
//     const [interviewDetails, setInterviewDetails] = useState(null);
//     const [isCallActive, setIsCallActive] = useState(false);
//     const [connectionStatus, setConnectionStatus] = useState('disconnected');
//     const [showDebug, setShowDebug] = useState(false);
    
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);

//     // Initialize socket connection
//     useEffect(() => {
//         const newSocket = io("http://localhost:3000");
//         setSocket(newSocket);

//         return () => {
//             newSocket.close();
//         };
//     }, []);

//     // Configure peer service callbacks
//     useEffect(() => {
//         peer.setOnIceCandidate((candidate) => {
//             if (socket && remoteSocketId) {
//                 socket.emit("ice-candidate", {
//                     to: remoteSocketId,
//                     candidate
//                 });
//             }
//         });

//         peer.setOnRemoteTrack((stream) => {
//             if (stream && stream.getTracks().length > 0) {
//                 setRemoteStream(stream);
//                 setIsCallActive(true);
//                 setConnectionStatus('connected');
//             }
//         });

//         return () => {
//             peer.close();
//         };
//     }, [socket, remoteSocketId]);

//     // Socket event handlers
//     useEffect(() => {
//         if (!socket) return;

//         const handleUserJoined = (data) => {
//             if (data.email !== user.email) {
//                 setRemoteSocketId(data.socketId);
//                 setConnectionStatus('user_joined');
//             }
//         };

//         const handleRoomJoin = (data) => {
//             if (data.existingUsers && data.existingUsers.length > 0) {
//                 const targetUser = data.existingUsers.find(u => u.role !== user.role);
//                 if (targetUser) {
//                     setRemoteSocketId(targetUser.socketId);
//                     setConnectionStatus('user_joined');
//                 }
//             }
//         };

//         const handleIncomingCall = async ({ from, offer }) => {
//             setRemoteSocketId(from);
//             setConnectionStatus('incoming_call');
            
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ 
//                     audio: true, 
//                     video: true 
//                 });
//                 setMyStream(stream);
                
//                 peer.init();
//                 peer.addStream(stream);
                
//                 const answer = await peer.getAnswer(offer);
//                 socket.emit("call:accepted", { to: from, answer });
                
//                 setIsCallActive(true);
//                 setConnectionStatus('call_established');
                
//             } catch (error) {
//                 console.error("Error handling incoming call:", error);
//                 alert("Error accessing camera/microphone. Please check permissions.");
//             }
//         };

//         const handleCallAccepted = async ({ from, answer }) => {
//             setConnectionStatus('call_accepted');
//             try {
//                 await peer.setLocalDescription(answer);
//                 setIsCallActive(true);
//                 setConnectionStatus('call_established');
//             } catch (error) {
//                 console.error("Error setting remote description:", error);
//             }
//         };

//         const handleUserLeft = (data) => {
//             if (data.socketId === remoteSocketId) {
//                 setRemoteSocketId(null);
//                 setIsCallActive(false);
//                 setConnectionStatus('user_left');
//                 handleEndCall();
//             }
//         };

//         const handleIceCandidate = async ({ from, candidate }) => {
//             try {
//                 await peer.addIceCandidate(candidate);
//             } catch (error) {
//                 console.error("Error adding ICE candidate:", error);
//             }
//         };

//         // Register event listeners
//         socket.on("user:joined", handleUserJoined);
//         socket.on("room:join", handleRoomJoin);
//         socket.on("incoming:call", handleIncomingCall);
//         socket.on("call:accepted", handleCallAccepted);
//         socket.on("user:left", handleUserLeft);
//         socket.on("ice-candidate", handleIceCandidate);

//         // Cleanup
//         return () => {
//             socket.off("user:joined", handleUserJoined);
//             socket.off("room:join", handleRoomJoin);
//             socket.off("incoming:call", handleIncomingCall);
//             socket.off("call:accepted", handleCallAccepted);
//             socket.off("user:left", handleUserLeft);
//             socket.off("ice-candidate", handleIceCandidate);
//         };
//     }, [socket, user, remoteSocketId]);

//     // Join room when interview details are available
//     useEffect(() => {
//         if (!socket || !interviewDetails || !user) return;

//         const roomId = interviewDetails._id;
//         socket.emit("room:join", {
//             email: user.email,
//             roomId: roomId,
//             role: user.role
//         });
//     }, [socket, interviewDetails, user]);

//     // Fetch interview details
//     useEffect(() => {
//         (async() => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await axios.get(`http://localhost:3000/api/interview/specificInterview/${id}`, { 
//                     headers: { Authorization: token } 
//                 });
//                 setInterviewDetails(response.data.interview);
//             } catch (error) {
//                 console.log("Error fetching interview details:", error);
//             }
//         })();
//     }, [id]);

//     // Handle local stream display
//     useEffect(() => {
//         if (myStream && localVideoRef.current) {
//             localVideoRef.current.srcObject = myStream;
//             localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
//         }
//     }, [myStream]);

//     // Handle remote stream display
//     useEffect(() => {
//         if (remoteStream && remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = remoteStream;
//             remoteVideoRef.current.play().catch(e => console.error("Error playing remote video:", e));
//         }
//     }, [remoteStream]);

//     const handleCallUser = useCallback(async () => {
//         if (!remoteSocketId) {
//             alert("No user available to call. Please wait for the candidate to join.");
//             return;
//         }

//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ 
//                 audio: true, 
//                 video: true 
//             });
            
//             setMyStream(stream);
//             peer.init();
//             peer.addStream(stream);
            
//             const offer = await peer.getOffer();
//             socket.emit("user:call", { to: remoteSocketId, offer });
            
//             setIsCallActive(true);
//             setConnectionStatus('call_initiated');
            
//         } catch (error) {
//             console.error("Error calling user:", error);
//             alert("Error accessing camera/microphone. Please check permissions.");
//         }
//     }, [remoteSocketId, socket]);

//     const handleEndCall = useCallback(() => {
//         if (myStream) {
//             myStream.getTracks().forEach(track => track.stop());
//             setMyStream(null);
//         }
//         if (remoteStream) {
//             remoteStream.getTracks().forEach(track => track.stop());
//             setRemoteStream(null);
//         }
        
//         setRemoteSocketId(null);
//         setIsCallActive(false);
//         setConnectionStatus('disconnected');
//         peer.close();
//     }, [myStream, remoteStream]);

//     const getStatusColor = (status) => {
//         switch(status) {
//             case 'connected':
//             case 'call_established':
//                 return 'text-green-600 bg-green-100';
//             case 'user_joined':
//             case 'call_accepted':
//             case 'call_initiated':
//                 return 'text-blue-600 bg-blue-100';
//             case 'incoming_call':
//                 return 'text-orange-600 bg-orange-100';
//             case 'user_left':
//                 return 'text-red-600 bg-red-100';
//             default:
//                 return 'text-gray-600 bg-gray-100';
//         }
//     };

//     const getStatusText = (status) => {
//         switch(status) {
//             case 'connected':
//             case 'call_established':
//                 return 'Call Connected';
//             case 'user_joined':
//                 return 'User Joined';
//             case 'call_initiated':
//                 return 'Calling...';
//             case 'call_accepted':
//                 return 'Call Accepted';
//             case 'incoming_call':
//                 return 'Incoming Call';
//             case 'user_left':
//                 return 'User Left';
//             default:
//                 return 'Disconnected';
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center py-4">
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
//                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <h1 className="text-xl font-bold text-gray-900">Video Interview</h1>
//                                 <p className="text-sm text-gray-500">Real-time video conference</p>
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-4">
//                             <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(connectionStatus)}`}>
//                                 {getStatusText(connectionStatus)}
//                             </div>
//                             <button
//                                 onClick={() => setShowDebug(!showDebug)}
//                                 className="text-gray-400 hover:text-gray-600 transition-colors"
//                                 title="Debug Info"
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Left Sidebar - Interview Info */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
//                             {interviewDetails && (
//                                 <>
//                                     <div className="text-center mb-6">
//                                         <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
//                                             </svg>
//                                         </div>
//                                         <h2 className="text-xl font-bold text-gray-900">{interviewDetails.jobId.title}</h2>
//                                         <p className="text-indigo-600 font-semibold">{interviewDetails.hrId.companyName}</p>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                             <span className="text-sm font-medium text-gray-600">Interview ID</span>
//                                             <span className="text-sm text-gray-900 font-mono">{interviewDetails._id.slice(-8)}</span>
//                                         </div>
                                        
//                                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                             <span className="text-sm font-medium text-gray-600">Your Role</span>
//                                             <span className="text-sm text-gray-900 capitalize">{user.role}</span>
//                                         </div>

//                                         <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                             <div className="flex items-center space-x-2 text-blue-700 mb-2">
//                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 <span className="text-sm font-medium">Tips</span>
//                                             </div>
//                                             <p className="text-sm text-blue-600">
//                                                 {user.role === "HR" 
//                                                     ? "Ensure good lighting and a professional background for the interview."
//                                                     : "Test your audio and video before joining. Have your resume ready."
//                                                 }
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* Main Content Area */}
//                     <div className="lg:col-span-2">
//                         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                             {/* Video Preview Section */}
//                             <div className="p-6 border-b">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     {/* Local Video */}
//                                     <div className="relative">
//                                         <div className="flex items-center justify-between mb-3">
//                                             <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
//                                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                                                 <span>Your Camera</span>
//                                             </h3>
//                                             {myStream && (
//                                                 <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Live</span>
//                                             )}
//                                         </div>
//                                         <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
//                                             <video 
//                                                 ref={localVideoRef}
//                                                 autoPlay
//                                                 playsInline
//                                                 muted
//                                                 className="w-full h-full object-cover"
//                                             />
//                                             {!myStream && (
//                                                 <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//                                                     <div className="text-center text-gray-400">
//                                                         <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                                                         </svg>
//                                                         <p className="text-sm">Camera offline</p>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Remote Video */}
//                                     <div className="relative">
//                                         <div className="flex items-center justify-between mb-3">
//                                             <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
//                                                 <div className={`w-2 h-2 rounded-full ${remoteStream ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
//                                                 <span>
//                                                     {user.role === "HR" ? interviewDetails?.applicantId.name : "Interviewer"}
//                                                 </span>
//                                             </h3>
//                                             {remoteStream && (
//                                                 <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Live</span>
//                                             )}
//                                         </div>
//                                         <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
//                                             <video 
//                                                 ref={remoteVideoRef}
//                                                 autoPlay
//                                                 playsInline
//                                                 className="w-full h-full object-cover"
//                                             />
//                                             {!remoteStream && (
//                                                 <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//                                                     <div className="text-center text-gray-400">
//                                                         <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                                         </svg>
//                                                         <p className="text-sm">Waiting for participant</p>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Control Section */}
//                             <div className="p-6">
//                                 {user.role === "HR" && (
//                                     <div className="text-center">
//                                         {!isCallActive ? (
//                                             <div className="space-y-4">
//                                                 <button 
//                                                     onClick={handleCallUser}
//                                                     disabled={!remoteSocketId}
//                                                     className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
//                                                 >
//                                                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                                     </svg>
//                                                     <span>
//                                                         {remoteSocketId ? "Start Video Call" : "Waiting for candidate..."}
//                                                     </span>
//                                                 </button>
//                                                 {!remoteSocketId && (
//                                                     <p className="text-gray-500 text-sm animate-pulse">
//                                                         Waiting for candidate to join the room...
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         ) : (
//                                             <button 
//                                                 onClick={handleEndCall}
//                                                 className="inline-flex items-center space-x-3 bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
//                                             >
//                                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                                 </svg>
//                                                 <span>End Call</span>
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}

//                                 {user.role === "User" && (
//                                     <div className="text-center">
//                                         {isCallActive ? (
//                                             <button 
//                                                 onClick={handleEndCall}
//                                                 className="inline-flex items-center space-x-3 bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
//                                             >
//                                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                                 </svg>
//                                                 <span>Leave Call</span>
//                                             </button>
//                                         ) : (
//                                             <div className="space-y-4">
//                                                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
//                                                     <div className="flex items-center justify-center space-x-2 text-yellow-700 mb-2">
//                                                         <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                         </svg>
//                                                         <span className="font-semibold">Waiting for Interviewer</span>
//                                                     </div>
//                                                     <p className="text-yellow-600 text-sm">
//                                                         The HR will start the call shortly. Please ensure your camera and microphone are ready.
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Debug Panel */}
//                         {showDebug && (
//                             <div className="mt-6 bg-gray-800 rounded-2xl p-6 text-white">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h3 className="text-lg font-semibold">Connection Debug</h3>
//                                     <button 
//                                         onClick={() => setShowDebug(false)}
//                                         className="text-gray-400 hover:text-white"
//                                     >
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                                     <div>
//                                         <div className="text-gray-400">Status</div>
//                                         <div className={getStatusColor(connectionStatus).replace('bg-', 'bg-').replace('text-', 'text-') + ' px-2 py-1 rounded inline-block mt-1'}>
//                                             {connectionStatus}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div className="text-gray-400">Remote Socket</div>
//                                         <div>{remoteSocketId ? 'Connected' : 'Disconnected'}</div>
//                                     </div>
//                                     <div>
//                                         <div className="text-gray-400">Local Stream</div>
//                                         <div>{myStream ? `${myStream.getTracks().length} tracks` : 'No'}</div>
//                                     </div>
//                                     <div>
//                                         <div className="text-gray-400">Remote Stream</div>
//                                         <div>{remoteStream ? `${remoteStream.getTracks().length} tracks` : 'No'}</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }