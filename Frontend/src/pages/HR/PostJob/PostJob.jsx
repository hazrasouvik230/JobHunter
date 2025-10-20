import React, { useContext, useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import { BsStars } from "react-icons/bs";
import axios from 'axios';
import Loader from '../../../Loading';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserDetails from "../UserDetails";

const PostJob = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { jobData, isEdit } = location.state || {};

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [jobType, setJobType] = useState([
        { value: 'Full-Time', label: 'Full-Time' },
        { value: 'Part-Time', label: 'Part-Time' },
        { value: 'Internship', label: 'Internship' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Remote', label: 'Remote' }
    ]);
    const [selectJobType, setSelectJobType] = useState(null);

    const [locations, setLocations] = useState([
        { value: "Bangalore", label: "Bangalore" },
        { value: "Chennai", label: "Chennai" },
        { value: "Delhi", label: "Delhi" },
        { value: "Hyderabad", label: "Hyderabad" },
        { value: "Mumbai", label: "Mumbai" },
        { value: "Kolkata", label: "Kolkata" }
    ]);
    const [selectLocation, setSelectLocation] = useState([]);

    const [requirement, setRequirement] = useState([
        { value: "MongoDB", label: "MongoDB" },
        { value: "ExpressJS", label: "ExpressJS" },
        { value: "ReactJS", label: "ReactJS" },
        { value: "NodeJS", label: "NodeJS" },
    ]);
    const [selectRequirement, setSelectRequirement] = useState([]);

    const [experience, setExperience] = useState("");
    const [salary, setSalary] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isEdit && jobData) {
            setTitle(jobData.title || "");
            
            // Set job type
            const jobTypeOption = { value: jobData.jobType, label: jobData.jobType };
            setSelectJobType(jobTypeOption);
            
            // Set locations
            const locationOptions = jobData.location.map(loc => ({ value: loc, label: loc }));
            setSelectLocation(locationOptions);
            
            // Set requirements
            const requirementOptions = jobData.requirements.map(req => ({ value: req, label: req }));
            setSelectRequirement(requirementOptions);
            
            setExperience(jobData.experienceLevel || "");
            setSalary(jobData.salary || "");
            
            // Format deadline for date input (YYYY-MM-DD)
            if (jobData.deadline) {
                const deadlineDate = new Date(jobData.deadline);
                const formattedDeadline = deadlineDate.toISOString().split('T')[0];
                setDeadline(formattedDeadline);
            }
            
            setDescription(jobData.description || "");
        }
    }, [isEdit, jobData]);
    
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
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        const formJobData = { title, location: selectLocation.map(ele => ele.value), jobType: selectJobType.value, requirements: selectRequirement.map(ele => ele.value), experienceLevel: experience, salary, deadline, description };

        try {
            const token = localStorage.getItem("token");
            
            let response;
            if (isEdit && jobData) {
                response = await axios.put(`http://localhost:3000/api/job/${jobData._id}`, formJobData, { headers: { Authorization: token } });
                alert("Job updated successfully!");
            } else {
                response = await axios.post("http://localhost:3000/api/job", formJobData, { headers: { Authorization: `${token}` } });
                console.log(response.data);
                alert("Job posted successfully!");
            }
            
            console.log(response.data);
            navigate("/hr/all-posted-jobs");
        } catch (error) {
            if (error.response?.data?.needsSubscription) {
                alert(error.response.data.error);
                navigate("/hr/buy-subscription");
            } else {
                alert(error.response?.data?.message || "Failed to post job");
            }
            console.log(error.response?.data || error.message);
        }
    };

    const handleGenerateDescription = async() => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const infoJobData = { title, companyName: JSON.parse(localStorage.getItem("user")).companyName, location: selectLocation.map(ele => ele.value), jobType: selectJobType.value, requirements: selectRequirement.map(ele => ele.value), experienceLevel: experience, salary };

            const response = await axios.post("http://localhost:3000/api/job/generateDescription", infoJobData, { headers: { Authorization: token } });
            setDescription(response.data.description);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

//     return (
//         <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
//             <div className='text-center mb-8 mt-16'>
//                 <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

//                 <p className='text-4xl font-bold text-gray-900 mb-4'>Post a Job</p>
//                 <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
//             </div>
            
