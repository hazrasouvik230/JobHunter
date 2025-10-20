import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import ScheduleInterview from './ScheduleInterview';
import UserDetails from '../UserDetails';

import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

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

    const statusCount = job?.applicants?.reduce((acc, applicant) => {
        const status = applicant.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    console.log(statusCount);

    const handleReject = async (applicantId) => {
    const confirm = window.confirm("Are you sure?");
    if(confirm) {
        const formdata = { 
            jobId: job._id, 
            applicantId: applicantId 
        };
        
        console.log("Rejecting with data:", formdata);
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:3000/api/interview/specificJobRejection`, 
                formdata, 
                { headers: { Authorization: token }}
            );
            
            console.log("Response:", response.data);
            
            if (response.data.success) {
                // Update local state to reflect the change immediately
                const updatedApplicants = job.applicants.map(applicant => 
                    applicant._id === applicantId 
                        ? { ...applicant, status: "rejected" } 
                        : applicant
                );
                setJob({ ...job, applicants: updatedApplicants });
                
                alert("Candidate rejected successfully");
            }
        } catch (error) {
            console.log("Error:", error.response?.data || error.message);
            alert("Failed to reject candidate");
        }
    }
}

    const handleScheduleInterview = (selectedApplicant) => {
        setScheduleInetrviewModal(!scheduleInterviewModal);
        setSelectedApplicant(selectedApplicant);
    }

    const handleResume = path => {
        
    }

    return (
        <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/hr/all-posted-jobs">Back</Link></span></div>

                <p className='text-4xl font-bold text-gray-900 mb-4'>Specific job details</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Hire smarter. Grow faster.</p>
            </div>

            <div className='flex justify-between gap-2'>
                <div className='bg-white border-2 border-gray-400 rounded-xl shadow-xl w-2/3 px-6 py-3'>
                    <div>
                        <p className='text-xs font-extralight text-gray-500'>Job id: {job._id}</p>
                        <p className='text-2xl font-bold'>{job.title}</p>
                        <p>Total applied students: {job.applicants?.length || 0}</p>
                        <p>Interview Scheduled students: {statusCount?.selected_for_interview || 0}</p>
                        <p>Hired students: {statusCount?.hired || 0}</p>
                    </div>
                    <div className='mt-4'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-gray-300 text-center'>
                                    <th className='border p-2 w-[25%]'>Name</th>
                                    <th className='border p-2 w-[35%]'>Email</th>
                                    <th className='border p-2 w-[15%]'>Resume</th>
                                    <th className='border p-2 w-[15%]'>Actions</th>
                                    <th className='border p-2 w-[10%]'>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    job.applicants?.map((applicant) => {
                                        return (
                                            <tr key={applicant._id} className='border-b hover:bg-gray-50 text-center'>
                                                <td className='border p-2'>{applicant?.applicantId?.name}</td>
                                                <td className='border border-black p-2 cursor-pointer text-blue-500'>{applicant?.applicantId?.email}</td>
                                                <td className='p-2 flex items-center justify-center'><p className='px-4 py-1 bg-amber-400 font-semibold text-white rounded cursor-pointer' onClick={() => window.open(`http://localhost:3000/${applicant?.resumePath}`)}>Resume</p></td>
                                                <td className='border p-2'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        {
                                                            applicant.status === "applied" && (
                                                                <>
                                                                    <button className='px-4 py-1 bg-amber-200 rounded cursor-pointer hover:bg-amber-300 transition-colors' onClick={() => handleScheduleInterview(applicant)}><MdOutlineAccessTimeFilled /></button>
                                                                    <button className='px-4 py-1 bg-red-600/70 text-white rounded cursor-pointer hover:bg-red-700/70 transition-colors' onClick={() => handleReject(applicant._id)}><FaTrash /></button>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            applicant.status === "rejected" && <p className='px-4 py-1 bg-red-600 font-semibold text-white rounded'>Rejected</p>
                                                        }
                                                        {
                                                            applicant.status === "selected_for_interview" && <p className='px-4 py-1 bg-amber-400 font-semibold text-white rounded'>Interview</p>
                                                        }
                                                    </div>
                                                </td>
                                                <td className='border p-2'>0</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    {scheduleInterviewModal && <ScheduleInterview selectedApplicant={selectedApplicant} setScheduleInetrviewModal={setScheduleInetrviewModal} scheduleInterviewModal={scheduleInterviewModal} job={job} />}
                </div>

                <div className="w-1/3"><UserDetails /></div>
            </div>
        </div>
    )
}

export default HRSpecificJob