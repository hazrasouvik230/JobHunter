// // Correct
// import axios from "./config/axios";
// import { useCallback, useContext, useEffect, useRef, useState } from "react"
// import { useParams } from "react-router-dom";
// import { AuthContext } from "./context/AuthContext";
// import peer from "./services/peer";
// import io from "socket.io-client";

// import { BiSolidMicrophone } from "react-icons/bi";
// import { BiSolidMicrophoneOff } from "react-icons/bi";
// import { IoVideocam } from "react-icons/io5";
// import { IoVideocamOff } from "react-icons/io5";
// import { MdCallEnd } from "react-icons/md";

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
    
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);

//     const [mic, setMic] = useState(true);
//     const [camera, setCamera] = useState(true);

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
//                 console.log('Sending ICE candidate to:', remoteSocketId);
//                 socket.emit("ice-candidate", {
//                     to: remoteSocketId,
//                     candidate
//                 });
//             }
//         });

//         peer.setOnRemoteTrack((stream) => {
//             console.log('Remote track callback - Stream received:', stream);
//             if (stream && stream.getTracks().length > 0) {
//                 console.log('Remote stream has tracks:', stream.getTracks().length);
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
//             console.log("User joined:", data);
//             if (data.email !== user.email) {
//                 setRemoteSocketId(data.socketId);
//                 setConnectionStatus('user_joined');
//             }
//         };

//         const handleRoomJoin = (data) => {
//             console.log("Joined room:", data);
//             if (data.existingUsers && data.existingUsers.length > 0) {
//                 const targetUser = data.existingUsers.find(u => u.role !== user.role);
//                 if (targetUser) {
//                     setRemoteSocketId(targetUser.socketId);
//                     setConnectionStatus('user_joined');
//                 }
//             }
//         };

//         const handleIncomingCall = async ({ from, offer }) => {
//             console.log("Incoming call from:", from);
//             setRemoteSocketId(from);
//             setConnectionStatus('incoming_call');
            
//             try {
//                 // Get user media
//                 const stream = await navigator.mediaDevices.getUserMedia({ 
//                     audio: true, 
//                     video: true 
//                 });
//                 setMyStream(stream);
                
//                 // Initialize peer and add stream
//                 peer.init();
//                 peer.addStream(stream);
                
//                 // Create and send answer
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
//             console.log("Call accepted by:", from);
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
//             console.log("User left:", data);
//             if (data.socketId === remoteSocketId) {
//                 setRemoteSocketId(null);
//                 setIsCallActive(false);
//                 setConnectionStatus('user_left');
//                 handleEndCall();
//             }
//         };

//         const handleIceCandidate = async ({ from, candidate }) => {
//             console.log("Received ICE candidate from:", from);
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
//         console.log("Joining room:", roomId);
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
//                 console.log("Interview details:", response.data.interview);
//                 setInterviewDetails(response.data.interview);
//             } catch (error) {
//                 console.log("Error fetching interview details:", error);
//             }
//         })();
//     }, [id]);

//     // Handle local stream display
//     useEffect(() => {
//         if (myStream && localVideoRef.current) {
//             console.log("Setting local video stream");
//             localVideoRef.current.srcObject = myStream;
//             localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
//         }
//     }, [myStream]);

//     // Handle remote stream display - FIXED: Better remote stream handling
//     useEffect(() => {
//         if (remoteStream && remoteVideoRef.current) {
//             console.log("Setting remote video stream, tracks:", remoteStream.getTracks().length);
//             remoteVideoRef.current.srcObject = remoteStream;
            
//             // Force play the remote video
//             const playRemoteVideo = async () => {
//                 try {
//                     await remoteVideoRef.current.play();
//                     console.log("Remote video playing successfully");
//                 } catch (error) {
//                     console.error("Error playing remote video:", error);
//                 }
//             };
            
//             playRemoteVideo();
            
//             // Listen for new tracks being added
//             remoteStream.onaddtrack = (event) => {
//                 console.log('New track added to remote stream:', event.track.kind);
//                 remoteVideoRef.current.srcObject = remoteStream;
//                 playRemoteVideo();
//             };
//         }
//     }, [remoteStream]);

//     const handleCallUser = useCallback(async () => {
//         console.log("Making call to:", remoteSocketId);
//         if (!remoteSocketId) {
//             console.error("No remote socket ID available");
//             alert("No user available to call. Please wait for the candidate to join.");
//             return;
//         }