//             <div className='flex justify-between gap-2'>
//                 <form className='bg-white border-2 border-gray-400 rounded-xl shadow-xl w-2/3 p-6' onSubmit={handleSubmit}>
//                     <div className='mb-2 mt-4'>
//                         <label htmlFor="title" className="font-semibold text-lg">Job Title <span className='text-red-600'>*</span></label><br />
//                         <input type="text" name="title" id="title" className='mt-1 border border-gray-300 w-full rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='ex: Software Engineer' />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="locations" className="font-semibold text-lg">Location <span className='text-red-600'>*</span></label>
//                         <CreatableSelect isMulti options={locations} value={selectLocation} onChange={(newValue) => setSelectLocation(newValue)} onCreateOption={(inputValue) => {
//                             const newOption = { value: (inputValue[0].toUpperCase()+inputValue.slice(1).toLowerCase()), label: inputValue };
//                             setLocations((prev) => [...prev, newOption]);
//                             setSelectLocation((prev) => [...prev, newOption]);
//                         }} />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="role" className="font-semibold text-lg">Job type <span className='text-red-600'>*</span></label><br />
//                         <CreatableSelect options={jobType} value={selectJobType} onChange={(newValue) => setSelectJobType(newValue)} onCreateOption={(inputValue) => {
//                             const newOption = { value: inputValue.toLowerCase(), label: inputValue };
//                             setJobType(newOption);
//                             setSelectJobType(newOption);
//                         }} />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="requirement" className="font-semibold text-lg">Requirements <span className='text-red-600'>*</span></label>
//                         <CreatableSelect isMulti options={requirement} value={selectRequirement} onChange={(newValue) => setSelectRequirement(newValue)} onCreateOption={(inputValue) => {
//                             const newOption = { value: inputValue.toLowerCase(), label: inputValue };
//                             setRequirement((prev) => [...prev, newOption]);
//                             setSelectRequirement((prev) => [...prev, newOption]);
//                         }} />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="experience" className="font-semibold text-lg">Experience <span className='text-red-600'>*</span></label><br />
//                         <input type="text" name="experience" id="experience" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={experience} onChange={(e) => setExperience(e.target.value)} />
//                     </div>

//                     <div className='flex items-center justify-between gap-4 mb-2'>                    
//                         <div className='w-full'>
//                             <label htmlFor="salary" className="font-semibold text-lg">Salary <span className='text-red-600'>*</span></label><br />
//                             <input type="number" name="salary" id="salary" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={salary} onChange={(e) => setSalary(e.target.value)} />
//                         </div>

//                         <div className='w-full'>
//                             <label htmlFor="deadline" className="font-semibold text-lg">Deadline <span className='text-red-600'>*</span></label><br />
//                             <input type="date" name="deadline" id="deadline" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
//                         </div>
//                     </div>

//                     <div className='relative w-full'>
//                         <label htmlFor="description" className="font-semibold text-lg">Description</label><br />
//                         <textarea type="text" name="description" id="description" className='border border-gray-300 w-full h-36 mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={description} onChange={(e) => setDescription(e.target.value)} />
                        
//                         {
//                             loading ? (
//                                 <div className="absolute inset-0 flex justify-center items-center bg-transparent bg-opacity-70">
//                                     <Loader />
//                                 </div>
//                             ) : (
//                                 <button type="button" className='absolute px-6 py-3 rounded bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white bottom-4 right-3 flex items-center justify-center gap-2 font-medium text-md opacity-90 cursor-pointer hover:shadow-xl hover:scale-105 duration-200 ease-in-out' onClick={handleGenerateDescription}>
//                                     <BsStars className="w-5 h-5" />
//                                     Generate through AI
//                                 </button>
//                             )
//                         }
                        
//                     </div>

//                     <div className='flex justify-center my-4'>
//                         <input type="submit" value="Post Job" className='bg-blue-500 px-10 py-2 rounded-lg text-white font-semibold text-xl hover:scale-105 hover:shadow-lg hover:font-bold duration-300 ease-in-out cursor-pointer' />
//                     </div>
//                 </form>

//                 <div className="w-1/3">
//                     <UserDetails />
//                 </div>
//             </div>

