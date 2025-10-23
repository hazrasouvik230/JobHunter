import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BsBriefcaseFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosTimer } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { GiSkills } from "react-icons/gi";
import { formatDistanceToNow  } from "date-fns";

import UserDetails from "../UserDetails";
import currencyFormatter from '../../../CurrencyFormatter';

const AllPostedJobs = () => {
    const [allPostedJobs, setAllPostedJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    const fetchPostedJobs = async (page = 1) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/job/allPostedJobsByHR?page=${page}&limit=2`, { headers: { Authorization: token } });
        console.log(response.data.jobs);
        setAllPostedJobs(response.data.jobs);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalJobs(response.data.pagination.totalJobs);
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(() => {
      fetchPostedJobs(1);
    }, []);

    const navigate = useNavigate();

    const handleEdit = (job) => {
      navigate("/hr/post-job", { state: { jobData: job, isEdit: true } });
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            fetchPostedJobs(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            fetchPostedJobs(currentPage - 1);
        }
    };

    const handlePageClick = (page) => {
        fetchPostedJobs(page);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
      <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
        <div className='text-center mb-8 mt-16'>
            <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

            <p className='text-4xl font-bold text-shadow-lg text-gray-900 mb-4'>All Posted Jobs</p>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Discover talent. Drive success.</p>
        </div>

        <div>
          {
            allPostedJobs?.length > 0 ?
              <div className='flex justify-between gap-2'>
                <div className='bg-white border-2 border-gray-400 rounded-xl shadow-xl w-2/3 px-6 py-3'>
                  {
                    allPostedJobs.map((allJobs) => {
                      return <div key={allJobs._id} className='border border-gray-400 border-l-8 my-4 px-8 py-4 rounded-lg hover:shadow-lg hover:scale-102 transition-all duration-200 ease-in-out'>
                        <p className='text-xs font-normal text-gray-600'>JOB ID: {allJobs._id}</p>
                        <p className='text-2xl font-bold'>{allJobs.title}</p>

                        <div className="flex gap-4 my-4 flex-wrap">
                          <p className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 font-medium rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><BsBriefcaseFill className='text-base' /> {allJobs.jobType}</p>
                          <p className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-medium rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaLocationDot />{allJobs.location.join(", ")}</p>
                          <p className='bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-medium rounded-2xl px-6 py-1 flex items-center justify-center gap-2'>{currencyFormatter({ amount: allJobs.salary })} LPA</p>
                          <p className='bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 font-medium rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><IoIosTimer className='font-extrabold' />{formatDistanceToNow(new Date(allJobs.createdAt))} ago</p>
                        </div>

                        <div className='flex gap-2'>
                          <p className='bg-blue-100 text-blue-800 font-semibold px-8 py-1 rounded-2xl flex items-center gap-4'><GiSkills />{allJobs.requirements.join(", ")}</p>
                        </div>
                        
                        <hr className='my-4 text-gray-400' />

                        <div className='flex items-center justify-between'>
                          <div className='flex  gap-4'>
                            <p className='border border-gray-400 shadow-lg px-4 py-1 rounded-md flex items-center justify-center gap-2'>
                              <FaUserFriends className='border-2 text-4xl p-1 rounded-md text-blue-700' />
                              <div>
                                <p>Applicants</p>
                              <p>{allJobs.applicants?.length || 0}</p>
                              </div>
                            </p>
                            <p className='border border-gray-400 shadow-lg px-4 py-1 rounded-md flex items-center justify-center gap-2'>
                              <FaUserCheck className='border-2 text-4xl p-1 rounded-md text-green-700' />
                              <div>
                                <p>Selected</p>
                                <p>0</p>
                              </div>
                            </p>
                          </div>

                          <div className='flex gap-4'>
                            <button className='px-6 py-2 bg-blue-300 rounded-md font-semibold cursor-pointer flex items-center justify-center gap-2 hover:font-bold' onClick={() => handleEdit(allJobs)}>Edit <MdEdit /></button>
                            <button className='px-6 py-2 bg-blue-700 text-white font-semibold rounded-md cursor-pointer flex items-center justify-center gap-2 hover:font-bold' onClick={() => navigate(`/hr/specific-job/${allJobs._id}`)}>View Details<FaChevronRight /></button>
                          </div>
                        </div>
                      </div>
                    })
                  }

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-center py-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            {/* Previous Button */}
                            <button onClick={handlePrevPage} disabled={currentPage === 1} className={`px-6 py-2 rounded-lg text-sm font-medium ${ currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer' }`} >Previous</button>

                            {/* Page Numbers */}
                            {
                              getPageNumbers().map(page => (
                                <button key={page} onClick={() => handlePageClick(page)} className={`px-6 py-2 rounded-lg text-sm font-medium ${ currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer' }`} >{page}</button>
                              ))
                            }

                            {/* Next Button */}
                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`px-3 py-2 rounded-lg text-sm font-medium ${ currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer' }`} >Next</button>
                        </div>
                    </div>
                  )}
                </div>

                <div className="w-1/3"><UserDetails /></div>
              </div> :
              <p>You've not post any job yet.</p>
          }
        </div>
      </div>
    )
}

export default AllPostedJobs