//         try {
//             // Get user media
//             const stream = await navigator.mediaDevices.getUserMedia({ 
//                 audio: true, 
//                 video: true 
//             });
            
//             setMyStream(stream);

//             // Initialize peer and add stream
//             peer.init();
//             peer.addStream(stream);
            
//             // Create and send offer
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
//         console.log("Ending call");
        
//         // Stop local stream
//         if (myStream) {
//             myStream.getTracks().forEach(track => {
//                 track.stop();
//             });
//             setMyStream(null);
//         }
        
//         // Stop remote stream
//         if (remoteStream) {
//             remoteStream.getTracks().forEach(track => {
//                 track.stop();
//             });
//             setRemoteStream(null);
//         }
        
//         // Reset states
//         setRemoteSocketId(null);
//         setIsCallActive(false);
//         setConnectionStatus('disconnected');
        
//         // Close peer connection
//         peer.close();
//     }, [myStream, remoteStream]);

//     // Debug function to check streams
//     const checkStreams = () => {
//         console.log('=== STREAM DEBUG INFO ===');
//         console.log('Local Stream:', myStream);
//         console.log('Remote Stream:', remoteStream);
//         if (myStream) {
//             console.log('Local Tracks:', myStream.getTracks().length);
//             myStream.getTracks().forEach((track, i) => {
//                 console.log(`Local Track ${i}:`, track.kind, track.readyState);
//             });
//         }
//         if (remoteStream) {
//             console.log('Remote Tracks:', remoteStream.getTracks().length);
//             remoteStream.getTracks().forEach((track, i) => {
//                 console.log(`Remote Track ${i}:`, track.kind, track.readyState);
//             });
//         }
//         console.log('Connection Status:', connectionStatus);
//         console.log('Remote Socket ID:', remoteSocketId);
//         console.log('========================');
//     };

//     return (
//         <div className="relative">
//             <div>
//                 <div className='px-6 md:px-32 py-14 bg-gray-50'>
//                     <div className='mt-16 flex items-center justify-center'>
//                         {interviewDetails && (
//                             <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 text-center">
//                                 <h1 className="text-3xl text-gray-800 font-bold mb-4">
//                                     {interviewDetails.jobId.title}
//                                 </h1>
//                                 <div className="text-2xl text-indigo-500 font-semibold mb-8">
//                                     {interviewDetails.hrId.companyName}
//                                 </div>

//                                 {user.role === "HR" && (
//                                     <>
//                                         <div className="flex items-center justify-between mb-8">
//                                             <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
//                                                 <div className="text-xl text-gray-800 font-bold mb-2">
//                                                     {user.name}
//                                                 </div>
//                                                 <div className="text-gray-500 text-sm">
//                                                     {user.email}
//                                                 </div>
//                                             </div>
                    
//                                             <p className="text-2xl text-gray-400">→</p>
                    
//                                             <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
//                                                 <div className="text-xl text-gray-800 font-bold mb-2">
//                                                     {interviewDetails.applicantId.name}
//                                                 </div>
//                                                 <div className="text-gray-500 text-sm">
//                                                     {interviewDetails.applicantId.email}
//                                                 </div>
//                                             </div>
//                                         </div>
                                        
//                                         {!isCallActive ? (
//                                             <button 
//                                                 className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                 onClick={handleCallUser}
//                                                 disabled={!remoteSocketId}
//                                             >
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
//                                                 </svg>
//                                                 {remoteSocketId ? "Start Video Call" : "Waiting for candidate..."}
//                                             </button>
//                                         ) : (
//                                             <button 
//                                                 className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
//                                                 onClick={handleEndCall}
//                                             >
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                                                 </svg>
//                                                 End Call
//                                             </button>
//                                         )}
//                                     </>
//                                 )}

//                                 {user.role === "User" && (
//                                     <>
//                                         <div className="bg-gray-50 rounded-2xl p-6 my-8 border-2 border-gray-200">
//                                             <div className="text-2xl text-gray-800 font-bold mb-2">
//                                                 {user.name}
//                                             </div>
//                                             <div className="text-gray-500 text-base mb-4">
//                                                 {user.email}
//                                             </div>
//                                         </div>
                                        
