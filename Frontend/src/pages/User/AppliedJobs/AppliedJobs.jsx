import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

            <div className='border p-1'>
                {
                appliedJobs?.length > 0 ?
                    <>
                        {
                            appliedJobs.map((job) => {
                                return <div key={job._id} className='border flex gap-3 m-2 p-2 relative'>
                                    <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-24 w-24 rounded-md' />

                                    <div>
                                        <p>Job ID: {job._id}</p>
                                        <p>{job.title}</p>
                                        <p>{job.companyName} &middot; {job.location.join(", ")}</p>
                                        <p>{new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <span className='bg-amber-200/50 absolute right-2 text-amber-800 font-semibold px-4 py-1 rounded-2xl'>On hold</span>
                                    <button className='bg-red-200/50 absolute right-2 bottom-2 text-red-800 font-semibold px-4 py-1 rounded-2xl cursor-pointer hover:scale-105' onClick={() => handleRevolkApplication(job._id)}>Revolk Application</button>
                                </div>
                            })
                        }
                    </> :
                    <p>Not applied for any job.</p>
                }
            </div>
        </div>
    )
}

export default AppliedJobs