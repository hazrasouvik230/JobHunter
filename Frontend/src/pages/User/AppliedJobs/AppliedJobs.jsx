import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown"
import axios from 'axios';
import { FaBriefcase, FaRegClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { AuthContext } from '../../../context/AuthContext';
import CurrencyFormatter from '../../../CurrencyFormatter';
import { formatDistanceToNow  } from "date-fns";
import { Link } from 'react-router-dom';

const AppliedJobs = () => {
    const { user, setUser } = useContext(AuthContext);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [limit] = useState(6);

    const getApplicationStatus = (job) => {
        if(!job?.applicants || !user?._id) return 'applied';
        
        const userApplication = job.applicants.find(
            applicant => applicant.applicantId === user._id
        );
        return userApplication?.status || 'applied';
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'selected_for_interview': {
                text: 'Interview Scheduled',
                className: 'bg-yellow-100/50 text-yellow-800 px-4 py-2 rounded-md'
            },
            'rejected': {
                text: 'Rejected',
                className: 'bg-red-100/50 text-red-800 px-4 py-2 rounded-md'
            },
            'under_review': {
                text: 'Hired',
                className: 'bg-green-100/50 text-green-800 px-4 py-2 rounded-md'
            },
            'applied': {
                text: 'Applied',
                className: 'bg-blue-100/50 text-gray-800 px-4 py-2 rounded-md'
            }
        };
        
        return statusConfig[status] || statusConfig.applied;
    };

    const fetchAppliedJobs = async (pageNum = page) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3000/api/allAppliedJobs?page=${pageNum}&limit=${limit}`, 
                { headers: { Authorization: token } }
            );
            
            setAppliedJobs(response.data.appliedJobs);
            setTotalPages(response.data.pagination.totalPages);
            setPage(response.data.pagination.currentPage);
        } catch (error) {
            console.error("Error fetching applied jobs:", error);
            alert("Failed to load applied jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeApplication = async (jobId) => {
        const confirmation = window.confirm("Are you sure to revoke the application?");
        if(!confirmation) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `http://localhost:3000/api/job/revokeApplication/${jobId}`, 
                { headers: { Authorization: token } }
            );

            // Update local state
            setAppliedJobs(prev => prev.filter(job => job._id !== jobId));
            
            // Update user context
            const updatedUser = {
                ...user, 
                appliedJobs: user.appliedJobs.filter(id => id !== jobId)
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            alert("Application revoked successfully");
        } catch (error) {
            console.error("Error revoking application:", error);
            alert("Failed to revoke application");
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchAppliedJobs(newPage);
    };

    useEffect(() => {
        fetchAppliedJobs(1); // Start with page 1
    }, []);

    if (loading) {
        return (
            <div className="px-6 md:px-32 py-12 pb-20 bg-gray-50 flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading applied jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute">
                    <Link to="/user/all-jobs" className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">
                        Back
                    </Link>
                </div>

                <p className='text-4xl font-bold text-shadow-lg text-gray-900 mb-4'>Applied Jobs</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Track your job applications</p>
            </div>

            {/* <div className='border border-gray-200 rounded-md shadow-2xl w-full h-[600px] overflow-y-auto p-4'> */}
                {appliedJobs?.length > 0 ? (
                    <>
                        <div className='flex flex-wrap gap-[1%]'>
                            {appliedJobs.map((job) => {
                                const status = getApplicationStatus(job);
                                const statusDisplay = getStatusBadge(status);
                                const isDeadlinePassed = new Date(job.deadline) < new Date();

                                return (
                                    <div key={job._id} className='border border-gray-300 p-4 rounded-xl relative w-full shadow-lg md:w-[32.6%] mb-4 hover:scale-102 hover:shadow-lg hover:border-gray-600/50 duration-300 ease-in-out'>
                                        <div className='absolute h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-35 top-0 left-0 w-full rounded-t-xl z-5'></div>
                                        <div className='flex gap-4'>
                                            <img 
                                                src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} 
                                                alt={job.companyName} 
                                                className='h-22 w-22 rounded-lg shadow-lg z-10' 
                                            />
                                            <div className='z-10'>
                                                <p className='font-bold text-xl mt-5'>{job.title}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 my-4 mb-8">
                                            <div className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-2xl px-4 py-1 flex items-center gap-2 text-sm'>
                                                <FaBriefcase /> {job.jobType}
                                            </div>
                                            <div className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl px-4 py-1 flex items-center gap-2 text-sm'>
                                                <FaLocationDot /> {job.location?.join(", ") || 'Remote'}
                                            </div>
                                            <div className='bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-2xl px-4 py-1 flex items-center gap-2 text-sm'>
                                                <GiGraduateCap /> {job.experienceLevel}
                                            </div>
                                            <div className='bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-2xl px-4 py-1 flex items-center gap-2 text-sm'>
                                                <CurrencyFormatter amount={Number(job.salary)} currencyCode="INR" />
                                            </div>
                                            {/* <div className='bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 rounded-2xl px-4 py-1 flex items-center gap-2 text-sm'>
                                                <FaRegClock /> {formatDistanceToNow(new Date(job.createdAt))} ago
                                            </div> */}
                                            {/* <div className={`bg-gradient-to-r rounded-2xl px-4 py-1 flex items-center gap-2 text-sm ${
                                                isDeadlinePassed 
                                                    ? 'from-red-100 to-rose-100 text-red-800' 
                                                    : 'from-green-100 to-emerald-100 text-green-800'
                                            }`}>
                                                <BsCalendarDate /> 
                                                {isDeadlinePassed 
                                                    ? `Closed ${formatDistanceToNow(new Date(job.deadline))} ago`
                                                    : `Closes in ${formatDistanceToNow(new Date(job.deadline))}`
                                                }
                                            </div> */}
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

                                        <span className={`absolute right-2 top-2 text-xs font-semibold px-3 py-1 rounded-2xl z-10 ${statusDisplay.className}`}>
                                            {statusDisplay.text}
                                        </span>
                                        
                                        {status === 'applied' && (
                                            <button 
                                                className='bg-red-200/50 absolute right-2 bottom-2 text-red-800 font-semibold px-4 py-1 rounded-md cursor-pointer hover:scale-105 hover:bg-red-300/50 transition-all'
                                                onClick={() => handleRevokeApplication(job._id)}
                                            >
                                                Revoke Application
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button 
                                    className={`py-2 px-6 rounded-lg font-semibold transition-all ${
                                        page === 1 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
                                    }`}
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                
                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button 
                                            key={index + 1}
                                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                                page === index + 1 
                                                    ? 'bg-indigo-600 text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                            }`}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    className={`py-2 px-6 rounded-lg font-semibold transition-all ${
                                        page === totalPages 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
                                    }`}
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">You haven't applied for any jobs yet.</p>
                        <Link 
                            to="/user/all-jobs" 
                            className="inline-block mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                )}
            {/* </div> */}
        </div>
    );
};

export default AppliedJobs;