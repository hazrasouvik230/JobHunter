// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import ReactMarkdown from "react-markdown";
// import { AuthContext } from '../../../context/AuthContext';
// import Error from '../../Error';
// import toast from 'react-hot-toast';

// const ApplyJob = () => {
//     const { user, setUser } = useContext(AuthContext);
//     const { id } = useParams();

//     const [jobDetails, setJobDetails] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [applying, setApplying] = useState(false);
//     const [resumeFile, setResumeFile] = useState(null);
//     const [coverLetterFile, setCoverLetterFile] = useState(null);

//     const [error, setError] = useState('');
//     const [unauthorize, setUnauthorize] = useState(false);

//     const navigate = useNavigate();

//     // const handleResume = e => {
//     //     const file = e.target.files[0];
//     //     if(file) {
//     //         if(file.type !== "application/pdf") {
//     //             setError('Please upload a PDF file only.');
//     //             setResumeFile(null);
//     //             e.target.value = '';
//     //             return;
//     //         }

//     //         if (file.size > 5 * 1024 * 1024) {
//     //             setError('File size should be less than 5MB.');
//     //             setResumeFile(null);
//     //             e.target.value = '';
//     //             return;
//     //         }
            
//     //         setResumeFile(file);
//     //         setError('');
//     //     }
//     // };

