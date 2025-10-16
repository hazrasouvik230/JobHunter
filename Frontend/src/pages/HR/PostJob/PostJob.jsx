import React, { useContext, useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import { BsStars } from "react-icons/bs";
import axios from 'axios';
import Loader from '../../../Loading';
import { Link, useNavigate } from 'react-router-dom';
import UserDetails from "../UserDetails";

const PostJob = () => {
    // const { allPostedJobs } = useContext(JobContext);
    // console.log(allPostedJobs);

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

    const [location, setLocation] = useState([
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

    
    const [allPostedJobs, setAllPostedJobs] = useState([]);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
      (async() => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/job/allPostedJobsByHR`, { headers: { Authorization: token } });
            console.log(response.data.jobs);
            setAllPostedJobs(response.data.jobs);

            // Fetch subscription info
            const subResponse = await axios.get(`http://localhost:3000/api/subscription/current`, {
                headers: { Authorization: token }
            });
            setSubscriptionInfo(subResponse.data.subscription);
        } catch (error) {
          console.log(error);
        }
      })();
    }, []);

    const liveJobs = allPostedJobs.filter((job) => new Date(job.deadline) > Date.now());
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        const formJobData = { title, location: selectLocation.map(ele => ele.value), jobType: selectJobType.value, requirements: selectRequirement.map(ele => ele.value), experienceLevel: experience, salary, deadline, description };

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:3000/api/job", formJobData, {
                headers: {
                    Authorization: `${token}`
                }
            });

            console.log(response.data);
            alert("Job posted successfully!");
            navigate("/hr/all-posted-jobs");
        } catch (error) {
            // console.log(error.response?.data || error.message);
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

    return (
        // <div className='px-32 py-16'>
        <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

                <p className='text-4xl font-bold text-gray-900 mb-4'>Post a Job</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
            </div>
            
            <div className='flex justify-between gap-2'>
                <form className='bg-white border border-red-400 w-2/3' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Job Title</label><br />
                        <input type="text" name="title" id="title" className='border border-gray-300 w-full rounded px-2 py-1' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="location">Location</label>
                        <CreatableSelect isMulti options={location} value={selectLocation} onChange={(newValue) => setSelectLocation(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: (inputValue[0].toUpperCase()+inputValue.slice(1).toLowerCase()), label: inputValue };
                            setLocation((prev) => [...prev, newOption]);
                            setSelectLocation((prev) => [...prev, newOption]);
                        }} />
                    </div>

                    <div>
                        <label htmlFor="role">Job type</label><br />
                        <CreatableSelect options={jobType} value={selectJobType} onChange={(newValue) => setSelectJobType(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
                            // setRole((prev) => [...prev, newOption]);
                            setJobType(newOption);
                            setSelectJobType(newOption);
                        }} />
                    </div>

                    <div>
                        <label htmlFor="requirement">Requirements</label>
                        <CreatableSelect isMulti options={requirement} value={selectRequirement} onChange={(newValue) => setSelectRequirement(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
                            setRequirement((prev) => [...prev, newOption]);
                            setSelectRequirement((prev) => [...prev, newOption]);
                        }} />
                    </div>

                    <div>
                        <label htmlFor="experience">Experience</label><br />
                        <input type="text" name="experience" id="experience" className='border border-gray-300 w-full rounded px-2 py-1' value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>

                    <div className='flex items-center justify-between gap-4'>                    
                        <div className='w-full'>
                            <label htmlFor="salary">Salary</label><br />
                            <input type="number" name="salary" id="salary" className='border border-gray-300 w-full rounded px-2 py-1' value={salary} onChange={(e) => setSalary(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <label htmlFor="deadline">Deadline</label><br />
                            <input type="date" name="deadline" id="deadline" className='border border-gray-300 w-full rounded px-2 py-1' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        </div>
                    </div>

                    <div className='relative w-full'>
                        <label htmlFor="description">Description</label><br />
                        <textarea type="text" name="description" id="description" className='border border-gray-300 w-full h-36 rounded px-2 py-1' value={description} onChange={(e) => setDescription(e.target.value)} />
                        
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

                    <div className='flex justify-center mt-4 mb-8'>
                        <input type="submit" value="Post Job" className='bg-sky-400/50 px-8 py-2 rounded text-white font-semibold text-xl hover:scale-105 hover:shadow-lg hover:font-bold duration-300 ease-in-out cursor-pointer' />
                    </div>
                </form>

                {/* <div className='w-1/3 border border-amber-500 flex flex-col items-center pt-4 gap-2'>
                    <img src={`http://localhost:3000/uploads/company-logos/${JSON.parse(localStorage.getItem("user")).companyLogo}`} alt={JSON.parse(localStorage.getItem("user")).companyLogo} className='h-32 w-32 rounded-full border' />
                    <p className='text-2xl text-center font-semibold'>{JSON.parse(localStorage.getItem("user")).companyName}</p>
                    
                    <div className="text-center mt-4">
                        <p className="font-semibold text-lg">{subscriptionInfo?.planName || 'Free'} Plan</p>
                        <p>Total jobs posted: {allPostedJobs.length}</p>
                        <p>Live posted jobs: {liveJobs.length}</p>
                        <p className={`font-medium ${subscriptionInfo?.remainingPosts <= 0 ? 'text-red-600' : 'text-green-600'}`}>Remaining posts: {subscriptionInfo?.remainingPosts || 0}/{subscriptionInfo?.jobPostsLimit || 3}</p>
                        {
                            subscriptionInfo?.isExpired && (
                                <p className="text-red-600 text-sm mt-2">Subscription Expired!</p>
                            )
                        }
                    </div>
                    
                    <button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mt-4 transition-colors'><Link to="/hr/buy-subscription">{subscriptionInfo?.planName === 'Free' ? 'Upgrade Plan' : 'Manage Subscription'}</Link></button>
                </div> */}

                <div className="w-1/3">
                    <UserDetails />
                </div>
                {/* <CompanyDetails /> */}
            </div>

        </div>
    )
}

export default PostJob;