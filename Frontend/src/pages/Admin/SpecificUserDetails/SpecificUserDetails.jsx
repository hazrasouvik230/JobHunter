import { useEffect, useState } from "react"
import axios from "../../../config/axios"
import { Link, useNavigate, useParams } from "react-router-dom";

export default function SpecificUserDetails() {
    const { id } = useParams();
    const [fetchedUser, setFetchedUser] = useState(null);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            const response = await axios.get(`/api/specificUserDetails/${id}`, { headers: { Authorization: token } } );
            console.log(response.data.responseUser);
            setFetchedUser(response.data.responseUser);
        })();
    }, []);

    const navigate = useNavigate();
    const handleRemove = (id) => {
        const adminConfirm = window.confirm(`Are you sure to remove ${id}`);
        if(adminConfirm) {
            alert("Removed");
            navigate("/admin/all-users");
        }
    }

    const handleDeleteUserJob = (id) => {
        const adminConfirm = window.confirm(`Are you sure to remove ${id}`);
        if(adminConfirm) {
            alert("Removed");
            // navigate("/admin/all-users");
        }
    }

    return (
        <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

                <p className='text-4xl font-bold text-gray-900 mb-4'>Specific User Details</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
            </div>

        <div className="border flex gap-4">
            <div className='bg-white border border-red-400 w-1/3 p-8 rounded-3xl shadow-xl'>
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
            </div>
            
            <div className='bg-white border border-red-400 w-2/3 rounded-3xl'>
                {/* User */}
                {
                    fetchedUser?.user?.role === "User" && (
                        <>
                            <div className="p-8 relative">
                                <p>Applied jobs:</p>
                                <p>Job type: {job?.jobType}</p>
                                <div className="flex overflow-x-scroll">
                                    {
                                        fetchedUser?.user?.appliedJobs?.map(job => {
                                            return <div key={job._id} className="border mx-2 p-2 rounded-md shadow-lg my-2 min-w-60 max-w-60 min-h-68 max-h-68 relative">
                                                <div className="absolute h-12 bg-amber-200 w-full -z-10 left-0 top-0 rounded-t-md"></div>
                                                <p className="absolute border text-xs px-2 rounded-2xl right-2 top-6">On hold</p>
                                                <p className="text-xs">Job ID: {job._id}</p>

                                                {/* <img src= alt="" /> */}
                                                <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyName} className='h-12 w-12 rounded-md shadow-md' />
                                                <p>Title: {job.title}</p>
                                                {/* <p>Total applicants: {job.applicants.length}</p> */}
                                                <p>Posted on: {new Date(job?.createdAt).toLocaleDateString()}</p>
                                                <p>Deadline on: {new Date(job?.deadline).toLocaleDateString()}</p>
                                                {/* <p>hi</p> */}

                                                <div className="w-full flex items-center justify-between gap-2 absolute bottom-2 left-0 px-2">
                                                    <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-102 hover:bg-amber-400/80 duration-300 ease-in-out hover:font-bold hover:text-white">Edit</button>
                                                    <button className="w-full border rounded-md py-2 cursor-pointer hover:scale-105 hover:bg-red-600 duration-300 ease-in-out hover:font-bold hover:text-white" onClick={() => handleDeleteUserJob(job._id)}>Delete</button>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
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
                                <div className="flex overflow-x-scroll">
                                    {
                                        fetchedUser?.jobs?.map(job => {
                                            return <div key={job._id} className="border mx-2 p-4 rounded-md shadow-lg my-2 w-full relative">
                                                <p className="absolute top-4 right-4 px-4 py-1 bg-gradient-to-l from-blue-400 to-purple-500 text-white font-semibold rounded-2xl">{job?.jobType}</p>
                                                <p className="text-xl font-bold">Title: {job.title}</p>
                                                <p className="text-xs text-gray-400">Job ID: {job._id}</p>

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
                            </div>
                        </>
                    )
                }
                <button onClick={() => handleRemove(fetchedUser._id)} className="bg-gradient-to-l from-red-400 to-rose-700 px-8 py-2 rounded-md cursor-pointer font-semibold text-white hover:scale-105">Remove</button>
            </div>

        </div>

        </div>
    )
}