//     const handleFileUpload = (e, setFile) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (file.type !== "application/pdf") {
//             setError("Please upload a PDF file only.");
//             setFile(null);
//             e.target.value = "";
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024) {
//             setError("File size should be less than 5MB.");
//             setFile(null);
//             e.target.value = "";
//             return;
//         }

//         setError("");
//         setFile(file);
//     };

//     const handleApply = async() => {
//         if (user?.appliedJobs?.includes(id)) {
//             alert("You have already applied for this job.");
//             return;
//         }

//         if (!resumeFile) {
//             setError('Resume is required for applying.');
//             return;
//         }

//         try {
//             setApplying(true);
//             setError("");

//             const formData = new FormData();
//             formData.append("resumePath", resumeFile);

//             const token = localStorage.getItem("token");
//             const response = await axios.post(`http://localhost:3000/api/job/applyJob/${id}`, formData, { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } });

//             toast.promise(
//                 response,
//                 {
//                     loading: 'Applying for this JOB...',
//                     success: <b>Successfully applied for this JOB.</b>,
//                     error: <b>Already applied for this JOB.</b>,
//                 }
//             );

//             console.log(response.data);

//             const updatedUser = { ...user, appliedJobs: [ ...user.appliedJobs, id ] };
//             localStorage.setItem("user", JSON.stringify(updatedUser));
//             setUser(updatedUser);

//             // alert("Success");
//             navigate("/user/applied-jobs")
//         } catch (error) {
//             console.error('Application error:', error);
            
//             if (error.response?.data?.error) {
//                 setError(error.response.data.error);
                
//                 if (error.response.data.requiredResume) {
//                     console.log("Resume is required - this should already be handled but just in case")
//                 }

//                 alert("Error");
//             } else {
//                 setError('Failed to submit application. Please try again.');
//             }
//         } finally {
//             setApplying(false);
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
//                 if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                     setUnauthorize(true);
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className='px-32 py-16'>
//                 <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-12'>Apply Job</p>
//                 <div className="flex justify-center items-center h-64">
//                     <p className="text-xl">Loading job details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (unauthorize) {
//         return <Error />
//     }

//     return (
//         <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
//             <div className='text-center mb-8 mt-16'>
//                 <div className="absolute">
//                     <Link to="/user/all-jobs" className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">Back</Link>
//                 </div>

//                 <p className='text-4xl font-bold text-gray-900 text-shadow-lg mb-4'>Apply Job</p>
//                 <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Track your job applications</p>
//             </div>

//             <div className="w-full flex justify-between gap-4">                
//                 <div className='flex justify-between gap-2'>
//                     <div className="prose p-8 rounded-xl border-2 border-gray-300 shadow-lg w-full">
//                         <ReactMarkdown
//                             components={{
//                                 h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4" {...props} />,
//                                 h2: ({node, ...props}) => <h2 className="text-3xl font-semibold mb-3" {...props} />,
//                                 h3: ({node, ...props}) => <h3 className="text-2xl font-medium mb-2" {...props} />,
//                                 p: ({node, ...props}) => <p className="text-sm mb-2 leading-relaxed text-gray-700" {...props} />,
//                                 ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-2 text-sm" {...props} />,
//                                 ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-2 text-sm" {...props} />,
//                                 li: ({node, ...props}) => <li className="mb-1 text-sm" {...props} />,
//                                 strong: ({node, ...props}) => <strong className="font-semibold text-black" {...props} />,
//                                 a: ({node, ...props}) => <a className="text-blue-600 underline text-sm" target="_blank" rel="noopener noreferrer" {...props} />,
//                             }}
//                         >
//                             {jobDetails.description}
//                         </ReactMarkdown>
//                     </div>
//                 </div>
//             </div>

//             {/* Resume Upload */}
//             <div className="my-6 shadow-lg flex items-center justify-between gap-8 border-2 border-gray-300 rounded-lg p-8">
//                 {/* <div className='w-full'>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Upload Resume (PDF only) <span className='text-red-600'>*</span></label>
//                     <input 
//                         type="file" 
//                         accept=".pdf,application/pdf"
//                         // onChange={handleResume}
//                         onChange={(e) => handleFileUpload(e, setResumeFile)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         disabled={applying}
//                     />
//                     {resumeFile && (
//                         <p className="mt-2 ml-1 text-sm text-green-600">
//                             Selected: {resumeFile.name}
//                         </p>
//                     )}
//                     <p className="mt-1 ml-1 text-xs text-gray-500">
//                         Maximum file size: 5MB
//                     </p>
//                 </div> */}
//                 <div className='w-full'>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
//                         Upload Resume (PDF only) <span className='text-red-600'>*</span>
//                     </label>

//                     <div className="relative">
//                         <input
//                         id="resume"
//                         type="file"
//                         accept=".pdf,application/pdf"
//                         onChange={(e) => handleFileUpload(e, setResumeFile)}
//                         className="hidden" // hide default input
//                         disabled={applying}
//                         />
//                         <label
//                         htmlFor="resume"
//                         className="cursor-pointer flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
//                         >
//                         {resumeFile ? resumeFile.name : "Choose File"}
//                         </label>
//                     </div>

//                     <p className="mt-1 ml-1 text-xs text-gray-500">Maximum file size: 5MB</p>
//                 </div>

//                 <div className='w-full'>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
//                         Upload Cover Letter (PDF only)
//                     </label>

//                     <div className="relative">
//                         <input
//                         id="coverLetter"
//                         type="file"
//                         accept=".pdf,application/pdf"
//                         onChange={(e) => handleFileUpload(e, setCoverLetterFile)}
//                         className="hidden" // hide default input
//                         disabled={applying}
//                         />
//                         <label
//                         htmlFor="resume"
//                         className="cursor-pointer flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
//                         >
//                         {coverLetterFile ? coverLetterFile.name : "Choose File"}
//                         </label>
//                     </div>

//                     <p className="mt-1 ml-1 text-xs text-gray-500">Maximum file size: 5MB</p>
//                     {/* <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Upload Cover Letter</label>
//                     <input 
//                         type="file" 
//                         accept=".pdf,application/pdf"
//                         // onChange={handleResume}
//                         onChange={(e) => handleFileUpload(e, setCoverLetterFile)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         disabled={applying}
//                     />
//                     {coverLetterFile && (
//                         <p className="mt-2 ml-1 text-sm text-green-600">
//                             Selected: {coverLetterFile.name}
//                         </p>
//                     )}
//                     <p className="mt-1 ml-1 text-xs text-gray-500">
//                         Maximum file size: 5MB
//                     </p> */}
//                 </div>
//             </div>

//             <div className=" mt-4 p-4 border border-green-200 rounded-lg flex items-center justify-center flex-col bg-green-100 shadow-lg">
//                 <h2 className='text-2xl mb-2 font-black text-green-800'>Ready to Make an Impact?</h2>
//                 <p className='text-center text-green-500 mb-2 max-w-4xl'>If you are a driven {jobDetails.title} with a passion for leading groundbreaking software projects and contributing to digital transformation, we invite you to take the next step in your career with {jobDetails.companyName}.</p>
//                 <button className={`px-8 py-2 rounded bg-green-800 font-bold text-white cursor-pointer hover:scale-110 hover:text-lg`} disabled={user?.appliedJobs?.includes(id)} onClick={handleApply}>{ user?.appliedJobs?.includes(id) ? "Applied" : "Apply" }</button>
//             </div>
//         </div>
//     )
// }

// export default ApplyJob










import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import { AuthContext } from '../../../context/AuthContext';
import Error from '../../Error';
import toast from 'react-hot-toast';

const ApplyJob = () => {
    const { user, setUser } = useContext(AuthContext);
    const { id } = useParams();

    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [coverLetterFile, setCoverLetterFile] = useState(null);

    const [error, setError] = useState('');
    const [unauthorize, setUnauthorize] = useState(false);

    const navigate = useNavigate();

    const handleFileUpload = (e, setFile) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file only.");
            setFile(null);
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size should be less than 5MB.");
            setFile(null);
            e.target.value = "";
            return;
        }

        setError("");
        setFile(file);
    };

    const handleApply = async() => {
        if (user?.appliedJobs?.includes(id)) {
            toast.error("You have already applied for this job.");
            return;
        }

        if (!resumeFile) {
            toast.error('Resume is required to apply for this job.');
            return;
        }

        try {
            setApplying(true);
            setError("");

            const formData = new FormData();
            formData.append("resumePath", resumeFile);

            const token = localStorage.getItem("token");
            
            toast.promise(
                axios.post(`http://localhost:3000/api/job/applyJob/${id}`, formData, { 
                    headers: { 
                        Authorization: token, 
                        'Content-Type': 'multipart/form-data' 
                    } 
                }),
                {
                    loading: 'Applying for this job...',
                    success: (response) => {
                        const updatedUser = { ...user, appliedJobs: [ ...user.appliedJobs, id ] };
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                        setUser(updatedUser);
                        
                        setTimeout(() => {
                            navigate("/user/applied-jobs");
                        }, 1000);
                        
                        return 'Successfully applied for this job!';
                    },
                    error: (err) => {
                        if (err.response?.data?.error) {
                            return err.response.data.error;
                        }
                        return 'Failed to submit application. Please try again.';
                    },
                }
            );

        } catch (error) {
            console.error('Application error:', error);
        } finally {
            setApplying(false);
        }
    };

    const handleApplyButtonClick = () => {
        if (!resumeFile) {
            toast.error('Please upload your resume to apply for this job.', {
                duration: 3000,
                icon: '📄',
            });
            return;
        }
        handleApply();
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
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setUnauthorize(true);
                }
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

    if (unauthorize) {
        return <Error />
    }

    const isAlreadyApplied = user?.appliedJobs?.includes(id);
    const canApply = resumeFile && !isAlreadyApplied && !applying;

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
                    <div className="prose p-8 rounded-xl border-2 border-gray-300 shadow-lg w-full">
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
                </div>
            </div>

            {/* Resume Upload */}
            <div className="my-6 shadow-lg flex items-center justify-between gap-8 border-2 border-gray-300 rounded-lg p-8">
                <div className='w-full'>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                        Upload Resume (PDF only) <span className='text-red-600'>*</span>
                    </label>

                    <div className="relative">
                        <input
                            id="resume"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => handleFileUpload(e, setResumeFile)}
                            className="hidden"
                            disabled={applying}
                        />
                        <label
                            htmlFor="resume"
                            className="cursor-pointer flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                        >
                            {resumeFile ? resumeFile.name : "Choose File"}
                        </label>
                    </div>

                    <p className="mt-1 ml-1 text-xs text-gray-500">Maximum file size: 5MB</p>
                </div>

                <div className='w-full'>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                        Upload Cover Letter (PDF only)
                    </label>

                    <div className="relative">
                        <input
                            id="coverLetter"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => handleFileUpload(e, setCoverLetterFile)}
                            className="hidden"
                            disabled={applying}
                        />
                        <label
                            htmlFor="coverLetter"
                            className="cursor-pointer flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                        >
                            {coverLetterFile ? coverLetterFile.name : "Choose File"}
                        </label>
                    </div>

                    <p className="mt-1 ml-1 text-xs text-gray-500">Maximum file size: 5MB</p>
                </div>
            </div>

            <div className="mt-4 p-4 border border-green-200 rounded-lg flex items-center justify-center flex-col bg-green-100 shadow-lg">
                <h2 className='text-2xl mb-2 font-black text-green-800'>Ready to Make an Impact?</h2>
                <p className='text-center text-green-500 mb-2 max-w-4xl'>
                    If you are a driven {jobDetails.title} with a passion for leading groundbreaking software projects and contributing to digital transformation, we invite you to take the next step in your career with {jobDetails.companyName}.
                </p>
                <button 
                    className={`px-8 py-2 rounded font-bold text-white transition-all ${
                        canApply 
                            ? 'bg-green-800 cursor-pointer hover:scale-110 hover:text-lg' 
                            : 'bg-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    disabled={!canApply}
                    onClick={handleApplyButtonClick}
                >
                    {isAlreadyApplied ? "Applied" : applying ? "Applying..." : "Apply"}
                </button>
                {!resumeFile && !isAlreadyApplied && (
                    <p className="text-sm text-red-600 mt-2">
                        ⚠️ Please upload your resume to enable the Apply button
                    </p>
                )}
            </div>
        </div>
    )
}

export default ApplyJob