//         </div>
//     )
// };

    return (
        <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

                <p className='text-4xl font-bold text-gray-900 mb-4'>
                    {isEdit ? 'Edit Job' : 'Post a Job'}
                </p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
            </div>
            
            <div className='flex justify-between gap-2'>
                <form className='bg-white border-2 border-gray-400 rounded-xl shadow-xl w-2/3 p-6' onSubmit={handleSubmit}>
                    <div className='mb-2 mt-4'>
                        <label htmlFor="title" className="font-semibold text-lg">Job Title <span className='text-red-600'>*</span></label><br />
                        <input type="text" name="title" id="title" className='mt-1 border border-gray-300 w-full rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='ex: Software Engineer' required />
                    </div>

                    <div className='mb-2'>
                        <label htmlFor="location" className="font-semibold text-lg">Location <span className='text-red-600'>*</span></label>
                        <CreatableSelect isMulti options={locations} value={selectLocation} onChange={(newValue) => setSelectLocation(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: (inputValue[0].toUpperCase()+inputValue.slice(1).toLowerCase()), label: inputValue };
                            setLocations((prev) => [...prev, newOption]);
                            setSelectLocation((prev) => [...prev, newOption]);
                        }} />
                    </div>

                    <div className='mb-2'>
                        <label htmlFor="role" className="font-semibold text-lg">Job type <span className='text-red-600'>*</span></label><br />
                        <CreatableSelect options={jobType} value={selectJobType} onChange={(newValue) => setSelectJobType(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
                            setJobType(newOption);
                            setSelectJobType(newOption);
                        }} />
                    </div>

                    <div className='mb-2'>
                        <label htmlFor="requirement" className="font-semibold text-lg">Requirements <span className='text-red-600'>*</span></label>
                        <CreatableSelect isMulti options={requirement} value={selectRequirement} onChange={(newValue) => setSelectRequirement(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
                            setRequirement((prev) => [...prev, newOption]);
                            setSelectRequirement((prev) => [...prev, newOption]);
                        }} />
                    </div>

                    <div className='mb-2'>
                        <label htmlFor="experience" className="font-semibold text-lg">Experience <span className='text-red-600'>*</span></label><br />
                        <input type="text" name="experience" id="experience" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={experience} onChange={(e) => setExperience(e.target.value)} required />
                    </div>

                    <div className='flex items-center justify-between gap-4 mb-2'>                    
                        <div className='w-full'>
                            <label htmlFor="salary" className="font-semibold text-lg">Salary <span className='text-red-600'>*</span></label><br />
                            <input type="number" name="salary" id="salary" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={salary} onChange={(e) => setSalary(e.target.value)} required />
                        </div>

                        <div className='w-full'>
                            <label htmlFor="deadline" className="font-semibold text-lg">Deadline <span className='text-red-600'>*</span></label><br />
                            <input type="date" name="deadline" id="deadline" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                        </div>
                    </div>

                    <div className='relative w-full'>
                        <label htmlFor="description" className="font-semibold text-lg">Description</label><br />
                        <textarea type="text" name="description" id="description" className='border border-gray-300 w-full h-36 mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={description} onChange={(e) => setDescription(e.target.value)} />
                        
                        {
                            loading ? (
                                <div className="absolute inset-0 flex justify-center items-center bg-transparent bg-opacity-70">
                                    <Loader />
                                </div>
                            ) : (
                                <button type="button" className='absolute px-6 py-3 rounded bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white bottom-4 right-3 flex items-center justify-center gap-2 font-medium text-md opacity-90 cursor-pointer hover:shadow-xl hover:scale-105 duration-200 ease-in-out' onClick={handleGenerateDescription}>
                                    <BsStars className="w-5 h-5" />
                                    Generate through AI
                                </button>
                            )
                        }
                        
                    </div>

                    <div className='flex justify-center my-4'>
                        <input type="submit" value={isEdit ? "Update Job" : "Post Job"} className='bg-blue-500 px-10 py-2 rounded-lg text-white font-semibold text-xl hover:scale-105 hover:shadow-lg hover:font-bold duration-300 ease-in-out cursor-pointer' />
                    </div>
                </form>

                <div className="w-1/3">
                    <UserDetails />
                </div>
            </div>

        </div>
    )
}

