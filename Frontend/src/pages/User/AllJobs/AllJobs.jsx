
//! main
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark  } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { GiGraduateCap } from "react-icons/gi";
import { AuthContext } from '../../../context/AuthContext';
import ReactMarkdown from "react-markdown";
import CurrencyFormatter from '../../../CurrencyFormatter';
import { formatDistanceToNow  } from "date-fns";


const AllJobs = () => {
  const { user, setUser } = useContext(AuthContext);
  console.log("User:", user);  

  const [allJobs, setAllJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(3);


  const [filters, setFilters] = useState({
    search: "",
    location: "All Locations",
    jobType: "All Types",
    salary: "Any Salary",
    experience: "Any Experience",
    sortBy: "Created at"
  });


  const filteredJobs = allJobs
  .filter(job => {
    const matchSearch = filters.search === '' || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
      job.companyName.toLowerCase().includes(filters.search.toLowerCase());
    
    // Better location matching for arrays
    const matchLocation = filters.location === 'All Locations' || 
      job.location.some(loc => loc.includes(filters.location));
    
    const matchType = filters.jobType === 'All Types' || job.jobType === filters.jobType;
    const matchSalary = filters.salary === 'Any Salary' || job.salary === filters.salary;
    const matchExperience = filters.experience === 'Any Experience' || job.experience === filters.experience;
    
    return matchSearch && matchLocation && matchType && matchSalary && matchExperience;
  })
  .sort((a, b) => {
    return filters.sortBy === 'Created at'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.deadline) - new Date(b.deadline);
  });

  const fetchAllJobs = async() => {
    try {
      const token = localStorage.getItem("token");

      // Builing query params
      // const params = new URLSearchParams({ page, limit, sortBy: filters.sortBy });
      // if(filters.search) params.append('search', filters.search);
      // if(filters.location !== 'All Locations') params.append('location', filters.location);
      // if(filters.jobType !== 'All Types') params.append('jobType', filters.jobType);
      // if(filters.experience !== 'Any Experience') params.append('experience', filters.experience);
      
      const response = await axios.get(`http://localhost:3000/api/job?page=${page}limit=${limit}`, { headers: { Authorization: token }});
      console.log("All jobs:", response.data.jobs);
      // const checking = response.data.jobs[11].salary;  // Last jobs: 400000 number
      setAllJobs(response.data.jobs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/savedJobs`, { headers: { Authorization: token } });

      const jobId = response.data.savedJobs.map(job => job._id);
      setSavedJobs(jobId);
      console.log("Saved jobs:", response.data.savedJobs);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllJobs();
    fetchSavedJobs();
  }, [page]);

  const handleSave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const isSaved = savedJobs.includes(jobId);

      if(isSaved) {
        await axios.delete(`http://localhost:3000/api/job/unsaveJob/${jobId}`, { headers: { Authorization: token } });
        setSavedJobs(prev => prev.filter(id => id !== jobId));

        // updating the user in localstorage and context
        const updatedUser = { ...user, savedJobs: user.savedJobs.filter(id => id !== jobId) };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
        setSavedJobs(prev => [...prev, jobId]);
      
        // updating the user in localstorage and context
        const updatedUser = { ...user, savedJobs: [ ...user.savedJobs, jobId ] };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      // const response = await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const navigate = useNavigate();

  return (
    <div className='px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-12'>All Jobs</p>

      {/* Filtering */}
      <div className="pt-4 px-4 pb-2 border border-gray-200 rounded-md shadow-md mb-4">
        {/* 1st row */}
        <div className='flex gap-2 mb-4'>
          <div className='relative rounded-md w-3/4'>
            <FaSearch className="absolute left-4 top-[45%] transform -translate-y-1/2 text-gray-400 text-2xl" />
            <input type="text" name="" id="" className='w-full pl-12 border-2 border-gray-200 rounded-md text-base text-gray-800 py-3' placeholder='Search by job title or company' value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
          </div>

          <div className="space-y-2 relative w-1/4">
            <select id='sortBy' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})}>
                <option>Created at</option>
                <option>End date</option>
            </select>
            <label htmlFor='sortBy' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Sort By</label>
          </div>
        </div>

        {/* 2nd row */}
        <div className="w-full flex gap-2">
          <div className="space-y-2 relative w-full">
            <select id='location' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}>
              <option>All Locations</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Chennai</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Remote</option>
            </select>
            <label htmlFor='location' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Location</label>
          </div>
          
          <div className="space-y-2 relative w-full">
            <select id='jobType' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.jobType} onChange={e => setFilters({...filters, jobType: e.target.value})}>
              <option>All Types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
            <label htmlFor='jobType' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Job Type</label>
          </div>

          <div className="space-y-2 relative w-full">
            <select id='salary' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.salary} onChange={e => setFilters({...filters, salary: e.target.value})}>
              <option>Any Salary</option>
              <option>₹3-6 LPA</option>
              <option>₹6-12 LPA</option>
              <option>₹12-20 LPA</option>
              <option>₹20+ LPA</option>
            </select>
            <label htmlFor='salary' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Salary Range</label>
          </div>

          <div className="space-y-2 relative w-full">
            <select id='experience' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.experience} onChange={e => setFilters({...filters, experience: e.target.value})}>
              <option>Any Experience</option>
              <option>0-2 years</option>
              <option>2-5 years</option>
              <option>5-10 years</option>
              <option>10+ years</option>
            </select>
            <label htmlFor='experience' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Experience</label>
          </div>
        </div>
      </div>

      {/* All jobs */}
      <div className='border border-gray-200 rounded-md shadow-2xl w-full h-[600px] overflow-y-auto p-4'>
        {filteredJobs.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-500'>
            <div className='text-6xl mb-4'>😔</div>
            <h3 className='text-2xl font-semibold mb-2'>Sorry, no jobs found</h3>
            <p className='text-gray-400'>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <>
            <div className='flex flex-wrap gap-[1%]'>
              {filteredJobs.map((job) => {
                const isSaved = savedJobs.includes(job._id);
                return (
                  <div key={job._id} className='border border-gray-300 p-4 rounded-xl relative w-[32.6%] mb-4 hover:scale-102 hover:shadow-lg hover:border-gray-600/50 duration-300 ease-in-out'>
                    <div className='absolute h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-35 top-0 left-0 w-full rounded-t-xl -z-5'></div>
                    <div className='flex gap-4'>
                      <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-20 w-20 rounded-lg shadow-lg' />
                      <div>
                        {/* <p className='font-extralight text-xs'>JOB ID: {job._id}</p> */}
                        <p className='font-bold text-xl mt-5'>{job.title}</p>
                        {/* <p className='font-semibold text-lg'>{job.companyName}</p> */}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 my-4">
                      <div className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaBriefcase /> {job.jobType}</div>
                      <div className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaLocationDot /> {job.location.join(", ")}</div>
                      <div className='bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><GiGraduateCap />{job.experienceLevel}</div>
                      {/* <div className='bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><CurrencyFormatter amount={Number(job.salary)} currencyCode="INR" /></div> */}

                      {/* <div className='bg-amber-200 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'>
                        <FaRupeeSign />
                        {job.salary ? 
                          (typeof job.salary === 'number' ? 
                            `${(job.salary / 100000).toFixed(2)} LPA` : 
                            job.salary
                          ) : 
                          'Not specified'
                        }
                      </div> */}

                    </div>

                    <div className='mb-16'>
                      <ReactMarkdown>{job.description ? job.description.slice(0, 200) : "No description available."}</ReactMarkdown>
                    </div>

                    <div className={`absolute left-4 bottom-4`}>
                      <p>Posted on: {formatDistanceToNow(new Date(job.createdAt))} ago</p>
                      <p>{new Date(job.deadline) > Date.now() ? `Deadline in ${formatDistanceToNow(new Date(job.deadline))}` : `Deadline was ${formatDistanceToNow(new Date(job.deadline))} ago`}</p>
                    </div>

                    {/* <p className='flex gap-2 items-center'><FaBriefcase /> {job.experienceLevel}</p>
                    <p className='flex gap-2 items-center'><FaLocationDot /> {job.location.join(", ")}</p> */}
                    {
                      isSaved ? (
                        <FaBookmark className='absolute right-4 top-4 text-gray-800 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
                      ) : (
                        <FaRegBookmark className='absolute right-4 top-4 text-gray-800 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
                      )
                    }

                    <button className={`absolute right-4 bottom-4 py-2 px-8 font-semibold rounded cursor-pointer ${user.appliedJobs.includes(job._id) ? "bg-green-200 text-green-800" : " bg-orange-300/50 text-orange-800 hover:scale-110"}`} onClick={() => navigate(`/user/apply-job/${job._id}`)}>{user.appliedJobs.includes(job._id) ? "Applied" : "Apply"}</button>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {
              totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button className={`py-2 px-6 rounded-lg font-semibold transition-all ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer' }`} onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                  
                  <div className="flex gap-2">
                    {
                      [...Array(totalPages)].map((_, index) => (
                        <button key={index + 1} className={`w-10 h-10 rounded-lg font-semibold transition-all ${page === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer' }`} onClick={() => setPage(index + 1)}>{index + 1}</button>
                      ))
                    }
                  </div>
                  
                  <button className={`py-2 px-6 rounded-lg font-semibold transition-all ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer' }`} onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
                </div>
              )
            }
          </>
        )}
      </div>
    </div>
  )
}

export default AllJobs
