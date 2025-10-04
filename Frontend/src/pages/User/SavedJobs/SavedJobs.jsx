import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark  } from "react-icons/fa6";

const SavedJobs = () => {
  const { user, setUser } = useContext(AuthContext);

  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    (async() => {
      try {
        const token = localStorage.getItem("token");
        const resposnse = await axios.get("http://localhost:3000/api/savedJobs", { headers: { Authorization: token } });
        console.log(resposnse.data);
        setSavedJobs(resposnse.data.savedJobs)
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const navigate = useNavigate();
  
  return (
    <div className='px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-24'>Saved Jobs</p>

      <div>
        {
          savedJobs.length > 0 ?
            <div className='border'>
                    {
                      savedJobs.map((job) => {
                        return <div key={job._id} className='border border-l-4 my-4 p-4 rounded-xl relative'>
                          <div className='flex gap-4'>
                            <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-16 w-16 rounded-lg' />
                            <div>
                              <p className='text-xl font-semibold'>{job.title}</p>
                              <p className='text-2xl font-bold'>{job.companyName}</p>
                            </div>
                          </div>
                              <div className='mt-4 flex gap-2'>
                                <span className='px-6 py-2 rounded-3xl bg-gradient-to-br from-[#fef3c7] to-[#fde047] text-[#92400e]'><b>₹ {job.salary}</b></span>
                                <span className='px-6 py-2 rounded-3xl bg-gradient-to-br from-[#dbeafe] to-[#93c5fd] text-[#1e40af]'><b>{job.experienceLevel}</b></span>
                                <span className='px-6 py-2 rounded-3xl bg-gradient-to-br from-[#d1fae5] to-[#6ee7b7] text-[#065f46]'><b>{job.jobType}</b></span>
                              </div>

                              <p className='flex items-center gap-2'><FaLocationDot />{job.location.join(", ")}</p>
                              <ReactMarkdown>{job.description ? job.description.slice(0, 200) : "No description available."}</ReactMarkdown>
                          
                          {/* <ReactMarkdown>{job.description ? job.description.slice(0, 200) : "No description available."}</ReactMarkdown>
                          <p className='flex gap-2 items-center'><FaBriefcase /> {job.experienceLevel}</p>
                          <p className='flex gap-2 items-center'><FaLocationDot /> {job.location.map((loc) => <span key={loc}>{loc}, </span>)}</p> */}

                          {/* {
                            isSaved ? (
                              <FaBookmark className='absolute right-4 top-4 text-amber-5npm run dev00 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
                            ) : (
                              <FaRegBookmark  className='absolute right-4 top-4 text-gray-300 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
                            )
                          } */}
                          
                          <button className='absolute right-4 bottom-4 bg-amber-300 px-8 py-2 rounded cursor-pointer' onClick={() => navigate(`/user/apply-job/${job._id}`)}>Show details</button>
                        </div>
                      })
                    }
                  </div> : <p>No job is selected as your favourit job.</p>
        }
      </div>
    </div>
  )
}

export default SavedJobs