import React, { useContext } from 'react'
import { IoVideocam } from "react-icons/io5";
import { AuthContext } from '../../../context/AuthContext';

const Interview = () => {
  const Interviews = [
    { companyName: "TCS", startTime: "2025-10-20T09:30:00Z", endTime: "2025-10-20T10:30:00Z" }
    // { companyName: "CTS", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "EY", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "PWC", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "KPMG", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "Deloitte", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "Zomato", role: "Developer", date: "Aug 31, 2025", time: "14:00:00" },
  ];

  const { user }= useContext(AuthContext);
  console.log(user);

  return (
    <div className='px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8'>Interview Slots</p>

      {
        Interviews.length == 0 ?
          <div>
            <p>Interview not scheduled yet.</p>
            <div className='flex items-center justify-center'>
              <img src="/Sad.png" alt="" className='w-1/3' />
            </div>
          </div> :
          <div className='mt-8'>
            {
              Interviews.map((interview) => {
                return <div className='relative bg-amber-400/20 px-8 py-4 my-4 rounded flex gap-10 hover:shadow-lg'>
                  <img src="/Illustration.png" alt="" className='w-20 h-20' />
                  <div>
                    <p className='font-semibold text-xl'>{interview.companyName}</p>
                    <p>{new Date(interview.startTime).toLocaleString("en-IN", { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(",", " |")} - {new Date(interview.endTime).toLocaleString("en-IN", { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(",", " |")}</p>
                    <div className='p-3 bg-blue-200/50 text-cyan-700 rounded-md'>
                      <p>Please wait patiently. You do not have to take any action now.</p>
                      <p className='font-semibold'>Be online until you hear a ringer from the Interviewer.</p>
                    </div>
                  </div>

                  <button className='absolute flex items-center justify-center px-8 py-1 gap-2 bg-amber-200 rounded-md text-xl font-semibold duration-300 hover:scale-105 cursor-not-allowed top-4 right-8'><IoVideocam className='text-2xl' /> Join</button>
                </div>
              })
            }
          </div>
      }
    </div>
  )
}

export default Interview