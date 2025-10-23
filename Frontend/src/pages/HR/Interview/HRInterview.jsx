import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SiGooglemeet } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketProvider';

const Interview = () => {
  const { user }= useContext(AuthContext);
  const socket = useSocket();

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    (async() => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/interview/getInterviewByHR", { headers: { Authorization: token } });
        console.log(response.data.interviews);
        setInterviews(response.data.interviews);
      } catch (error) {
        console.log(error);
        alert("something went wrong");
      }
    })();
  }, []);

  const [filtering, setFiltering] = useState("selected_for_interview");

  const filteredInterviews = filtering === "all" ? interviews : interviews.filter(ele => ele.status === filtering);

  console.log(filtering);

  const navigate = useNavigate();

  const handleJoinRoom = useCallback((data) => {
    console.log("Clicked");
    const { roomId } = data;
    navigate(`/interview/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    if(socket) {
      socket.on("room:join", handleJoinRoom);

      return () => {
        socket.off("room:join", handleJoinRoom);
      }
    }
  }, [socket, handleJoinRoom]);

  const joinRoom = useCallback(meetingLink => {
    if (socket && user) {
      const email = user.email;
      const role = user.role;
      const roomId = meetingLink;

      socket.emit("room:join", { email, roomId, role });
      console.log("Joining room:", { email, roomId, role });
    }
  }, [socket, user]);

  return (
    <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50 min-h-screen'>
      <div className='text-center mb-8 mt-16'>
          <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

          <p className='text-4xl font-bold text-shadow-lg text-gray-900 mb-4'>Scheduled Interviews</p>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Intelligence behind every interview.</p>
      </div>

      {
        interviews.length == 0 ? (
          <p>No interviews.</p>
        ) : (
          // <div className='bg-white border-2 border-gray-200 rounded-xl shadow-xl p-6 flex flex-col gap-4'>
          <div className='relative'>
            <div className="flex gap-4 justify-end mb-4 absolute -top-14 right-0">
              <select name="filtering" id="filtering" className='border p-2 rounded-lg border-blue-200 bg-white shadow-lg outline-none cursor-pointer' value={filtering} onChange={e => setFiltering(e.target.value)}>
                <option value="all">All</option>
                <option value="selected_for_interview">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className='flex flex-col gap-4'>
              {
                filteredInterviews.map(interview => {
                  return <div key={interview._id} className='border-2 p-6 rounded-lg border-blue-100 shadow-lg bg-white'>
                    <p className='text-2xl font-semibold'>{interview.jobId.title}</p>
                    <div className='flex items-center justify-between mt-8'>
                      <div className='border flex relative p-4 px-10 bg-blue-50 border-gray-200 rounded-lg'>
                        <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Candidate details:</p>
                        <div>
                          <p>Name: {interview.applicantId.name}</p>
                          <p>Email: {interview.applicantId.email}</p>
                        </div>
                      </div>
                      <div className='border flex relative p-4 px-10 bg-blue-50 border-gray-200 rounded-lg'>
                        <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Interview details:</p>
                        <div>
                          <p>Date: {new Date(interview.date).toUTCString().slice(0, 16)}</p>
                          <p>Time: {interview.startTime} - {interview.endTime}</p>
                        </div>
                      </div>

                      <div className='border flex relative p-4 px-10 bg-blue-50 border-gray-200 rounded-lg'>
                        <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Status</p>
                        <p>{interview.status === "selected_for_interview" ? "Scheduled" : "Completed"}</p>
                      </div>

                      <div className='border flex relative p-4 px-14 bg-blue-50 border-gray-200 rounded-lg'>
                        <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Rating</p>
                        <p>{interview.rating}</p>
                      </div>

                      <button className={`flex gap-2 items-center px-8 py-2 rounded-md text-white ${interview.status === "completed" ? "bg-gray-400 cursor-not-allowed" : "bg-sky-500  cursor-pointer"}`} disabled={interview.status === "completed"} onClick={() => {
                        if(interview.status !== "completed") {
                          joinRoom(interview.meetingLink)
                          }
                        }}><SiGooglemeet />Join Meeting</button>
                    </div>
                  </div>
                })
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Interview