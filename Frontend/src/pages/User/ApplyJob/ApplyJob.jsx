import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";

const ApplyJob = () => {
    const { id } = useParams();
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);

    const handleApply = async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:3000/api/job/applyJob/${id}`, {}, { headers: { Authorization: token } });
            console.log(response.data);
            alert("Success");
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
                <p className='text-3xl font-semibold text-shadow-lg pb-8'>Apply Job</p>
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl">Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-semibold text-shadow-lg pb-8'>Apply Job</p>

            <div className="w-full border flex justify-between gap-4">
                {/* <div className="w-3/5 border">
                    <div>
                        <label htmlFor="resume">Resume </label>
                        <input type="file" name="cover" id="cover" className='border' />
                    </div>

                    <div>
                        <label htmlFor="coverletter">Cover Letter </label>
                        <input type="file" name="resume" id="resume" className='border' />
                    </div>

                    <button className='bg-blue-300 px-6 py-2 rounded-2xl' onClick={handleApply}>Apply</button>
                </div> */}
                
                {/* <div className="w-2/5 border flex items-center flex-col"> */}
                {/* <div className="w-full border flex items-center flex-col"> */}
                <div>
                    <div className='flex items-center gap-4 mb-4'>
                        <img src={`http://localhost:3000/uploads/company-logos/${jobDetails.companyLogo}`} alt={jobDetails.companyLogo} className='w-12 rounded-full' />
                        <h1 className='text-3xl'>{jobDetails.companyName}</h1>
                    </div>
                    
                    {/* <p>{jobDetails.description.slice(0, 200)}...</p> */}
                    <ReactMarkdown>
                        {jobDetails.description}
                    </ReactMarkdown>
                    <p className='flex gap-2 items-center'><FaBriefcase /> {jobDetails.experienceLevel}</p>
                    <p className='flex gap-2 items-center'><FaLocationDot /> {jobDetails.location.map((loc) => <span>{loc}, </span>)}</p>
                </div>
            </div>

            <button className='px-8 py-2 rounded bg-amber-200' onClick={handleApply}>Apply</button>
        </div>
    )
}

export default ApplyJob