export default PostJob;

























// Correct
// import React, { useContext, useState, useEffect } from 'react'
// import CreatableSelect from 'react-select/creatable';
// import { BsStars } from "react-icons/bs";
// import axios from 'axios';
// import Loader from '../../../Loading';
// import { Link, useNavigate } from 'react-router-dom';
// import UserDetails from "../UserDetails";

// const PostJob = () => {
//     const [title, setTitle] = useState("");
//     const [loading, setLoading] = useState(false);
    
//     const [jobType, setJobType] = useState([
//         { value: 'Full-Time', label: 'Full-Time' },
//         { value: 'Part-Time', label: 'Part-Time' },
//         { value: 'Internship', label: 'Internship' },
//         { value: 'Contract', label: 'Contract' },
//         { value: 'Remote', label: 'Remote' }
//     ]);
//     const [selectJobType, setSelectJobType] = useState(null);

//     const [location, setLocation] = useState([
//         { value: "Bangalore", label: "Bangalore" },
//         { value: "Chennai", label: "Chennai" },
//         { value: "Delhi", label: "Delhi" },
//         { value: "Hyderabad", label: "Hyderabad" },
//         { value: "Mumbai", label: "Mumbai" },
//         { value: "Kolkata", label: "Kolkata" }
//     ]);
//     const [selectLocation, setSelectLocation] = useState([]);

//     const [requirement, setRequirement] = useState([
//         { value: "MongoDB", label: "MongoDB" },
//         { value: "ExpressJS", label: "ExpressJS" },
//         { value: "ReactJS", label: "ReactJS" },
//         { value: "NodeJS", label: "NodeJS" },
//     ]);
//     const [selectRequirement, setSelectRequirement] = useState([]);

//     const [experience, setExperience] = useState("");
//     const [salary, setSalary] = useState("");
//     const [deadline, setDeadline] = useState("");
//     const [description, setDescription] = useState("");

    
//     const [allPostedJobs, setAllPostedJobs] = useState([]);

//     const navigate = useNavigate();

//     useEffect(() => {
//       (async() => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.get(`http://localhost:3000/api/job/allPostedJobsByHR`, { headers: { Authorization: token } });
//             console.log(response.data.jobs);
//             setAllPostedJobs(response.data.jobs);
//         } catch (error) {
//           console.log(error);
//         }
//       })();
//     }, []);
    
//     const handleSubmit = async(e) => {
//         e.preventDefault();

//         const formJobData = { title, location: selectLocation.map(ele => ele.value), jobType: selectJobType.value, requirements: selectRequirement.map(ele => ele.value), experienceLevel: experience, salary, deadline, description };

//         try {
//             const token = localStorage.getItem("token");

//             const response = await axios.post("http://localhost:3000/api/job", formJobData, {
//                 headers: {
//                     Authorization: `${token}`
//                 }
//             });

//             console.log(response.data);
//             alert("Job posted successfully!");
//             navigate("/hr/all-posted-jobs");
//         } catch (error) {
//             // console.log(error.response?.data || error.message);
//             if (error.response?.data?.needsSubscription) {
//                 alert(error.response.data.error);
//                 navigate("/hr/buy-subscription");
//             } else {
//                 alert(error.response?.data?.message || "Failed to post job");
//             }
//             console.log(error.response?.data || error.message);
//         }
//     };

//     const handleGenerateDescription = async() => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("token");

//             const infoJobData = { title, companyName: JSON.parse(localStorage.getItem("user")).companyName, location: selectLocation.map(ele => ele.value), jobType: selectJobType.value, requirements: selectRequirement.map(ele => ele.value), experienceLevel: experience, salary };

//             const response = await axios.post("http://localhost:3000/api/job/generateDescription", infoJobData, { headers: { Authorization: token } });
//             setDescription(response.data.description);
//         } catch (error) {
//             console.log(error.response?.data || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
//             <div className='text-center mb-8 mt-16'>
//                 <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

//                 <p className='text-4xl font-bold text-gray-900 mb-4'>Post a Job</p>
//                 <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
//             </div>
            
