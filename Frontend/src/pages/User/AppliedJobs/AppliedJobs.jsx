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














import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistance } from "date-fns";

import { FaLocationDot } from "react-icons/fa6";

const AppliedJobs = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);

    const handleRevolkApplication = async (id) => {
        const confirmation = window.confirm("Are you sure to revolke the application?");
        if(confirmation) {
            const newAppliedJobs = appliedJobs.filter(job => job._id !== id);
            setAppliedJobs(newAppliedJobs);
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
            <p className='text-3xl font-semibold text-shadow-lg pb-8'>Applied Jobs</p>

            {/* <div className='border p-1'> */}
            <div className='border border-gray-200 rounded-md shadow-2xl w-full h-[600px] overflow-y-auto p-4'>
                {
                appliedJobs?.length > 0 ?
                    <div className='flex flex-wrap gap-[1%]'>
                        {
                            appliedJobs.map((job) => {
                                // return <div key={job._id} className='border flex gap-3 m-2 p-2 relative'>
                                return <div key={job._id} className='border border-l-8 p-4 rounded-xl relative w-[49.5%] mb-4 flex gap-4'>
                                    <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-24 w-24 rounded-md' />

                                    <div>
                                        <p className='text-xs'>Job ID: {job._id}</p>
                                        <p className='text-2xl font-semibold'>{job.title}</p>
                                        <p>{job.companyName}</p>
                                        <p className='flex items-center'><FaLocationDot className='text-xs' />{job.location.join(", ")}</p>
                                        {/* <p>{new Date(job.createdAt).toLocaleDateString()}</p> */}
                                        <p>Posted: {formatDistance((job.createdAt), new Date(), { addSuffix: true })}</p>
                                        <p>Deadline: {formatDistance((job.deadline), new Date(), { addSuffix: true }).replace("in", "").replace("days", "days to go")}</p>
                                    </div>

                                    <span className='bg-amber-200/50 absolute right-2 top-2 text-amber-800 font-semibold px-4 py-1 rounded-2xl'>On hold</span>
                                    <button className='bg-red-200/50 absolute right-2 bottom-2 text-red-800 font-semibold px-4 py-1 rounded-md cursor-pointer hover:scale-105' onClick={() => handleRevolkApplication(job._id)}>Revolk Application</button>
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