//                                         {isCallActive ? (
//                                             <button 
//                                                 className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
//                                                 onClick={handleEndCall}
//                                             >
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                                                 </svg>
//                                                 End Call
//                                             </button>
//                                         ) : (
//                                             <div className="text-gray-600 text-lg">
//                                                 {remoteSocketId ? "Ready for call - waiting for HR to start..." : "Waiting for HR to join the room..."}
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {
//                 myStream && <div className="w-screen h-screen absolute top-0 left-0 bg-black">
//                     <div className="relative">
//                         <video 
//                             ref={localVideoRef}
//                             autoPlay
//                             playsInline
//                             muted
//                             className="w-80 h-48 bg-black rounded-lg absolute bottom-0 right-0 z-20"
//                             />

//                         <video 
//                             ref={remoteVideoRef}
//                             autoPlay
//                             playsInline
//                             className="w-full h-screen bg-black rounded-lg z-50"
//                         />

//                         <div className="absolute bottom-3 flex items-center justify-center w-full z-50 gap-4">
//                             <button className={`rounded-lg ${camera ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={() => {
//                                 const videoTrack = myStream?.getVideoTracks()[0];
//                                 if (videoTrack) {
//                                     videoTrack.enabled = !videoTrack.enabled;
//                                     setCamera(videoTrack.enabled);
//                                 }
//                             }}>{camera ? <IoVideocam /> : <IoVideocamOff />}</button>
//                             <button className={`rounded-lg ${mic ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={() => {
//                                 const audioTrack = myStream?.getAudioTracks()[0];
//                                 if (audioTrack) {
//                                     audioTrack.enabled = !audioTrack.enabled;
//                                     setMic(audioTrack.enabled);
//                                 }
//                             }}>{mic ? <BiSolidMicrophone /> : <BiSolidMicrophoneOff />}</button>
//                             <button className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-lg z-50 text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" onClick={handleEndCall}><MdCallEnd /></button>
//                         </div>
//                     </div>
//                 </div>
//             }
//         </div>
//     );
// }

















// Correct
// import axios from "./config/axios";
// import { useCallback, useContext, useEffect, useRef, useState } from "react"
// import { useParams } from "react-router-dom";
// import { AuthContext } from "./context/AuthContext";
// import peer from "./services/peer";
// import io from "socket.io-client";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// import { BiSolidMicrophone } from "react-icons/bi";
// import { BiSolidMicrophoneOff } from "react-icons/bi";
// import { IoVideocam } from "react-icons/io5";
// import { IoVideocamOff } from "react-icons/io5";
// import { MdCallEnd } from "react-icons/md";

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
    
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);

//     const [mic, setMic] = useState(true);
//     const [camera, setCamera] = useState(true);

//     // Speech recognition setup
//     const {
//         transcript,
//         listening,
//         resetTranscript,
//         browserSupportsSpeechRecognition
//     } = useSpeechRecognition();

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
//                 console.log('Sending ICE candidate to:', remoteSocketId);
//                 socket.emit("ice-candidate", {
//                     to: remoteSocketId,
//                     candidate
//                 });
//             }
//         });

//         peer.setOnRemoteTrack((stream) => {
//             console.log('Remote track callback - Stream received:', stream);
//             if (stream && stream.getTracks().length > 0) {
//                 console.log('Remote stream has tracks:', stream.getTracks().length);
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
//             console.log("User joined:", data);
//             if (data.email !== user.email) {
//                 setRemoteSocketId(data.socketId);
//                 setConnectionStatus('user_joined');
//             }
//         };

//         const handleRoomJoin = (data) => {
//             console.log("Joined room:", data);
//             if (data.existingUsers && data.existingUsers.length > 0) {
//                 const targetUser = data.existingUsers.find(u => u.role !== user.role);
//                 if (targetUser) {
//                     setRemoteSocketId(targetUser.socketId);
//                     setConnectionStatus('user_joined');
//                 }
//             }
//         };

//         const handleIncomingCall = async ({ from, offer }) => {
//             console.log("Incoming call from:", from);
//             setRemoteSocketId(from);
//             setConnectionStatus('incoming_call');
            
//             try {
//                 // Get user media
//                 const stream = await navigator.mediaDevices.getUserMedia({ 
//                     audio: true, 
//                     video: true 
//                 });
//                 setMyStream(stream);
                
//                 // Initialize peer and add stream
//                 peer.init();
//                 peer.addStream(stream);
                