//             <div className='flex justify-between gap-2'>
//                 <form className='bg-white border-2 border-gray-400 rounded-xl shadow-xl w-2/3 p-6' onSubmit={handleSubmit}>
//                     <div className='mb-2 mt-4'>
//                         <label htmlFor="title" className="font-semibold text-lg">Job Title <span className='text-red-600'>*</span></label><br />
//                         <input type="text" name="title" id="title" className='mt-1 border border-gray-300 w-full rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='ex: Software Engineer' />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="location" className="font-semibold text-lg">Location <span className='text-red-600'>*</span></label>
//                         <CreatableSelect isMulti options={location} value={selectLocation} onChange={(newValue) => setSelectLocation(newValue)} onCreateOption={(inputValue) => {
//                             const newOption = { value: (inputValue[0].toUpperCase()+inputValue.slice(1).toLowerCase()), label: inputValue };
//                             setLocation((prev) => [...prev, newOption]);
//                             setSelectLocation((prev) => [...prev, newOption]);
//                         }} />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="role" className="font-semibold text-lg">Job type <span className='text-red-600'>*</span></label><br />
//                         <CreatableSelect options={jobType} value={selectJobType} onChange={(newValue) => setSelectJobType(newValue)} onCreateOption={(inputValue) => {
//                             const newOption = { value: inputValue.toLowerCase(), label: inputValue };
//                             setJobType(newOption);
//                             setSelectJobType(newOption);
//                         }} />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="requirement" className="font-semibold text-lg">Requirements <span className='text-red-600'>*</span></label>
//                         <CreatableSelect isMulti options={requirement} value={selectRequirement} onChange={(newValue) => setSelectRequirement(newValue)} onCreateOption={(inputValue) => {
//                             const newOption = { value: inputValue.toLowerCase(), label: inputValue };
//                             setRequirement((prev) => [...prev, newOption]);
//                             setSelectRequirement((prev) => [...prev, newOption]);
//                         }} />
//                     </div>

//                     <div className='mb-2'>
//                         <label htmlFor="experience" className="font-semibold text-lg">Experience <span className='text-red-600'>*</span></label><br />
//                         <input type="text" name="experience" id="experience" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={experience} onChange={(e) => setExperience(e.target.value)} />
//                     </div>

//                     <div className='flex items-center justify-between gap-4 mb-2'>                    
//                         <div className='w-full'>
//                             <label htmlFor="salary" className="font-semibold text-lg">Salary <span className='text-red-600'>*</span></label><br />
//                             <input type="number" name="salary" id="salary" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={salary} onChange={(e) => setSalary(e.target.value)} />
//                         </div>

//                         <div className='w-full'>
//                             <label htmlFor="deadline" className="font-semibold text-lg">Deadline <span className='text-red-600'>*</span></label><br />
//                             <input type="date" name="deadline" id="deadline" className='border border-gray-300 w-full mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
//                         </div>
//                     </div>

//                     <div className='relative w-full'>
//                         <label htmlFor="description" className="font-semibold text-lg">Description</label><br />
//                         <textarea type="text" name="description" id="description" className='border border-gray-300 w-full h-36 mt-1 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500' value={description} onChange={(e) => setDescription(e.target.value)} />
                        
//                         {
//                             loading ? (
//                                 <div className="absolute inset-0 flex justify-center items-center bg-transparent bg-opacity-70">
//                                     <Loader />
//                                 </div>
//                             ) : (
//                                 <button type="button" className='absolute px-6 py-3 rounded bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white bottom-4 right-3 flex items-center justify-center gap-2 font-medium text-md opacity-90 cursor-pointer hover:shadow-xl hover:scale-105 duration-200 ease-in-out' onClick={handleGenerateDescription}>
//                                     <BsStars className="w-5 h-5" />
//                                     Generate through AI
//                                 </button>
//                             )
//                         }
                        
//                     </div>

//                     <div className='flex justify-center my-4'>
//                         <input type="submit" value="Post Job" className='bg-blue-500 px-10 py-2 rounded-lg text-white font-semibold text-xl hover:scale-105 hover:shadow-lg hover:font-bold duration-300 ease-in-out cursor-pointer' />
//                     </div>
//                 </form>

//                 <div className="w-1/3">
//                     <UserDetails />
//                 </div>
//             </div>

//         </div>
//     )
// };

// export default PostJob;