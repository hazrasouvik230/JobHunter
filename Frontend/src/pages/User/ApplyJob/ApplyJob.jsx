import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import { AuthContext } from '../../../context/AuthContext';

const ApplyJob = () => {
    const { user, setUser } = useContext(AuthContext);

    const { id } = useParams();
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleApply = async() => {
        if (user?.appliedJobs?.includes(id)) {
            alert("You have already applied for this job.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:3000/api/job/applyJob/${id}`, {}, { headers: { Authorization: token } });

            console.log(response.data);

            // updating the user in localstorage and context
            const updatedUser = { ...user, appliedJobs: [ ...user.appliedJobs, id ] };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            alert("Success");
            navigate("/user/applied-jobs")
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async() => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/api/job/getSpecificJob/${id}`, { headers: { Authorization: token } });
                console.log(response.data.job);
                setJobDetails(response.data.job);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className='px-32 py-16'>
                <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-12'>Apply Job</p>
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl">Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute">
                    <Link to="/user/all-jobs" className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">Back</Link>
                </div>

                <p className='text-4xl font-bold text-gray-900 text-shadow-lg mb-4'>Apply Job</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Track your job applications</p>
            </div>

            <div className="w-full flex justify-between gap-4">                
                <div className='flex justify-between gap-2'>
                    <div className="prose p-8 rounded-xl border-2 border-gray-300 shadow-lg w-2/3">
                        <ReactMarkdown
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-3xl font-semibold mb-3" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-2xl font-medium mb-2" {...props} />,
                                p: ({node, ...props}) => <p className="text-sm mb-2 leading-relaxed text-gray-700" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-2 text-sm" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-2 text-sm" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1 text-sm" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-semibold text-black" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-600 underline text-sm" target="_blank" rel="noopener noreferrer" {...props} />,
                            }}
                        >
                            {jobDetails.description}
                        </ReactMarkdown>
                    </div>
                    
                    <div className='flex items-center flex-col gap-4 mb-4 h-auto w-1/3 rounded-xl border-2 border-gray-300 shadow-lg'>
                        <img src={`http://localhost:3000/uploads/company-logos/${jobDetails.companyLogo}`} alt={jobDetails.companyLogo} className='w-12 rounded-full' />
                        <h1 className='text-3xl'>{jobDetails.companyName}</h1>
                    </div>
                </div>
            </div>

            <div className=" mt-4 p-4 border border-green-200 rounded-lg flex items-center justify-center flex-col bg-green-100 shadow-lg">
                <h2 className='text-2xl mb-2 font-black text-green-800'>Ready to Make an Impact?</h2>
                <p className='text-center text-green-500 mb-2 max-w-4xl'>If you are a driven {jobDetails.title} with a passion for leading groundbreaking software projects and contributing to digital transformation, we invite you to take the next step in your career with {jobDetails.companyName}.</p>
                <button className={`px-8 py-2 rounded bg-green-800 font-bold text-white cursor-pointer hover:scale-110 hover:text-lg`} disabled={user?.appliedJobs?.includes(id)} onClick={handleApply}>{ user?.appliedJobs?.includes(id) ? "Applied" : "Apply" }</button>
            </div>
        </div>
    )
}

export default ApplyJob