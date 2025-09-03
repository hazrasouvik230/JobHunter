import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const AllJobs = () => {
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    (async() => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/job`, { headers: { Authorization: token }});
        console.log(response.data.jobs);
        setAllJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const navigate = useNavigate();

  return (
    <div className='px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8'>All Jobs</p>

      <div className='border'>
        {
          allJobs.map((job) => {
            return <div key={job._id} className='border my-4 p-4 rounded-xl relative'>
              <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-12 w-12 rounded-lg' />
              <p>{job.title}</p>
              <p>{job.company}</p>
              <p>{job.description.slice(0, 200)}...</p>
              <p className='flex gap-2 items-center'><FaBriefcase /> {job.experienceLevel}</p>
              <p className='flex gap-2 items-center'><FaLocationDot /> {job.location.map((loc) => <span>{loc}, </span>)}</p>
              <button className='absolute right-4 bottom-4 bg-amber-300 px-8 py-2 rounded cursor-pointer' onClick={() => navigate(`/user/apply-job/${job._id}`)}>Apply</button>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default AllJobs