//                 // Start speech recognition when call starts
//                 if (mic && browserSupportsSpeechRecognition) {
//                     SpeechRecognition.startListening({ continuous: true });
//                 }
                
//                 // Create and send answer
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
//             console.log("Call accepted by:", from);
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
//             console.log("User left:", data);
//             if (data.socketId === remoteSocketId) {
//                 setRemoteSocketId(null);
//                 setIsCallActive(false);
//                 setConnectionStatus('user_left');
//                 handleEndCall();
//             }
//         };

//         const handleIceCandidate = async ({ from, candidate }) => {
//             console.log("Received ICE candidate from:", from);
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
//     }, [socket, user, remoteSocketId, mic, browserSupportsSpeechRecognition]);

//     // Join room when interview details are available
//     useEffect(() => {
//         if (!socket || !interviewDetails || !user) return;

//         const roomId = interviewDetails._id;
//         console.log("Joining room:", roomId);
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
//                 console.log("Interview details:", response.data.interview);
//                 setInterviewDetails(response.data.interview);
//             } catch (error) {
//                 console.log("Error fetching interview details:", error);
//             }
//         })();
//     }, [id]);

//     // Handle local stream display
//     useEffect(() => {
//         if (myStream && localVideoRef.current) {
//             console.log("Setting local video stream");
//             localVideoRef.current.srcObject = myStream;
//             localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
//         }
//     }, [myStream]);

//     // Handle remote stream display
//     useEffect(() => {
//         if (remoteStream && remoteVideoRef.current) {
//             console.log("Setting remote video stream, tracks:", remoteStream.getTracks().length);
//             remoteVideoRef.current.srcObject = remoteStream;
            
//             const playRemoteVideo = async () => {
//                 try {
//                     await remoteVideoRef.current.play();
//                     console.log("Remote video playing successfully");
//                 } catch (error) {
//                     console.error("Error playing remote video:", error);
//                 }
//             };
            
//             playRemoteVideo();
            
//             remoteStream.onaddtrack = (event) => {
//                 console.log('New track added to remote stream:', event.track.kind);
//                 remoteVideoRef.current.srcObject = remoteStream;
//                 playRemoteVideo();
//             };
//         }
//     }, [remoteStream]);

//     // Handle speech recognition based on mic state and call activity
//     useEffect(() => {
//         if (isCallActive && mic && browserSupportsSpeechRecognition) {
//             console.log("Starting speech recognition");
//             SpeechRecognition.startListening({ continuous: true });
//         } else if ((!isCallActive || !mic) && listening) {
//             console.log("Stopping speech recognition");
//             SpeechRecognition.stopListening();
//         }

//         return () => {
//             if (listening) {
//                 SpeechRecognition.stopListening();
//             }
//         };
//     }, [isCallActive, mic, browserSupportsSpeechRecognition, listening]);

//     const handleCallUser = useCallback(async () => {
//         console.log("Making call to:", remoteSocketId);
//         if (!remoteSocketId) {
//             console.error("No remote socket ID available");
//             alert("No user available to call. Please wait for the candidate to join.");
//             return;
//         }

//         try {
//             // Get user media
//             const stream = await navigator.mediaDevices.getUserMedia({ 
//                 audio: true, 
//                 video: true 
//             });
            
//             setMyStream(stream);

//             // Initialize peer and add stream
//             peer.init();
//             peer.addStream(stream);
            
//             // Start speech recognition when call starts
//             if (mic && browserSupportsSpeechRecognition) {
//                 SpeechRecognition.startListening({ continuous: true });
//             }
            
//             // Create and send offer
//             const offer = await peer.getOffer();
//             socket.emit("user:call", { to: remoteSocketId, offer });
            
//             setIsCallActive(true);
//             setConnectionStatus('call_initiated');
            
//         } catch (error) {
//             console.error("Error calling user:", error);
//             alert("Error accessing camera/microphone. Please check permissions.");
//         }
//     }, [remoteSocketId, socket, mic, browserSupportsSpeechRecognition]);

//     const handleEndCall = useCallback(() => {
//         console.log("Ending call");
        
//         // Stop speech recognition
//         if (listening) {
//             SpeechRecognition.stopListening();
//             resetTranscript();
//         }
        
//         // Stop local stream
//         if (myStream) {
//             myStream.getTracks().forEach(track => {
//                 track.stop();
//             });
//             setMyStream(null);
//         }
        
