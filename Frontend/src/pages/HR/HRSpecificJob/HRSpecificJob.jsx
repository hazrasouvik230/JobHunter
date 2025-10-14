// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
// import ReactMarkdown from "react-markdown";

// const HRSpecificJob = () => {
//     const { id }= useParams();
//     const [job, setJob] = useState({});

//     useEffect(() => {
//         (async() => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await axios.get(`http://localhost:3000/api/job/getSpecificJob/${id}`, { headers: { Authorization: token } });
//                 console.log(response.data.job);
//                 setJob(response.data.job);
//             } catch (error) {
//                 console.log(error);
//             }  
//         })();
//     }, [id]);

//     const handleReject = (id) => {
//         const confirm = window.confirm("Are you sure?");
//         if(confirm) {
//             const filteredApplicants = job.applicants.filter(applicant => applicant._id !== id);
//             setJob({ ...job, applicants: filteredApplicants });
//         }
//     }

//     return (
//         <div className='px-32 py-16'>
//             <p className='text-3xl font-medium text-shadow-md pb-8'>Specific Job Details</p>

//             <div>
//                 <p>Job id: {job._id}</p>
//                 <p>Title: {job.title}</p>
//                 <p>Total applied students: {job.applicants?.length || 0}</p>
//             </div>

//             <div className='border p-4'>
//                 {
//                     job.applicants?.map((applicant) => {
//                         return <div key={applicant._id} className='border my-4 p-2 flex items-center justify-between rounded shadow-md'>
//                             <p>{applicant._id}</p>
//                             <p>{applicant.name}</p>
//                             <p>{applicant.email}</p>
//                             <p>50</p>

//                             <div className='flex items-center justify-center gap-2'>
//                                 <button className='px-4 py-1 bg-amber-200 rounded cursor-pointer'>Schedule Interview</button>
//                                 <button className='px-4 py-1 bg-red-600/70 text-white rounded cursor-pointer' onClick={() => handleReject(applicant._id)}>Reject</button>
//                             </div>
//                         </div>
//                     })
//                 }
//             </div>
//         </div>
//     )
// }

// export default HRSpecificJob


















import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import ScheduleInterview from './ScheduleInterview';

const HRSpecificJob = () => {
    const { id }= useParams();
    const [job, setJob] = useState({});
    const [scheduleInterviewModal, setScheduleInetrviewModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    useEffect(() => {
        (async() => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/api/job/getSpecificJob/${id}`, { headers: { Authorization: token } });
                console.log(response.data.job);
                setJob(response.data.job);
            } catch (error) {
                console.log(error);
            }  
        })();
    }, [id]);

    const handleReject = (id) => {
        const confirm = window.confirm("Are you sure?");
        if(confirm) {
            const filteredApplicants = job.applicants.filter(applicant => applicant._id !== id);
            setJob({ ...job, applicants: filteredApplicants });
        }
    }

    const handleScheduleInterview = (selectedApplicant) => {
        // alert(JSON.stringify(applicant)); //[object Object]
        setScheduleInetrviewModal(!scheduleInterviewModal);
        setSelectedApplicant(selectedApplicant);
    }

    return (
        <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/hr/all-posted-jobs">Back</Link></span></div>

                <p className='text-4xl font-bold text-gray-900 mb-4'>Specific job details</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Hire smarter. Grow faster.</p>
            </div>

            <div>
                <p>Job id: {job._id}</p>
                <p>Title: {job.title}</p>
                <p>Total applied students: {job.applicants?.length || 0}</p>
            </div>

            <div className='border p-4'>
                {
                    job.applicants?.map((applicant) => {
                        return <div key={applicant._id} className='border my-4 p-2 flex items-center justify-between rounded shadow-md'>
                            <p>{applicant._id}</p>
                            <p>{applicant.name}</p>
                            <p>{applicant.email}</p>
                            <p>50</p>

                            <div className='flex items-center justify-center gap-2'>
                                <button className='px-4 py-1 bg-amber-200 rounded cursor-pointer' onClick={() => handleScheduleInterview(applicant)}>Schedule Interview</button>
                                <button className='px-4 py-1 bg-red-600/70 text-white rounded cursor-pointer' onClick={() => handleReject(applicant._id)}>Reject</button>
                            </div>
                        </div>
                    })
                }
            </div>

            {scheduleInterviewModal && <ScheduleInterview selectedApplicant={selectedApplicant} setScheduleInetrviewModal={setScheduleInetrviewModal} scheduleInterviewModal={scheduleInterviewModal} job={job} />}
        </div>
    )
}

export default HRSpecificJob