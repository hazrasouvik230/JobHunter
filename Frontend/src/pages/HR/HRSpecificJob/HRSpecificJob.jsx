import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import ScheduleInterview from './ScheduleInterview';
import UserDetails from '../UserDetails';

import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import Hiring from './Hiring';
import Error from '../../Error';

const HRSpecificJob = () => {
    const { id } = useParams();
    const [job, setJob] = useState({});
    const [scheduleInterviewModal, setScheduleInterviewModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [hiring, setHiring] = useState(false);
    const [selectedForHiring, setSelectedForHiring] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unauthorize, setUnauthorize] = useState(false);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/job/getSpecificJob/${id}`, { headers: { Authorization: token } });
            // console.log(response.data.job);
            setJob(response.data.job);
            setError(null);
        } catch (error) {
            // console.log(error);
            setError("Failed to load job details");
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setUnauthorize(true);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const statusCount = job?.applicants?.reduce((acc, applicant) => {
        const status = applicant.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const handleReject = async (applicantId) => {
        const confirm = window.confirm("Are you sure you want to reject this candidate?");
        if (confirm) {
            const formdata = { jobId: job._id, applicantId: applicantId };
            
            try {
                const token = localStorage.getItem("token");
                const response = await axios.put(`http://localhost:3000/api/interview/specificJobRejection`, formdata, { headers: { Authorization: token }});
                
                if (response.data.success) {
                    await fetchJobDetails();
                    alert("Candidate rejected successfully");
                }
            } catch (error) {
                console.log("Error:", error.response?.data || error.message);
                alert("Failed to reject candidate. Please try again.");
            }
        }
    };

    const handleScheduleInterview = (applicant) => {
        setScheduleInterviewModal(true);
        setSelectedApplicant(applicant);
    };

    const handleOpenHiring = (applicant) => {
        setSelectedForHiring(applicant);
        setHiring(true);
    };

    const handleCloseModals = () => {
        setScheduleInterviewModal(false);
        setHiring(false);
        setSelectedApplicant(null);
        setSelectedForHiring(null);
    };

    if (loading) {
        return (
            <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen flex items-center justify-center'>
                <p className='text-xl text-gray-600'>Loading job details...</p>
            </div>
        );
    }

    if (unauthorize) {
        return <Error />
    }

    if (error) {
        return (
            <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-xl text-red-600 mb-4'>{error}</p>
                    <button onClick={fetchJobDetails} className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute"><Link to="/hr/all-posted-jobs" className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">Back</Link></div>

                <p className='text-4xl text-shadow-lg font-bold text-gray-900 mb-4'>Specific Job Details</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Your next hire is just a click away.</p>
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
                    <div className='mt-4 overflow-x-auto'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-gray-300 text-center'>
                                    <th className='border p-2 w-[25%]'>Name</th>
                                    <th className='border p-2 w-[30%]'>Email</th>
                                    <th className='border p-2 w-[15%]'>Resume</th>
                                    <th className='border p-2 w-[30%]'>Actions</th>
                                    <th className='border p-2 w-[10%]'>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    job.applicants?.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className='text-center p-4 text-gray-500'>No applicants yet</td>
                                        </tr>
                                    ) : (
                                        job.applicants?.map((applicant) => (
                                            <tr key={applicant._id} className='border-b hover:bg-gray-50 text-center'>
                                                <td className='border p-2'>{applicant?.applicantId?.name}</td>
                                                <td className='border p-2 text-blue-500'>{applicant?.applicantId?.email}</td>
                                                <td className='p-2'><button className='px-4 py-1 bg-amber-400 font-semibold text-white rounded cursor-pointer hover:bg-amber-500 transition-colors' onClick={() => window.open(`http://localhost:3000/${applicant?.resumePath}`, '_blank')}>View</button></td>
                                                <td className='border p-2'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        {
                                                            applicant.status === "applied" && (
                                                                <>
                                                                    <button className='px-4 py-1 bg-amber-200 rounded cursor-pointer hover:bg-amber-300 transition-colors' onClick={() => handleScheduleInterview(applicant)} title="Schedule Interview"><MdOutlineAccessTimeFilled /></button>
                                                                    <button className='px-4 py-1 bg-red-600/70 text-white rounded cursor-pointer hover:bg-red-700/70 transition-colors' onClick={() => handleReject(applicant._id)} title="Reject Candidate"><FaTrash /></button>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            applicant.status === "rejected" && <p className='px-4 py-1 bg-red-600 font-semibold text-white rounded'>Rejected</p>
                                                        }
                                                        {
                                                            applicant.status === "selected_for_interview" && <p className='px-4 py-1 bg-amber-400 font-semibold text-white rounded'>Interview Scheduled</p>
                                                        }
                                                        {
                                                            applicant.status === "interview_completed" && <button className='px-4 py-1 bg-green-400 font-semibold text-white rounded cursor-pointer hover:bg-green-500 transition-colors' onClick={() => handleOpenHiring(applicant)}>Interview Completed</button>
                                                        }
                                                        {
                                                            applicant.status === "hired" && <p className='px-4 py-1 bg-blue-600 font-semibold text-white rounded'>Hired</p>
                                                        }
                                                    </div>
                                                </td>
                                                <td className='border p-2'>{applicant.rating > 0 ? `${applicant.rating} / 10` : "-"}</td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                    {
                        scheduleInterviewModal && <ScheduleInterview selectedApplicant={selectedApplicant} setScheduleInterviewModal={setScheduleInterviewModal} scheduleInterviewModal={scheduleInterviewModal} job={job} onSuccess={fetchJobDetails} />
                    }
                </div>

                <div className="w-1/3"><UserDetails /></div>
            </div>

            {
                hiring && <Hiring setHiring={setHiring} hiring={hiring} job={job} applicant={selectedForHiring} onSuccess={fetchJobDetails} onClose={handleCloseModals} />
            }
        </div>
    );
};

export default HRSpecificJob;