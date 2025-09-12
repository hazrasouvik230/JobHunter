import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AllPostedJobs = () => {
    const [allPostedJobs, setAllPostedJobs] = useState([]);

    useEffect(() => {
      (async() => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:3000/api/job/allPostedJobsByHR`, { headers: { Authorization: token } });
          console.log(response.data.jobs);
          setAllPostedJobs(response.data.jobs);
        } catch (error) {
          console.log(error);
        }
      })();
    }, []);

    const liveJobs = allPostedJobs.filter((job) => new Date(job.deadline) > Date.now());
    const navigate = useNavigate();

    return (
      <div className='px-32 py-16'>
        <p className='text-3xl font-medium text-shadow-md pb-8'>All Posted Jobs</p>

        <div>
          {
            allPostedJobs.length > 0 ?
              <div className='flex justify-between gap-2'>
                <div className='bg-white border border-red-400 w-4/5'>
                  {
                    allPostedJobs.map((allJobs) => {
                      return <div key={allJobs._id} className='border border-l-8 my-4 px-8 py-4 rounded hover:shadow-lg hover:scale-101' onClick={() => navigate(`/hr/specific-job/${allJobs._id}`)}>
                        <p><b>JOB ID: </b>{allJobs._id}</p>
                        <h1>{allJobs.title}</h1>
                        {/* <p>{allJobs.companyName}</p> */}
                        <p>Applicants: {allJobs.applicants?.length || 0}</p>
                        <p>Selected Candidate: 0</p>
                        {/* <p>{allJobs.companyName}</p> */}
                        {/* <button>Show details</button> */}
                      </div>
                    })
                  }
                </div>

                <div className='w-1/5 border border-amber-500 flex flex-col items-center pt-4 gap-2'>
                  <img src={`http://localhost:3000/uploads/company-logos/${JSON.parse(localStorage.getItem("user")).companyLogo}`} alt={JSON.parse(localStorage.getItem("user")).companyLogo} className='h-32 w-32 rounded-full border' />
                  <p className='text-2xl font-semibold'>{JSON.parse(localStorage.getItem("user")).companyName}</p>
                  <p>Total jobs posted: {allPostedJobs.length}</p>
                  <p>Live posted jobs: {liveJobs.length}</p>
                </div>
              </div> :
              <p>You've not post any job yet.</p>
          }
        </div>
      </div>
    )
}

export default AllPostedJobs