import { useEffect, useState } from "react"
import axios from "../../../config/axios"
import { Link, useNavigate, useParams } from "react-router-dom";

export default function SpecificUserDetails() {
    const { id } = useParams();
    const [fetchedUser, setFetchedUser] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(2);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            const response = await axios.get(`/api/specificUserDetails/${id}`, { headers: { Authorization: token } } );
            console.log(response.data.responseUser);
            setFetchedUser(response.data.responseUser);
        })();
    }, []);

    const navigate = useNavigate();

    const handleRemove = async (id) => {
        console.log(id);
        const adminConfirm = window.confirm(`Are you sure to remove ${id}`);
        if(adminConfirm) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.delete(`http://localhost:3000/api/admin/removeUser/${id}`, { headers: { Authorization: token }});
                console.log(response.data);

                if(response.data.success) {
                    navigate("/admin/all-users");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleDeleteUserJob = (id) => {
        const adminConfirm = window.confirm(`Are you sure to remove ${id}`);
        if(adminConfirm) {
            alert("Removed");
            // navigate("/admin/all-users");
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const paginationInfo = data => {
        if(!data) return [];

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return data.slice(startIndex, endIndex);
    };

    const applicationStatus = (job) => {
        if (!job?.applicants || !fetchedUser?.user?._id) return "Not Applied";
        
        const userApplication = job.applicants.find(
            applicant => applicant.applicantId === fetchedUser.user._id
        );
        
        return userApplication ? userApplication.status : "Not Applied";
    };

    const statusInfo = (status) => {
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

    useEffect(() => {
        if (fetchedUser) {
            let dataLength = 0;
            if(fetchedUser.user?.role === "User") {
                dataLength = fetchedUser.user?.appliedJobs?.length || 0;
            } else if (fetchedUser.user?.role === "HR") {
                dataLength = fetchedUser.jobs?.length || 0;
            }
            setTotalPages(Math.ceil(dataLength / limit));
        }
    }, [fetchedUser, limit]);

    useEffect(() => {
        setPage(1);
    }, [id]);

    return (
        <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/admin/all-users">Back</Link></span></div>

                <p className='text-4xl font-bold text-shadow-lg text-gray-900 mb-4'>Specific User Details</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Know about your specific user</p>
            </div>

            <div className="flex gap-4">
                <div className='bg-white border-2 border-gray-300 w-1/3 p-8 rounded-3xl shadow-xl'>
                    <div className="flex items-center flex-col">
                        <img src={`http://localhost:3000/uploads/profile-images/${fetchedUser?.user?.profileImage}`} alt={fetchedUser?.user?.name} className='h-32 w-32 rounded-full border-3 border-gray-400' />
                        <p className="text-xl font-bold">{fetchedUser?.user?.name}</p>
                        <p className="text-md font-semibold text-blue-600">{fetchedUser?.user?.role} {fetchedUser?.user?.role === "HR" ? "Manager" : ""}</p>
                    </div>
                    
                    <hr className="text-gray-300 my-4" />
                    
                    <p>Email address: {fetchedUser?.user?.email}</p>

                    {
                        fetchedUser?.user?.role === "HR" && <p>Company name: {fetchedUser?.user?.companyName}</p>
                    }
                    <p>Userid: {fetchedUser?.user?._id}</p>
                    
                    <hr className="text-gray-300 my-4" />

                    {/* User */}
                    {
                        fetchedUser?.user?.role === "User" && (
                            <div className="flex items-center justify-around">
                                <div className="px-10 py-2 flex items-center flex-col rounded-2xl bg-gradient-to-l from-cyan-300 to-cyan-400 text-white">
                                    <p className="text-2xl font-bold">{fetchedUser?.user?.appliedJobs.length || 0}</p>
                                    <p className="font-semibold">Applied</p>
                                </div>
                                <div className="px-10 py-2 flex items-center flex-col rounded-2xl bg-gradient-to-r from-cyan-300 to-cyan-400 text-white">
                                    <p className="text-2xl font-bold">{fetchedUser?.jobs?.filter(job => new Date(job.deadline) >= Date.now()).length || 0}</p>
                                    <p className="font-semibold">Response</p>
                                </div>
                            </div>
                        )
                    }

                    {/* HR */}
                    {
                        fetchedUser?.user?.role === "HR" && (
                            <div className="flex items-center justify-around">
                                <div className="px-10 py-2 flex items-center flex-col rounded-2xl bg-gradient-to-l from-cyan-300 to-cyan-400 text-white">
                                    <p className="text-2xl font-bold">{fetchedUser?.jobs?.length}</p>
                                    <p className="font-semibold">Total Jobs</p>
                                </div>
                                <div className="px-10 py-2 flex items-center flex-col rounded-2xl bg-gradient-to-r from-cyan-300 to-cyan-400 text-white">
                                    <p className="text-2xl font-bold">{fetchedUser?.jobs?.filter(job => new Date(job.deadline) >= Date.now()).length || 0}</p>
                                    <p className="font-semibold">Live Jobs</p>
                                </div>
                            </div>
                        )
                    }

                    <div className="border mt-4 flex items-center justify-center flex-col gap-6 py-10 rounded-2xl bg-red-300/50 border-red-600">
                        <p className="text-red-600">Remove this user and all associated data</p>
                        <button className="bg-red-400 px-8 py-2 rounded-lg font-semibold text-white cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-red-300" onClick={() => handleRemove(fetchedUser?.user?._id)}>Remove User</button>
                    </div>
                </div>
                
                <div className='bg-white border-2 border-gray-300 w-2/3 rounded-3xl shadow-xl'>
                    {/* User */}
                    {
                        fetchedUser?.user?.role === "User" && (
                            <>
                                <div className="p-8">
                                    <p className="text-2xl font-bold">Applied Jobs:</p>
                                    <div className="flex flex-col">
                                        {
                                            paginationInfo(fetchedUser?.user?.appliedJobs)?.map(job => {
                                                const status = applicationStatus(job);
                                                const statusDisplay = statusInfo(status);

                                                return <div key={job._id} className="border mx-2 p-4 py-6 rounded-md shadow-lg my-2.5 max-w-5xl relative">
                                                    <div className="absolute h-12 bg-amber-200 w-full -z-10 left-0 top-0 rounded-t-md"></div>
                                                        <p className="absolute top-4 right-4 px-4 py-1 bg-gradient-to-l from-blue-400 to-purple-500 text-white font-semibold rounded-2xl">{job?.jobType}</p>
                                                        
                                                        <div className="flex gap-4">
                                                            <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyName} className='h-12 w-12 rounded-md shadow-md' />
                                                            
                                                            <div>
                                                                <p className="text-xl font-bold">{job.title}</p>
                                                                <p className="text-xs text-gray-400">Job ID: {job._id}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center my-3 gap-30">
                                                        <div className="pl-2 pr-6">
                                                            <p>STATUS</p>
                                                            <p className={statusDisplay.className}>{statusDisplay.text}</p>
                                                        </div>
                                                        <div className="pl-2 pr-6">
                                                            <p>POSTED ON</p>
                                                            <p>{new Date(job?.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="pl-2 pr-8">
                                                            <p>DEADLINE</p>
                                                            <p>{new Date(job?.deadline).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <hr className="text-gray-300 my-4" />

                                                    <div className="w-full flex items-center justify-between gap-2">
                                                        <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-102">View Details</button>
                                                        <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-102">Edit</button>
                                                        <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-102">Delete</button>
                                                    </div>
                                                </div>
                                            })
                                        }
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
                                </div>
                            </>
                        )
                    }

                    {/* HR */}
                    {
                        fetchedUser?.user?.role === "HR" && (
                            <>
                                <div className="p-8">
                                    <p className="text-2xl font-bold">Posted Jobs:</p>
                                    <div className="flex flex-col">
                                        {
                                            paginationInfo(fetchedUser?.jobs)?.map(job => {
                                                return <div key={job._id} className="border-2 border-gray-200 mx-2 p-4 py-6 rounded-xl shadow-lg my-2.5 max-w-5xl relative">
                                                    <p className="absolute top-4 right-4 px-4 py-1 bg-gradient-to-l from-blue-400 to-purple-500 text-white font-semibold rounded-2xl">{job?.jobType}</p>
                                                    <div className="flex gap-4">
                                                        <img src={`http://localhost:3000/uploads/company-logos/${fetchedUser?.user?.companyLogo}`} alt={fetchedUser?.user?.companyName} className='h-12 w-12 rounded-md shadow-md' />
                                                        <div>
                                                            <p className="text-xl font-bold">{job.title}</p>
                                                            <p className="text-xs text-gray-400">Job ID: {job._id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center my-3 gap-30">
                                                        <div className="pl-2 pr-6">
                                                            <p>APPLICANTS</p>
                                                            <p>{job.applicants.length} Application</p>
                                                        </div>
                                                        <div className="pl-2 pr-6">
                                                            <p>POSTED ON</p>
                                                            <p>{new Date(job?.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="pl-2 pr-8">
                                                            <p>DEADLINE</p>
                                                            <p>{new Date(job?.deadline).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <hr className="text-gray-300 my-4" />

                                                    <div className="w-full flex items-center justify-between gap-2">
                                                        <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-102">View Details</button>
                                                        <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-102">Edit</button>
                                                        <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-102">Delete</button>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
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
                                </div>
                            </>
                        )
                    }
                </div>

            </div>
        </div>
    )
}