//         // Stop remote stream
//         if (remoteStream) {
//             remoteStream.getTracks().forEach(track => {
//                 track.stop();
//             });
//             setRemoteStream(null);
//         }
        
//         // Reset states
//         setRemoteSocketId(null);
//         setIsCallActive(false);
//         setConnectionStatus('disconnected');
        
//         // Close peer connection
//         peer.close();
//     }, [myStream, remoteStream, listening, resetTranscript]);

//     // Toggle microphone with speech recognition control
//     const toggleMicrophone = useCallback(() => {
//         const audioTrack = myStream?.getAudioTracks()[0];
//         if (audioTrack) {
//             const newMicState = !audioTrack.enabled;
//             audioTrack.enabled = newMicState;
//             setMic(newMicState);

//             // Control speech recognition based on mic state
//             if (isCallActive && browserSupportsSpeechRecognition) {
//                 if (newMicState) {
//                     SpeechRecognition.startListening({ continuous: true });
//                 } else {
//                     SpeechRecognition.stopListening();
//                 }
//             }
//         }
//     }, [myStream, isCallActive, browserSupportsSpeechRecognition]);

//     // Debug function to check streams and speech recognition
//     const checkStreams = () => {
//         console.log('=== STREAM DEBUG INFO ===');
//         console.log('Local Stream:', myStream);
//         console.log('Remote Stream:', remoteStream);
//         console.log('Speech Recognition - Listening:', listening);
//         console.log('Speech Recognition - Transcript:', transcript);
//         console.log('Browser Support:', browserSupportsSpeechRecognition);
//         if (myStream) {
//             console.log('Local Tracks:', myStream.getTracks().length);
//             myStream.getTracks().forEach((track, i) => {
//                 console.log(`Local Track ${i}:`, track.kind, track.readyState);
//             });
//         }
//         if (remoteStream) {
//             console.log('Remote Tracks:', remoteStream.getTracks().length);
//             remoteStream.getTracks().forEach((track, i) => {
//                 console.log(`Remote Track ${i}:`, track.kind, track.readyState);
//             });
//         }
//         console.log('Connection Status:', connectionStatus);
//         console.log('Remote Socket ID:', remoteSocketId);
//         console.log('========================');
//     };

//     if (!browserSupportsSpeechRecognition) {
//         console.warn("Browser doesn't support speech recognition.");
//     }

//     return (
//         <div className="relative">
//             <div>
//                 <div className='px-6 md:px-32 py-14 bg-gray-50'>
//                     <div className='mt-16 flex items-center justify-center'>
//                         {interviewDetails && (
//                             <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 text-center">
//                                 <h1 className="text-3xl text-gray-800 font-bold mb-4">
//                                     {interviewDetails.jobId.title}
//                                 </h1>
//                                 <div className="text-2xl text-indigo-500 font-semibold mb-8">
//                                     {interviewDetails.hrId.companyName}
//                                 </div>

