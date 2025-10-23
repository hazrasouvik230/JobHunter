import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { FaBookmark } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { formatDistanceToNow } from "date-fns";

const SavedJobs = () => {
  const { user, setUser } = useContext(AuthContext);

  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(9);
  const [loading, setLoading] = useState(false);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/job/savedJobs?page=${page}&limit=${limit}`, 
        { headers: { Authorization: token } }
      );
      console.log(response.data);
      setSavedJobs(response.data.savedJobs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [page]);

  const handleUnsave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`http://localhost:3000/api/job/unsaveJob/${jobId}`, { 
        headers: { Authorization: token } 
      });
      
      setSavedJobs(prev => prev.filter(job => job._id !== jobId));

      const updatedUser = { 
        ...user, 
        savedJobs: user.savedJobs.filter(id => id !== jobId) 
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (savedJobs.length === 1 && page > 1) {
        setPage(page - 1);
      } else if (savedJobs.length === 1 && page === 1) {
        fetchSavedJobs();
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  
  return (
    <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
        <div className='text-center mb-8 mt-16'>
            <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

            <p className='text-4xl font-bold text-gray-900 mb-4'>Saved Jobs</p>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
        </div>

      {
        loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-2xl text-gray-500'>Loading...</div>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
            <div className='text-6xl mb-4'>📌</div>
            <h3 className='text-2xl font-semibold mb-2'>No saved jobs yet</h3>
            <p className='text-gray-400'>Jobs you bookmark will appear here</p>
          </div>
        ) : (
          <>
            <div className='flex flex-wrap gap-[1%]'>
              {
                savedJobs.map((job) => {
                  return (
                    <div key={job._id} className='border border-gray-300 p-4 rounded-xl relative w-[32.6%] shadow-lg mb-4 hover:scale-102 hover:shadow-lg hover:border-gray-600/50 duration-300 ease-in-out'>
                      <div className='absolute h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-35 top-0 left-0 w-full rounded-t-xl'></div>
                      <div className='flex gap-4 relative z-10'>
                        <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-20 w-20 rounded-lg shadow-lg' />
                        
                        <div><p className='font-bold text-xl mt-5'>{job.title}</p></div>
                      </div>

                      <div className="flex flex-wrap gap-2 my-4">
                        <div className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaBriefcase /> {job.jobType}</div>
                        
                        <div className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaLocationDot /> {job.location.join(", ")}</div>
                        
                        <div className='bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><GiGraduateCap />{job.experienceLevel}</div>
                      </div>

                      <div className='mb-16'>
                        <ReactMarkdown>
                          {job.description ? job.description.slice(0, 200) : "No description available."}
                        </ReactMarkdown>
                      </div>

                      <div className='absolute left-4 bottom-4'>
                        <p className='text-xs'>Posted: {formatDistanceToNow(new Date(job.createdAt))} ago</p>
                        
                        <p className='text-xs'>
                          {
                            new Date(job.deadline) > Date.now() ? `Deadline in ${formatDistanceToNow(new Date(job.deadline))}` : `Deadline was ${formatDistanceToNow(new Date(job.deadline))} ago`
                          }
                        </p>
                      </div>

                      <FaBookmark className='absolute right-4 top-4 text-gray-800 cursor-pointer hover:scale-110 transition-colors z-10' onClick={() => handleUnsave(job._id)} title="Remove from saved jobs" />

                      <button className={`absolute right-4 bottom-4 py-2 px-8 font-semibold rounded cursor-pointer ${user.appliedJobs.includes(job._id) ? "bg-green-200 text-green-800" : "bg-orange-300/50 text-orange-800 hover:scale-110"}`} onClick={() => navigate(`/user/apply-job/${job._id}`)}>{user.appliedJobs.includes(job._id) ? "Applied" : "Show details"}</button>
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
        )
      }
    </div>
  );
};

export default SavedJobs;