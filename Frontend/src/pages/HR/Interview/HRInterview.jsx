import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SiGooglemeet } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';

const Interview = () => {
  const HRInterviews = [
    { userName: "Souvik", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    { userName: "Sandhit", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    { userName: "Protyush", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    { userName: "Tanmoy", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    { userName: "Prajal", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    { userName: "Sanjay", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
  ];

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

  const navigate = useNavigate();

  return (
    <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
      <div className='text-center mb-8 mt-16'>
          <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

          <p className='text-4xl font-bold text-gray-900 mb-4'>Scheduled Interviews</p>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Hire smarter. Grow faster.</p>
      </div>

      {
        interviews.length == 0 ? (
          <p>No interviews.</p>
        ) : (
          <div className='bg-white border-2 border-gray-400 rounded-xl shadow-xl p-6 flex flex-col gap-4'>
            {
              interviews.map(interview => {
                return <div key={interview._id} className='border-2 p-6 rounded-lg border-blue-100 shadow-lg'>
                  <p className='text-2xl font-semibold'>{interview.jobId.title}</p>
                  <div className='flex items-center justify-between mt-8'>
                    <div className='border flex relative p-4 px-10 bg-blue-50 border-gray-200 rounded-lg'>
                      <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Candidate details:</p>
                      <p>{interview.applicantId.name}</p>
                      ~
                      <p>{interview.applicantId.email}</p>
                    </div>
                    <div className='border flex relative p-4 px-10 bg-blue-50 border-gray-200 rounded-lg'>
                      <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Interview details:</p>
                      <p>{interview.date}</p>
                      ~
                      <p>{interview.startTime} - {interview.endTime}</p>
                    </div>

                    <div className='border flex relative p-4 px-10 bg-blue-50 border-gray-200 rounded-lg'>
                      <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Status</p>
                      <p>{interview.status}</p>
                    </div>

                    <div className='border flex relative p-4 px-14 bg-blue-50 border-gray-200 rounded-lg'>
                      <p className='bg-white px-2 absolute -top-4 left-2 border-2 border-blue-200 rounded-md'>Rating</p>
                      <p>{interview.rating}</p>
                    </div>

                    <button className='flex gap-2 items-center bg-sky-500 px-8 py-2 rounded-md cursor-pointer text-white' onClick={() => navigate(`/interview/${interview.meetingLink}`)}><SiGooglemeet />Join Meeting</button>
                  </div>
                </div>
              })
            }
          </div>
        )
      }
    </div>
  )
}

export default Interview