//                                 {/* Speech Recognition Status */}
//                                 {browserSupportsSpeechRecognition && isCallActive && (
//                                     <div className="mb-4 p-3 bg-gray-100 rounded-lg">
//                                         <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
//                                             <div className={`w-2 h-2 rounded-full ${listening ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                                             Speech Recognition: {listening ? 'Active' : 'Inactive'}
//                                         </div>
//                                         {transcript && (
//                                             <div className="mt-2 p-2 bg-white rounded border text-xs text-left max-h-20 overflow-y-auto">
//                                                 <strong>Transcript:</strong> {transcript}
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 {user.role === "HR" && (
//                                     <>
//                                         <div className="flex items-center justify-between mb-8">
//                                             <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
//                                                 <div className="text-xl text-gray-800 font-bold mb-2">
//                                                     {user.name}
//                                                 </div>
//                                                 <div className="text-gray-500 text-sm">
//                                                     {user.email}
//                                                 </div>
//                                             </div>
                    
//                                             <p className="text-2xl text-gray-400">→</p>
                    
//                                             <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
//                                                 <div className="text-xl text-gray-800 font-bold mb-2">
//                                                     {interviewDetails.applicantId.name}
//                                                 </div>
//                                                 <div className="text-gray-500 text-sm">
//                                                     {interviewDetails.applicantId.email}
//                                                 </div>
//                                             </div>
//                                         </div>
                                        
//                                         {!isCallActive ? (
//                                             <button 
//                                                 className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                 onClick={handleCallUser}
//                                                 disabled={!remoteSocketId}
//                                             >
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
//                                                 </svg>
//                                                 {remoteSocketId ? "Start Video Call" : "Waiting for candidate..."}
//                                             </button>
//                                         ) : (
//                                             <button 
//                                                 className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
//                                                 onClick={handleEndCall}
//                                             >
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                                                 </svg>
//                                                 End Call
//                                             </button>
//                                         )}
//                                     </>
//                                 )}

//                                 {user.role === "User" && (
//                                     <>
//                                         <div className="bg-gray-50 rounded-2xl p-6 my-8 border-2 border-gray-200">
//                                             <div className="text-2xl text-gray-800 font-bold mb-2">
//                                                 {user.name}
//                                             </div>
//                                             <div className="text-gray-500 text-base mb-4">
//                                                 {user.email}
//                                             </div>
//                                         </div>
                                        
//                                         {isCallActive ? (
//                                             <button 
//                                                 className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
//                                                 onClick={handleEndCall}
//                                             >
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                                                 </svg>
//                                                 End Call
//                                             </button>
//                                         ) : (
//                                             <div className="text-gray-600 text-lg">
//                                                 {remoteSocketId ? "Ready for call - waiting for HR to start..." : "Waiting for HR to join the room..."}
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {
//                 myStream && <div className="w-screen h-screen absolute top-0 left-0 bg-black">
//                     <div className="relative">
//                         <video 
//                             ref={localVideoRef}
//                             autoPlay
//                             playsInline
//                             muted
//                             className="w-80 h-48 bg-black rounded-lg absolute bottom-0 right-0 z-20"
//                             />

//                         <video 
//                             ref={remoteVideoRef}
//                             autoPlay
//                             playsInline
//                             className="w-full h-screen bg-black rounded-lg z-50"
//                         />

//                         {/* Speech recognition indicator in video call */}
//                         {browserSupportsSpeechRecognition && isCallActive && (
//                             <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
//                                 <div className="flex items-center gap-2">
//                                     <div className={`w-2 h-2 rounded-full ${listening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
//                                     {listening ? 'Speech Active' : 'Speech Inactive'}
//                                 </div>
//                                 <p>{transcript}</p>
//                             </div>
//                         )}


//                         <div className="absolute bottom-3 flex items-center justify-center w-full z-50 gap-4">
//                             <button className={`rounded-lg ${camera ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={() => {
//                                 const videoTrack = myStream?.getVideoTracks()[0];
//                                 if (videoTrack) {
//                                     videoTrack.enabled = !videoTrack.enabled;
//                                     setCamera(videoTrack.enabled);
//                                 }
//                             }}>{camera ? <IoVideocam /> : <IoVideocamOff />}</button>
                            
//                             <button className={`rounded-lg ${mic ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={toggleMicrophone}>
//                                 {mic ? <BiSolidMicrophone /> : <BiSolidMicrophoneOff />}
//                             </button>
                            
//                             <button className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-lg z-50 text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" onClick={handleEndCall}><MdCallEnd /></button>
//                         </div>
//                     </div>
//                 </div>
//             }
//         </div>
//     );
// }

// // end of the call show the speech of User and HR














import axios from "./config/axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import peer from "./services/peer";
import io from "socket.io-client";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
    const [showTranscriptSummary, setShowTranscriptSummary] = useState(false);
    
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [mic, setMic] = useState(true);
    const [camera, setCamera] = useState(true);

    // Speech recognition setup
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // State to store complete conversation as strings
    const [conversationTranscript, setConversationTranscript] = useState({
        user: "",
        hr: ""
    });

    const currentTranscriptRef = useRef("");

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
                
                // Start speech recognition when call starts
                if (mic && browserSupportsSpeechRecognition) {
                    SpeechRecognition.startListening({ continuous: true });
                }
                
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
    }, [socket, user, remoteSocketId, mic, browserSupportsSpeechRecognition]);

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

    // Handle remote stream display
    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            console.log("Setting remote video stream, tracks:", remoteStream.getTracks().length);
            remoteVideoRef.current.srcObject = remoteStream;
            
            const playRemoteVideo = async () => {
                try {
                    await remoteVideoRef.current.play();
                    console.log("Remote video playing successfully");
                } catch (error) {
                    console.error("Error playing remote video:", error);
                }
            };
            
            playRemoteVideo();
            
            remoteStream.onaddtrack = (event) => {
                console.log('New track added to remote stream:', event.track.kind);
                remoteVideoRef.current.srcObject = remoteStream;
                playRemoteVideo();
            };
        }
    }, [remoteStream]);

    // Update current transcript reference
    useEffect(() => {
        if (transcript && transcript !== currentTranscriptRef.current) {
            currentTranscriptRef.current = transcript;
        }
    }, [transcript]);

    // Save speech to conversation when user stops speaking or mic is turned off
    const saveSpeechToConversation = useCallback(() => {
        if (currentTranscriptRef.current.trim()) {
            // Simply append the speech text without timestamps or speaker info
            const newSpeech = currentTranscriptRef.current + " ";
            
            // Update conversation transcript based on user role
            setConversationTranscript(prev => ({
                ...prev,
                [user.role.toLowerCase()]: prev[user.role.toLowerCase()] + newSpeech
            }));
            
            currentTranscriptRef.current = "";
            resetTranscript();
        }
    }, [user?.role, resetTranscript]);

    // Handle speech recognition based on mic state and call activity
    useEffect(() => {
        if (isCallActive && mic && browserSupportsSpeechRecognition) {
            console.log("Starting speech recognition");
            SpeechRecognition.startListening({ continuous: true });
        } else if ((!isCallActive || !mic) && listening) {
            console.log("Stopping speech recognition");
            saveSpeechToConversation(); // Save current speech when stopping
            SpeechRecognition.stopListening();
        }

        return () => {
            if (listening) {
                saveSpeechToConversation(); // Save current speech when unmounting
                SpeechRecognition.stopListening();
            }
        };
    }, [isCallActive, mic, browserSupportsSpeechRecognition, listening, saveSpeechToConversation]);

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
            
            // Start speech recognition when call starts
            if (mic && browserSupportsSpeechRecognition) {
                SpeechRecognition.startListening({ continuous: true });
            }
            
            // Create and send offer
            const offer = await peer.getOffer();
            socket.emit("user:call", { to: remoteSocketId, offer });
            
            setIsCallActive(true);
            setConnectionStatus('call_initiated');
            
        } catch (error) {
            console.error("Error calling user:", error);
            alert("Error accessing camera/microphone. Please check permissions.");
        }
    }, [remoteSocketId, socket, mic, browserSupportsSpeechRecognition]);

    const handleEndCall = useCallback(() => {
        console.log("Ending call");
        
        // Save final speech segment
        if (listening && currentTranscriptRef.current.trim()) {
            saveSpeechToConversation();
        }
        
        // Stop speech recognition
        if (listening) {
            SpeechRecognition.stopListening();
            resetTranscript();
        }
        
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
        
        // Show transcript summary
        setShowTranscriptSummary(true);
        
        // Reset states
        setRemoteSocketId(null);
        setIsCallActive(false);
        setConnectionStatus('disconnected');
        
        // Close peer connection
        peer.close();
    }, [myStream, remoteStream, listening, resetTranscript, saveSpeechToConversation]);

    // Toggle microphone with speech recognition control
    const toggleMicrophone = useCallback(() => {
        const audioTrack = myStream?.getAudioTracks()[0];
        if (audioTrack) {
            const newMicState = !audioTrack.enabled;
            audioTrack.enabled = newMicState;
            setMic(newMicState);

            // Control speech recognition based on mic state
            if (isCallActive && browserSupportsSpeechRecognition) {
                if (newMicState) {
                    SpeechRecognition.startListening({ continuous: true });
                } else {
                    saveSpeechToConversation(); // Save current speech when muting
                    SpeechRecognition.stopListening();
                }
            }
        }
    }, [myStream, isCallActive, browserSupportsSpeechRecognition, saveSpeechToConversation]);

    // Close transcript summary
    const closeTranscriptSummary = useCallback(() => {
        setShowTranscriptSummary(false);
        // Reset conversation for next call
        setConversationTranscript({ user: "", hr: "" });
    }, []);

    // Combine both transcripts into one continuous string
    const getCombinedTranscript = useCallback(() => {
        const userSpeech = conversationTranscript.user.trim();
        const hrSpeech = conversationTranscript.hr.trim();
        
        // Combine both speeches into one continuous string
        if (userSpeech && hrSpeech) {
            return `${userSpeech} ${hrSpeech}`;
        } else if (userSpeech) {
            return userSpeech;
        } else if (hrSpeech) {
            return hrSpeech;
        }
        return "";
    }, [conversationTranscript]);

    // Debug function to check streams and speech recognition
    const checkStreams = () => {
        console.log('=== STREAM DEBUG INFO ===');
        console.log('Local Stream:', myStream);
        console.log('Remote Stream:', remoteStream);
        console.log('Speech Recognition - Listening:', listening);
        console.log('Speech Recognition - Transcript:', transcript);
        console.log('Browser Support:', browserSupportsSpeechRecognition);
        console.log('User Transcript:', conversationTranscript.user);
        console.log('HR Transcript:', conversationTranscript.hr);
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

    if (!browserSupportsSpeechRecognition) {
        console.warn("Browser doesn't support speech recognition.");
    }

    const combinedTranscript = getCombinedTranscript();

    return (
        <div className="relative">
            {/* Transcript Summary Modal */}
            {showTranscriptSummary && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Interview Conversation Transcript
                                </h2>
                                <button 
                                    onClick={closeTranscriptSummary}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-gray-600 mt-2">
                                Complete conversation between {interviewDetails?.hrId.companyName} and {interviewDetails?.applicantId.name}
                            </p>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {combinedTranscript ? (
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="text-gray-800 text-base leading-7 whitespace-pre-wrap">
                                        {combinedTranscript}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No conversation was recorded during the call.</p>
                                    <p className="text-sm mt-2">Make sure microphone permissions were granted.</p>
                                </div>
                            )}
                            
                            {/* Individual transcripts for reference */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="bg-blue-50 p-3 rounded">
                                    <h4 className="font-semibold text-blue-800 mb-2">Interviewer Speech:</h4>
                                    <div className="whitespace-pre-wrap max-h-32 overflow-y-auto text-gray-700">
                                        {conversationTranscript.hr || "No speech recorded"}
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 rounded">
                                    <h4 className="font-semibold text-green-800 mb-2">Candidate Speech:</h4>
                                    <div className="whitespace-pre-wrap max-h-32 overflow-y-auto text-gray-700">
                                        {conversationTranscript.user || "No speech recorded"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Total words: {combinedTranscript.split(/\s+/).filter(word => word.length > 0).length}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(combinedTranscript);
                                            alert('Transcript copied to clipboard!');
                                        }}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Copy Transcript
                                    </button>
                                    <button
                                        onClick={closeTranscriptSummary}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

                                {/* Speech Recognition Status */}
                                {browserSupportsSpeechRecognition && isCallActive && (
                                    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                            <div className={`w-2 h-2 rounded-full ${listening ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            Speech Recognition: {listening ? 'Active' : 'Inactive'}
                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                                Recording...
                                            </span>
                                        </div>
                                        {transcript && (
                                            <div className="mt-2 p-2 bg-white rounded border text-xs text-left max-h-20 overflow-y-auto">
                                                <strong>Current:</strong> {transcript}
                                            </div>
                                        )}
                                    </div>
                                )}

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

                        {/* Speech recognition indicator in video call */}
                        {browserSupportsSpeechRecognition && isCallActive && (
                            <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm max-w-md">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-2 h-2 rounded-full ${listening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                    {listening ? 'Speech Active' : 'Speech Inactive'}
                                </div>
                                {transcript && (
                                    <p className="text-xs bg-gray-800 p-2 rounded mt-1 max-h-20 overflow-y-auto">
                                        {transcript}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="absolute bottom-3 flex items-center justify-center w-full z-50 gap-4">
                            <button className={`rounded-lg ${camera ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={() => {
                                const videoTrack = myStream?.getVideoTracks()[0];
                                if (videoTrack) {
                                    videoTrack.enabled = !videoTrack.enabled;
                                    setCamera(videoTrack.enabled);
                                }
                            }}>{camera ? <IoVideocam /> : <IoVideocamOff />}</button>
                            
                            <button className={`rounded-lg ${mic ? "bg-gray-500" : "bg-red-600 text-white"} px-8 py-3`} onClick={toggleMicrophone}>
                                {mic ? <BiSolidMicrophone /> : <BiSolidMicrophoneOff />}
                            </button>
                            
                            <button className="inline-flex items-center gap-2 bg-red-600 text-white border-none py-3 px-8 rounded-lg z-50 text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" onClick={handleEndCall}><MdCallEnd /></button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}