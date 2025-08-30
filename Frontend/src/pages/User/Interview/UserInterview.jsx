import React from 'react'
import { IoVideocam } from "react-icons/io5";

const Interview = () => {
  const Interviews = [
    // { companyName: "TCS", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "CTS", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "EY", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "PWC", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "KPMG", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "Deloitte", role: "Service", date: "Aug 31, 2025", time: "14:00:00" },
    // { companyName: "Zomato", role: "Developer", date: "Aug 31, 2025", time: "14:00:00" },
  ];

  return (
    <div className='px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8'>Interview</p>

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
                return <div className='bg-amber-400/20 px-8 py-4 my-4 rounded flex items-center justify-between hover:shadow-lg'>
                  <p>{interview.companyName}</p>
                  <p>{interview.role}</p>
                  <p>{interview.date}</p>
                  <p>{interview.time}</p>
                  <button className='flex items-center justify-center px-8 py-1 gap-2 bg-amber-200 rounded-md text-xl font-semibold duration-300 hover:scale-105 cursor-not-allowed'><IoVideocam className='text-2xl' /> Join</button>
                </div>
              })
            }
          </div>
      }
    </div>
  )
}

export default Interview