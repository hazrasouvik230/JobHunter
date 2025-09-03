import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";

const HRSpecificJob = () => {
    const { id }= useParams();
    const [job, setJob] = useState({});

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
    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-medium text-shadow-md pb-8'>Specific Job Details</p>

            <p>Job id: {job._id}</p>
            <p>Title: {job.title}</p>
            {/* <p>Job Description: {job.description}</p> */}
            {/* <ReactMarkdown>
                {job.description}
            </ReactMarkdown> */}
            {/* <p>Location: {job.location.map((loc) => <span>{loc} </span>)}</p> */}
            {/* <p>Total applied students: {job.applicants}</p> */}
            <p>Total applied students: {job.applicants?.length || 0}</p>
        </div>
    )
}

export default HRSpecificJob