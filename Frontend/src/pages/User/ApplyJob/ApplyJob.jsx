// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaBriefcase } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import { useParams } from 'react-router-dom';
// import ReactMarkdown from "react-markdown";

// const ApplyJob = () => {
//     const { id } = useParams();
//     const [jobDetails, setJobDetails] = useState({});
//     const [loading, setLoading] = useState(true);

//     const handleApply = async() => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.post(`http://localhost:3000/api/job/applyJob/${id}`, {}, { headers: { Authorization: token } });

//             console.log(response.data);
//             alert("Success");
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         (async() => {
//             try {
//                 setLoading(true);
//                 const token = localStorage.getItem("token");
//                 const response = await axios.get(`http://localhost:3000/api/job/getSpecificJob/${id}`, { headers: { Authorization: token } });
//                 console.log(response.data.job);
//                 setJobDetails(response.data.job);
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className='px-32 py-16'>
//                 <p className='text-3xl font-semibold text-shadow-lg pb-8'>Apply Job</p>
//                 <div className="flex justify-center items-center h-64">
//                     <p className="text-xl">Loading job details...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className='px-32 py-16'>
//             <p className='text-3xl font-semibold text-shadow-lg pb-8'>Apply Job</p>

//             <div className="w-full border flex justify-between gap-4">
//                 {/* <div className="w-3/5 border">
//                     <div>
//                         <label htmlFor="resume">Resume </label>
//                         <input type="file" name="cover" id="cover" className='border' />
//                     </div>

//                     <div>
//                         <label htmlFor="coverletter">Cover Letter </label>
//                         <input type="file" name="resume" id="resume" className='border' />
//                     </div>

//                     <button className='bg-blue-300 px-6 py-2 rounded-2xl' onClick={handleApply}>Apply</button>
//                 </div> */}
                
//                 {/* <div className="w-2/5 border flex items-center flex-col"> */}
//                 {/* <div className="w-full border flex items-center flex-col"> */}
//                 <div>
//                     <div className='flex items-center gap-4 mb-4'>
//                         <img src={`http://localhost:3000/uploads/company-logos/${jobDetails.companyLogo}`} alt={jobDetails.companyLogo} className='w-12 rounded-full' />
//                         <h1 className='text-3xl'>{jobDetails.companyName}</h1>
//                     </div>
                    
//                     {/* <p>{jobDetails.description.slice(0, 200)}...</p> */}
//                     <ReactMarkdown>
//                         {jobDetails.description}
//                     </ReactMarkdown>
//                     <p className='flex gap-2 items-center'><FaBriefcase /> {jobDetails.experienceLevel}</p>
//                     <p className='flex gap-2 items-center'><FaLocationDot /> {jobDetails.location.map((loc) => <span>{loc}, </span>)}</p>
//                 </div>
//             </div>

//             <button className='px-8 py-2 rounded bg-amber-200' onClick={handleApply}>Apply</button>
//         </div>
//     )
// }

// export default ApplyJob
















import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import { AuthContext } from '../../../context/AuthContext';

const ApplyJob = () => {
    const { user, setUser } = useContext(AuthContext);
    // console.log("chekcing", user);

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
        <div className='px-32 py-16'>
            <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-24'>Apply Job</p>

            <div className="w-full border flex justify-between gap-4 p-4 rounded-md">
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
                
                <div>
                    <div className='flex items-center gap-4 mb-4'>
                        <img src={`http://localhost:3000/uploads/company-logos/${jobDetails.companyLogo}`} alt={jobDetails.companyLogo} className='w-12 rounded-full' />
                        <h1 className='text-3xl'>{jobDetails.companyName}</h1>
                    </div>

                    <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-3xl font-semibold mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-2xl font-medium mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="text-base mb-2 leading-relaxed text-gray-700" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-black" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                    >
                        {jobDetails.description}
                    </ReactMarkdown>
                    
                </div>
            </div>

            <div className=" mt-4 p-4 border border-green-200 rounded-lg flex items-center justify-center flex-col bg-green-100">
                <h2 className='text-2xl mb-2 font-black text-green-800'>Ready to Make an Impact?</h2>
                <p className='text-center text-green-500 mb-2 max-w-4xl'>If you are a driven {jobDetails.title} with a passion for leading groundbreaking software projects and contributing to digital transformation, we invite you to take the next step in your career with {jobDetails.companyName}.</p>
                <button className={`px-8 py-2 rounded bg-green-800 font-bold text-white cursor-pointer hover:scale-110 hover:text-lg`} disabled={user?.appliedJobs?.includes(id)} onClick={handleApply}>{ user?.appliedJobs?.includes(id) ? "Applied" : "Apply" }</button>
            </div>
        </div>
    )
}

export default ApplyJob











































// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react';
// import { FaBriefcase } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import { useParams } from 'react-router-dom';
// import ReactMarkdown from "react-markdown";
// import { AuthContext } from '../../../context/AuthContext';
// import { useJobs } from '../../../context/JobsContext';

// const ApplyJob = () => {
//     const { user, setUser } = useContext(AuthContext);
//     const { applyForJob } = useJobs();
//     // console.log("chekcing", user);

//     const { id } = useParams();
//     const [jobDetails, setJobDetails] = useState({});
//     const [loading, setLoading] = useState(true);

//     const handleApply = async() => {
//         if (user?.appliedJobs?.includes(id)) {
//             alert("You have already applied for this job.");
//             return;
//         }

//         try {
//             // const token = localStorage.getItem("token");
//             // const response = await axios.post(`http://localhost:3000/api/job/applyJob/${id}`, {}, { headers: { Authorization: token } });

//             // console.log(response.data);

//             // // updating the user in localstorage and context
//             // const updatedUser = { ...user, appliedJobs: [ ...user.appliedJobs, id ] };
//             // localStorage.setItem("user", JSON.stringify(updatedUser));
//             // setUser(updatedUser);

//             await applyForJob(id);
//             alert("Success");
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         (async() => {
//             try {
//                 setLoading(true);
//                 const token = localStorage.getItem("token");
//                 const response = await axios.get(`http://localhost:3000/api/job/getSpecificJob/${id}`, { headers: { Authorization: token } });
//                 console.log(response.data.job);
//                 setJobDetails(response.data.job);
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className='px-32 py-16'>
//                 <p className='text-3xl font-semibold text-shadow-lg pb-8'>Apply Job</p>
//                 <div className="flex justify-center items-center h-64">
//                     <p className="text-xl">Loading job details...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className='px-32 py-16'>
//             <p className='text-3xl font-semibold text-shadow-lg pb-8'>Apply Job</p>

//             <div className="w-full border flex justify-between gap-4 p-4 rounded-md">
//                 {/* <div className="w-3/5 border">
//                     <div>
//                         <label htmlFor="resume">Resume </label>
//                         <input type="file" name="cover" id="cover" className='border' />
//                     </div>

//                     <div>
//                         <label htmlFor="coverletter">Cover Letter </label>
//                         <input type="file" name="resume" id="resume" className='border' />
//                     </div>

//                     <button className='bg-blue-300 px-6 py-2 rounded-2xl' onClick={handleApply}>Apply</button>
//                 </div> */}
                
//                 <div>
//                     <div className='flex items-center gap-4 mb-4'>
//                         <img src={`http://localhost:3000/uploads/company-logos/${jobDetails.companyLogo}`} alt={jobDetails.companyLogo} className='w-12 rounded-full' />
//                         <h1 className='text-3xl'>{jobDetails.companyName}</h1>
//                     </div>

//                     <ReactMarkdown
//                         components={{
//                             h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4" {...props} />,
//                             h2: ({node, ...props}) => <h2 className="text-3xl font-semibold mb-3" {...props} />,
//                             h3: ({node, ...props}) => <h3 className="text-2xl font-medium mb-2" {...props} />,
//                             p: ({node, ...props}) => <p className="text-base mb-2 leading-relaxed text-gray-700" {...props} />,
//                             ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-2" {...props} />,
//                             ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-2" {...props} />,
//                             li: ({node, ...props}) => <li className="mb-1" {...props} />,
//                             strong: ({node, ...props}) => <strong className="font-semibold text-black" {...props} />,
//                             a: ({node, ...props}) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
//                         }}
//                     >
//                         {jobDetails.description}
//                     </ReactMarkdown>
                    
//                     {/* <p className='flex gap-2 items-center'><FaBriefcase /> {jobDetails.experienceLevel}</p>
//                     <p className='flex gap-2 items-center'><FaLocationDot /> {jobDetails.location.join(", ")}</p> */}
//                 </div>
//             </div>

//             <div className=" mt-4 p-4 border border-green-200 rounded-lg flex items-center justify-center flex-col bg-green-100">
//                 <h2 className='text-2xl mb-2 font-black text-green-800'>Ready to Make an Impact?</h2>
//                 <p className='text-center text-green-500 mb-2 max-w-4xl'>If you are a driven {jobDetails.title} with a passion for leading groundbreaking software projects and contributing to digital transformation, we invite you to take the next step in your career with {jobDetails.companyName}.</p>
//                 <button className='px-8 py-2 rounded bg-green-800 font-bold text-white cursor-pointer hover:scale-110 hover:text-lg' onClick={handleApply}>Apply</button>
//             </div>
//         </div>
//     )
// }

// export default ApplyJob