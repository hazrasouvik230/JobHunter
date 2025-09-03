import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppliedJobs = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);

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

            <div>
                {
                appliedJobs?.length > 0 ?
                    <>
                        {
                            appliedJobs.map((job) => {
                                return <div key={job._id} className='border'>
                                    <p>{job._id}</p>
                                    <p>{job.title}</p>
                                    <p>{job.companyName}</p>
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