import React, { useCallback, useContext, useEffect, useState } from 'react'
import { IoVideocam } from "react-icons/io5";
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../../../context/SocketProvider';
import Error from '../../Error';

const Interview = () => {
  const { user }= useContext(AuthContext);
  const socket = useSocket();

  const [interviews, setInterviews] = useState([]);
  const [unauthorize, setUnauthorize] = useState(false);

  useEffect(() => {
    (async() => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/interview/getInterviews`, { headers: { Authorization: token } });
        console.log(response.data);
        setInterviews(response.data.interviews);
      } catch (error) {
        console.log(error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setUnauthorize(true);
        }
      }
    })();
  }, []);

  const filteredInterviews = interviews.filter(ele => ele.status !== "completed");

  const navigate = useNavigate();

  const handleJoinRoom = useCallback((data) => {
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

  if (unauthorize) {
    return <Error />
  }

  return (
    <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
      <div className='text-center mb-8 mt-16'>
          <div className="absolute">
              <Link to="/user/all-jobs" className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">Back</Link>
          </div>

          <p className='text-4xl font-bold text-gray-900 text-shadow-lg mb-4'>Interview Slots</p>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Track your job applications</p>
      </div>

      {
        interviews.length == 0 ?
          <div>
            <p>Interview not scheduled yet.</p>
            <div className='flex items-center justify-center'>
              <img src="/Sad.png" alt="" className='w-1/3' />
            </div>
          </div> :
          <div className='mt-8'>
            {
              filteredInterviews.map((interview) => {
                return <div className='relative bg-amber-400/20 px-8 py-4 my-4 rounded flex gap-10 hover:shadow-lg' key={interview._id}>
                  <img src={`http://localhost:3000/uploads/company-logos/${interview.hrId.companyLogo}`} alt="" className='w-20 h-20 rounded-md' />
                  <div>
                    <p className='font-semibold text-xl'>{interview.hrId.companyName}</p>
                    <p className='font-semibold text-sm'>{interview.jobId.title}</p>
                    <p>{new Date(interview.date).toLocaleDateString()} | {interview.startTime} - {new Date(interview.date).toLocaleDateString()} | {interview.endTime}</p>
                    <div className='p-3 bg-blue-200/50 text-cyan-700 rounded-md'>
                      <p>Please wait patiently. You do not have to take any action now.</p>
                      <p className='font-semibold'>Be online until you hear a ringer from the Interviewer.</p>
                    </div>
                  </div>

                  <button className='absolute flex items-center justify-center px-8 py-1 gap-2 bg-amber-200 rounded-md text-xl font-semibold duration-300 hover:scale-105 cursor-not-allowed top-4 right-8' onClick={() => joinRoom(interview.meetingLink)}><IoVideocam className='text-2xl' /> Join</button>
                </div>
              })
            }
          </div>
      }
    </div>
  )
}

export default Interview