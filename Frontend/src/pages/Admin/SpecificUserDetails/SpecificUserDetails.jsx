import { useEffect, useState } from "react"
import axios from "../../../config/axios"
import { useNavigate, useParams } from "react-router-dom";

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

    return <div className='px-2 sm:px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-12'>Specific User Details</p>

      <div className="border">
        <p>Userid: {fetchedUser?.user?._id}</p>
        <p>User name: {fetchedUser?.user?.name}</p>
        <p>Email address: {fetchedUser?.user?.email}</p>
        <p>Role of the user: {fetchedUser?.user?.role}</p>
        {
            fetchedUser?.user?.role === "HR" && <p>Company name: {fetchedUser?.user?.companyName}</p>
        }

        {/* User */}
        {
            fetchedUser?.user?.role === "User" && (
                <>
                    {/* <p>Total jobs posted: {fetchedUser?.jobs?.length}</p>
                    <p>Total live jobs: {fetchedUser?.jobs?.filter(job => new Date(job.deadline) >= Date.now()).length || 0}</p> */}

                    <div>
                        <p>Applied jobs:</p>
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
                                        <p>Job type: {job?.jobType}</p>
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
                    <p>Total jobs posted: {fetchedUser?.jobs?.length}</p>
                    <p>Total live jobs: {fetchedUser?.jobs?.filter(job => new Date(job.deadline) >= Date.now()).length || 0}</p>

                    <div>
                        <p>Posted jobs:</p>
                        <div className="flex overflow-x-scroll">
                            {
                                fetchedUser?.jobs?.map(job => {
                                    return <div key={job._id} className="border mx-2 p-2 rounded-md shadow-lg my-2 min-w-60 max-w-60 max-h-60 min-h-60 relative">
                                        <p className="text-xs">Job ID: {job._id}</p>
                                        <p>Title: {job.title}</p>
                                        <p>Total applicants: {job.applicants.length}</p>
                                        <p>Job type: {job?.jobType}</p>
                                        <p>Posted on: {new Date(job?.createdAt).toLocaleDateString()}</p>
                                        <p>Deadline on: {new Date(job?.deadline).toLocaleDateString()}</p>

                                        <div className="w-full flex items-center justify-between gap-2 absolute bottom-2 left-0 px-2">
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
}
