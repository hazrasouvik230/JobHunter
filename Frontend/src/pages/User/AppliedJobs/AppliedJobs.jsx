// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// import { FaLocationDot } from "react-icons/fa6";

// const AppliedJobs = () => {
//     const [appliedJobs, setAppliedJobs] = useState([]);

//     const handleRevolkApplication = async (id) => {
//         const confirmation = window.confirm("Are you sure to revolke the application?");
//         if(confirmation) {
//             const newAppliedJobs = appliedJobs.filter(job => job._id !== id);
//             setAppliedJobs(newAppliedJobs);
//         }
//     };

//     useEffect(() => {
//         (async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await axios.get(`http://localhost:3000/api/allAppliedJobs`, { headers: { Authorization: token } });
//                 console.log(response.data.appliedJobs);
//                 setAppliedJobs(response.data.appliedJobs);
//             } catch (error) {
//                 console.log(error);
//             }
//         })();
//     }, []);

//     return (
//         <div className='px-32 py-16'>
//             <p className='text-3xl font-semibold text-shadow-lg pb-8'>Applied Jobs</p>

//             {/* <div className='border p-1'> */}
//             <div className='border border-gray-200 rounded-md shadow-2xl w-full h-[600px] overflow-y-auto p-4'>
//                 {
//                 appliedJobs?.length > 0 ?
//                     <div className='flex flex-wrap gap-[1%]'>
//                         {
//                             appliedJobs.map((job) => {
//                                 // return <div key={job._id} className='border flex gap-3 m-2 p-2 relative'>
//                                 return <div key={job._id} className='border border-l-8 p-4 rounded-xl relative w-[49.5%] mb-4 flex gap-4'>
//                                     <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-24 w-24 rounded-md' />

//                                     <div>
//                                         <p className='text-xs'>Job ID: {job._id}</p>
//                                         <p className='text-2xl font-semibold'>{job.title}</p>
//                                         <p>{job.companyName}</p>
//                                         <p className='flex items-center'><FaLocationDot className='text-xs' />{job.location.join(", ")}</p>
//                                         <p>{new Date(job.createdAt).toLocaleDateString()}</p>
//                                     </div>

//                                     <span className='bg-amber-200/50 absolute right-2 top-2 text-amber-800 font-semibold px-4 py-1 rounded-2xl'>On hold</span>
//                                     <button className='bg-red-200/50 absolute right-2 bottom-2 text-red-800 font-semibold px-4 py-1 rounded-md cursor-pointer hover:scale-105' onClick={() => handleRevolkApplication(job._id)}>Revolk Application</button>
//                                 </div>
//                             })
//                         }
//                     </div> :
//                     <p>Not applied for any job.</p>
//                 }
//             </div>
//         </div>
//     )
// }

// export default AppliedJobs































import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { AuthContext } from '../../../context/AuthContext';
import CurrencyFormatter from '../../../CurrencyFormatter';
import { formatDistanceToNow  } from "date-fns";
import { FaRegClock } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";

const AppliedJobs = () => {
    const { user, setUser } = useContext(AuthContext);
    const [appliedJobs, setAppliedJobs] = useState([]);

    const handleRevokeApplication = async (id) => {
        const confirmation = window.confirm("Are you sure to revolke the application?");
        if(confirmation) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.delete(`http://localhost:3000/api/job/revokeApplication/${id}`, { headers: { Authorization: token } });
                console.log(response.data);

                const newAppliedJobs = appliedJobs.filter(job => job._id !== id);
                setAppliedJobs(newAppliedJobs);

                const updatedUser  = {
                    ...user, appliedJobs: user.appliedJobs.filter(jobId => jobId !== id)
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);

                alert("Revoke complete");
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/api/allAppliedJobs`, { headers: { Authorization: token } });
                console.log(response.data.appliedJobs);
                setAppliedJobs(response.data.appliedJobs);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-12'>Applied Jobs</p>

            {/* <div className='border p-1'> */}
            <div className='border border-gray-200 rounded-md shadow-2xl w-full h-[600px] overflow-y-auto p-4'>
                {
                appliedJobs?.length > 0 ?
                    <div className='flex flex-wrap gap-[1%]'>
                        {
                            appliedJobs.map((job) => {
                                return <div key={job._id} className='border border-gray-300 p-4 rounded-xl relative w-[49.5%] mb-4 hover:scale-102 hover:shadow-lg hover:border-gray-600/50 duration-300 ease-in-out'>
                                    <div className='absolute h-22 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 top-0 left-0 w-full rounded-t-xl -z-5'></div>
                                    <div className='flex gap-4'>
                                        <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-22 w-22 rounded-lg shadow-lg' />
                                        <div>
                                        <p className='font-extralight text-xs'>JOB ID: {job._id}</p>
                                        <p className='font-bold text-xl'>{job.title}</p>
                                        <p className='font-semibold text-lg text-white'>{job.companyName}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 my-4 mb-8">
                                        <div className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaBriefcase /> {job.jobType}</div>
                                        <div className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaLocationDot /> {job.location.join(", ")}</div>
                                        <div className='bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><GiGraduateCap />{job.experienceLevel}</div>
                                        <div className='bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><CurrencyFormatter amount={Number(job.salary)} currencyCode="INR" /></div>
                                        <div className='bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaRegClock />Posted on: {formatDistanceToNow(new Date(job.createdAt))} ago</div>
                                        <div className='bg-gradient-to-r from-red-100 to-rose-100 text-slate-700 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><BsCalendarDate />{new Date(job.deadline) > Date.now() ? `Deadline in ${formatDistanceToNow(new Date(job.deadline))}` : `Deadline was ${formatDistanceToNow(new Date(job.deadline))} ago`}</div>
                                    </div>

                                    <span className='bg-amber-100/50 absolute right-2 top-2 text-xs text-amber-800 font-semibold px-4 py-1 rounded-2xl'>On hold</span>
                                    <button className='bg-red-200/50 absolute right-2 bottom-2 text-red-800 font-semibold px-4 py-1 rounded-md cursor-pointer hover:scale-105' onClick={() => handleRevokeApplication(job._id)}>Revolk Application</button>
                                </div>
                            })
                        }
                    </div> :
                    <p>Not applied for any job.</p>
                }
            </div>
        </div>
    )
}

export default AppliedJobs