// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react'
// import { FaBriefcase } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import { useNavigate } from 'react-router-dom';
// import { FaBookmark } from "react-icons/fa6";
// import { FaRegBookmark  } from "react-icons/fa6";
// import { FaSearch } from 'react-icons/fa';
// import { AuthContext } from '../../../context/AuthContext';

// const AllJobs = () => {
//   const { user, setUser } = useContext(AuthContext);
//   console.log("User", user);  

//   const [allJobs, setAllJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const fetchAllJobs = async() => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`http://localhost:3000/api/job`, { headers: { Authorization: token }});
//       // console.log(response.data.jobs);
//       setAllJobs(response.data.jobs);
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   const fetchSavedJobs = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`http://localhost:3000/api/savedJobs`, { headers: { Authorization: token } });

//       const jobId = response.data.savedJobs.map(job => job._id);
//       setSavedJobs(jobId);
//       console.log(response.data.savedJobs);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchAllJobs();
//     fetchSavedJobs();
//   }, []);

//   const handleSave = async (jobId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const isSaved = savedJobs.includes(jobId);

//       if(isSaved) {
//         await axios.delete(`http://localhost:3000/api/job/unsaveJob/${jobId}`, { headers: { Authorization: token } });
//         setSavedJobs(prev => prev.filter(id => id !== jobId));

//         // updating the user in localstorage and context
//         const updatedUser = { ...user, savedJobs: user.savedJobs.filter(id => id !== jobId) };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);
//       } else {
//         await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
//         setSavedJobs(prev => [...prev, jobId]);
      
//         // updating the user in localstorage and context
//         const updatedUser = { ...user, savedJobs: [ ...user.savedJobs, jobId ] };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);
//       }

//       // const response = await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
//       // console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const navigate = useNavigate();

//   return (
//     <div className='px-32 py-16'>
//       <p className='text-3xl font-semibold text-shadow-lg pb-8'>All Jobs</p>

//       <div className='border flex gap-4'>
//         <div className='border w-2/5 p-2'>
//           <div className='relative felx items-center border py-1'>
//             <FaSearch className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 border" />
//             <input type="text" name="" id="" className='w-full pl-6 text-gray-600' placeholder='Search by job title or company' />
//           </div>

//           <div>
//             <label htmlFor="">Location</label><br />
//             <select name="" id="" className='w-full border'>
//               <option value="all">All</option>
//               <option value="all">Remote</option>
//               <option value="all">Bangalore</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="">Position Type</label><br />
//             <select name="" id="" className='w-full border'>
//               <option value="all">All</option>
//               <option value="all">Fulltime</option>
//               <option value="all">Internship</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="">Requirements</label><br />
//             <select name="" id="" className='w-full border'>
//               <option value="all">All</option>
//               <option value="all">Java</option>
//               <option value="all">SQL</option>
//             </select>
//           </div>
//         </div>

//         <div className='border h-[600px] overflow-y-auto px-2'>
//           {
//             allJobs.map((job) => {
//               const isSaved = savedJobs.includes(job._id);
//               return <div key={job._id} className='border my-4 p-4 rounded-xl relative'>
//                 <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-12 w-12 rounded-lg' />
//                 <p>{job.title}</p>
//                 <p>{job.company}</p>
//                 <p>{job.description.slice(0, 200)}...</p>
//                 <p className='flex gap-2 items-center'><FaBriefcase /> {job.experienceLevel}</p>
//                 <p className='flex gap-2 items-center'><FaLocationDot /> {job.location.join(", ")}</p>
//                 {
//                   isSaved ? (
//                     <FaBookmark className='absolute right-4 top-4 text-amber-5npm run dev00 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
//                   ) : (
//                     <FaRegBookmark  className='absolute right-4 top-4 text-gray-300 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
//                   )
//                 }
                
//                 <button className={`absolute right-4 bottom-4 bg-amber-300 px-8 py-2 rounded cursor-pointer ${user.appliedJobs.includes(job._id) ? "bg-green-200 text-green-800 font-semibold" : ""}`} onClick={() => navigate(`/user/apply-job/${job._id}`)}>{ user.appliedJobs.includes(job._id) ? "Applied" : "Apply"}</button>
//               </div>
//             })
//           }
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AllJobs













// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react'
// import { FaBriefcase } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import { useNavigate } from 'react-router-dom';
// import { FaBookmark } from "react-icons/fa6";
// import { FaRegBookmark  } from "react-icons/fa6";
// import { FaSearch } from 'react-icons/fa';
// import { AuthContext } from '../../../context/AuthContext';

// const AllJobs = () => {
//   const { user, setUser } = useContext(AuthContext);
//   console.log("User", user);  

//   const [allJobs, setAllJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [filters, setFilters] = useState({
//     search: "",
//     location: "All Locations",
//     jobType: "All Types",
//     salary: "Any Salary",
//     experience: "Any Experience",
//     sortBy: "Created at"
//   });

//   // const filteredJobs = allJobs.filter(job => {
//   //   const matchSearch = filters.search === "" || job.title.toLowerCase().includes
//   // })

//   const filteredJobs = allJobs
//   .filter(job => {
//     const matchSearch = filters.search === '' || job.title.toLowerCase().includes(filters.search.toLowerCase()) || job.company.toLowerCase().includes(filters.search.toLowerCase());
//     const matchLocation = filters.location === 'All Locations' || job.location.includes(filters.location);
//     const matchType = filters.jobType === 'All Types' || job.jobType === filters.jobType;
//     // Add salary & experience logic if applicable
//     return matchSearch && matchLocation && matchType;
//   })
//   .sort((a, b) => {
//     return filters.sortBy === 'Created at'
//       ? new Date(b.createdAt) - new Date(a.createdAt)
//       : new Date(a.deadline) - new Date(b.deadline);
//   });


//   const fetchAllJobs = async() => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`http://localhost:3000/api/job`, { headers: { Authorization: token }});
//       // console.log(response.data.jobs);
//       setAllJobs(response.data.jobs);
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   const fetchSavedJobs = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`http://localhost:3000/api/savedJobs`, { headers: { Authorization: token } });

//       const jobId = response.data.savedJobs.map(job => job._id);
//       setSavedJobs(jobId);
//       console.log(response.data.savedJobs);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchAllJobs();
//     fetchSavedJobs();
//   }, []);

//   const handleSave = async (jobId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const isSaved = savedJobs.includes(jobId);

//       if(isSaved) {
//         await axios.delete(`http://localhost:3000/api/job/unsaveJob/${jobId}`, { headers: { Authorization: token } });
//         setSavedJobs(prev => prev.filter(id => id !== jobId));

//         // updating the user in localstorage and context
//         const updatedUser = { ...user, savedJobs: user.savedJobs.filter(id => id !== jobId) };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);
//       } else {
//         await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
//         setSavedJobs(prev => [...prev, jobId]);
      
//         // updating the user in localstorage and context
//         const updatedUser = { ...user, savedJobs: [ ...user.savedJobs, jobId ] };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);
//       }

//       // const response = await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
//       // console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const navigate = useNavigate();

//   return (
//     <div className='px-32 py-16'>
//       <p className='text-3xl font-semibold text-shadow-lg pb-8'>All Jobs</p>

//       {/* Filtering */}
//       <div className="pt-4 px-4 pb-2 border border-gray-200 rounded-md shadow-md mb-4">
//         {/* 1st row */}
//         <div className='flex gap-2 mb-4'>
//           <div className='relative rounded-md w-3/4'>
//             <FaSearch className="absolute left-4 top-[45%] transform -translate-y-1/2 text-gray-400 text-2xl" />
//             <input type="text" name="" id="" className='w-full pl-12 border-2 border-gray-200 rounded-md text-base text-gray-800 py-3' placeholder='Search by job title or company' />
//           </div>

//           <div className="space-y-2 relative w-1/4">
//             <select id='sortBy' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300">
//                 <option>Created at</option>
//                 <option>End date</option>
//             </select>
//             <label htmlFor='sortBy' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Sort By</label>
//           </div>
//         </div>

//         {/* 2nd row */}
//         <div className="w-full flex gap-2">
//           <div className="space-y-2 relative w-full">
//             <select id='location' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300">
//               <option>All Locations</option>
//               <option>Bangalore</option>
//               <option>Hyderabad</option>
//               <option>Pune</option>
//               <option>Chennai</option>
//               <option>Mumbai</option>
//               <option>Delhi</option>
//               <option>Remote</option>
//             </select>
//             <label htmlFor='location' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Location</label>
//           </div>
          
//           <div className="space-y-2 relative w-full">
//             <select id='jobType' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300">
//               <option>All Types</option>
//               <option>Full-time</option>
//               <option>Part-time</option>
//               <option>Contract</option>
//               <option>Internship</option>
//               <option>Remote</option>
//             </select>
//             <label htmlFor='jobType' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Job Type</label>
//           </div>

//           <div className="space-y-2 relative w-full">
//             <select id='salary' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300">
//               <option>Any Salary</option>
//               <option>₹3-6 LPA</option>
//               <option>₹6-12 LPA</option>
//               <option>₹12-20 LPA</option>
//               <option>₹20+ LPA</option>
//             </select>
//             <label htmlFor='salary' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Salary Range</label>
//           </div>

//           <div className="space-y-2 relative w-full">
//             <select id='experience' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300">
//               <option>Any Experience</option>
//               <option>0-2 years</option>
//               <option>2-5 years</option>
//               <option>5-10 years</option>
//               <option>10+ years</option>
//             </select>
//             <label htmlFor='experience' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Experience</label>
//           </div>
//         </div>
//       </div>

//       {/* All jobs */}
//       <div className='border border-gray-200 rounded-md shadow-2xl w-full h-[600px] overflow-y-auto p-4 flex flex-wrap gap-[1%]'>
//         {
//           allJobs.map((job) => {
//             const isSaved = savedJobs.includes(job._id);
//             return <div key={job._id} className='border border-l-8 p-4 rounded-xl relative w-[49.5%]'>
//               <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-12 w-12 rounded-lg' />
//               <p>{job.title}</p>
//               <p>{job.company}</p>
//               <p>{job.description.slice(0, 200)}...</p>
//               <p className='flex gap-2 items-center'><FaBriefcase /> {job.experienceLevel}</p>
//               <p className='flex gap-2 items-center'><FaLocationDot /> {job.location.join(", ")}</p>
//               {
//                 isSaved ? (
//                   <FaBookmark className='absolute right-4 top-4 text-amber-5npm run dev00 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
//                 ) : (
//                   <FaRegBookmark  className='absolute right-4 top-4 text-gray-300 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
//                 )
//               }
              
//               <button className={`absolute right-4 bottom-4 bg-amber-300 px-8 py-2 rounded cursor-pointer ${user.appliedJobs.includes(job._id) ? "bg-green-200 text-green-800 font-semibold" : ""}`} onClick={() => navigate(`/user/apply-job/${job._id}`)}>{ user.appliedJobs.includes(job._id) ? "Applied" : "Apply"}</button>
//             </div>
//           })
//         }
//       </div>
//     </div>
//   )
// }

// export default AllJobs






















//! main
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark  } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { GiGraduateCap } from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";
import { AuthContext } from '../../../context/AuthContext';
import ReactMarkdown from "react-markdown";
import CurrencyFormatter from '../../../CurrencyFormatter';
import { RiArrowDropRightLine } from "react-icons/ri";
import { formatDistanceToNow  } from "date-fns";


const AllJobs = () => {
  const { user, setUser } = useContext(AuthContext);
  console.log("User:", user);  

  const [allJobs, setAllJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    location: "All Locations",
    jobType: "All Types",
    salary: "Any Salary",
    experience: "Any Experience",
    sortBy: "Created at"
  });


  const filteredJobs = allJobs
  .filter(job => {
    const matchSearch = filters.search === '' || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
      job.companyName.toLowerCase().includes(filters.search.toLowerCase());
    
    // Better location matching for arrays
    const matchLocation = filters.location === 'All Locations' || 
      job.location.some(loc => loc.includes(filters.location));
    
    const matchType = filters.jobType === 'All Types' || job.jobType === filters.jobType;
    const matchSalary = filters.salary === 'Any Salary' || job.salary === filters.salary;
    const matchExperience = filters.experience === 'Any Experience' || job.experience === filters.experience;
    
    return matchSearch && matchLocation && matchType && matchSalary && matchExperience;
  })
  .sort((a, b) => {
    return filters.sortBy === 'Created at'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.deadline) - new Date(b.deadline);
  });

  const fetchAllJobs = async() => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/job`, { headers: { Authorization: token }});
      console.log("All jobs:", response.data.jobs);
      const checking = response.data.jobs[11].salary;  // Last jobs: 400000 number
      console.log("Last jobs:", checking, typeof checking);
      setAllJobs(response.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/savedJobs`, { headers: { Authorization: token } });

      const jobId = response.data.savedJobs.map(job => job._id);
      setSavedJobs(jobId);
      console.log("Saved jobs:", response.data.savedJobs);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllJobs();
    fetchSavedJobs();
  }, []);

  const handleSave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const isSaved = savedJobs.includes(jobId);

      if(isSaved) {
        await axios.delete(`http://localhost:3000/api/job/unsaveJob/${jobId}`, { headers: { Authorization: token } });
        setSavedJobs(prev => prev.filter(id => id !== jobId));

        // updating the user in localstorage and context
        const updatedUser = { ...user, savedJobs: user.savedJobs.filter(id => id !== jobId) };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
        setSavedJobs(prev => [...prev, jobId]);
      
        // updating the user in localstorage and context
        const updatedUser = { ...user, savedJobs: [ ...user.savedJobs, jobId ] };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      // const response = await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const navigate = useNavigate();

  return (
    <div className='px-32 py-16'>
      <p className='text-3xl font-semibold text-shadow-lg pb-8 mt-12'>All Jobs</p>

      {/* Filtering */}
      <div className="pt-4 px-4 pb-2 border border-gray-200 rounded-md shadow-md mb-4">
        {/* 1st row */}
        <div className='flex gap-2 mb-4'>
          <div className='relative rounded-md w-3/4'>
            <FaSearch className="absolute left-4 top-[45%] transform -translate-y-1/2 text-gray-400 text-2xl" />
            <input type="text" name="" id="" className='w-full pl-12 border-2 border-gray-200 rounded-md text-base text-gray-800 py-3' placeholder='Search by job title or company' value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
          </div>

          <div className="space-y-2 relative w-1/4">
            <select id='sortBy' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})}>
                <option>Created at</option>
                <option>End date</option>
            </select>
            <label htmlFor='sortBy' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Sort By</label>
          </div>
        </div>

        {/* 2nd row */}
        <div className="w-full flex gap-2">
          <div className="space-y-2 relative w-full">
            <select id='location' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}>
              <option>All Locations</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Chennai</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Remote</option>
            </select>
            <label htmlFor='location' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Location</label>
          </div>
          
          <div className="space-y-2 relative w-full">
            <select id='jobType' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.jobType} onChange={e => setFilters({...filters, jobType: e.target.value})}>
              <option>All Types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
            <label htmlFor='jobType' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Job Type</label>
          </div>

          <div className="space-y-2 relative w-full">
            <select id='salary' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.salary} onChange={e => setFilters({...filters, salary: e.target.value})}>
              <option>Any Salary</option>
              <option>₹3-6 LPA</option>
              <option>₹6-12 LPA</option>
              <option>₹12-20 LPA</option>
              <option>₹20+ LPA</option>
            </select>
            <label htmlFor='salary' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Salary Range</label>
          </div>

          <div className="space-y-2 relative w-full">
            <select id='experience' className="w-full p-3 border-2 border-gray-200 rounded-md bg-white outline-none transition-all duration-300" value={filters.experience} onChange={e => setFilters({...filters, experience: e.target.value})}>
              <option>Any Experience</option>
              <option>0-2 years</option>
              <option>2-5 years</option>
              <option>5-10 years</option>
              <option>10+ years</option>
            </select>
            <label htmlFor='experience' className="absolute z-10 flex items-center -top-3 left-3 bg-white px-1 text-sm font-normal text-gray-700">Experience</label>
          </div>
        </div>
      </div>

      {/* All jobs */}
      <div className='border border-gray-200 rounded-md shadow-2xl w-full h-[600px] overflow-y-auto p-4'>
        {filteredJobs.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-500'>
            <div className='text-6xl mb-4'>😔</div>
            <h3 className='text-2xl font-semibold mb-2'>Sorry, no jobs found</h3>
            <p className='text-gray-400'>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className='flex flex-wrap gap-[1%]'>
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(job._id);
              return (
                <div key={job._id} className='border border-gray-300 p-4 rounded-xl relative w-[49.5%] mb-4 hover:scale-102 hover:shadow-lg hover:border-gray-600/50 duration-300 ease-in-out'>
                  {/* <div className='absolute h-[20%] bg-gradient-to-r from-red-500 to-purple-500 opacity-50 top-0 left-0 w-full rounded-t-xl -z-5'></div> */}
                  {/* <div className='absolute h-[20%] bg-gradient-to-r from-teal-400 to-indigo-500 opacity-35 top-0 left-0 w-full rounded-t-xl -z-5'></div> */}
                  <div className='absolute h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-35 top-0 left-0 w-full rounded-t-xl -z-5'></div>
                  <div className='flex gap-4'>
                    <img src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} alt={job.companyLogo} className='h-20 w-20 rounded-lg shadow-lg' />
                    <div>
                      {/* <p className='font-extralight text-xs'>JOB ID: {job._id}</p> */}
                      <p className='font-bold text-xl mt-2'>{job.title}</p>
                      <p className='font-semibold text-lg'>{job.companyName}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 my-4">
                    <div className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaBriefcase /> {job.jobType}</div>
                    <div className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><FaLocationDot /> {job.location.join(", ")}</div>
                    <div className='bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><GiGraduateCap />{job.experienceLevel}</div>
                    <div className='bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'><CurrencyFormatter amount={Number(job.salary)} currencyCode="INR" /></div>

                    {/* <div className='bg-amber-200 rounded-2xl px-6 py-1 flex items-center justify-center gap-2'>
                      <FaRupeeSign />
                      {job.salary ? 
                        (typeof job.salary === 'number' ? 
                          `${(job.salary / 100000).toFixed(2)} LPA` : 
                          job.salary
                        ) : 
                        'Not specified'
                      }
                    </div> */}

                  </div>
                  {/* <ReactMarkdown>{job.description.slice(0, 200)}...</ReactMarkdown> */}

                  {/* <div className='mb-10'> */}
                  <div className='mb-6'>
                    <ReactMarkdown>{job.description ? job.description.slice(0, 200) : "No description available."}</ReactMarkdown>
                  </div>

                  <p>Posted on: {formatDistanceToNow(new Date(job.createdAt))} ago</p>
                  {/* <p>Deadline: {formatDistanceToNow(new Date(job.deadline))} ago</p> */}
                  {/* <p>{new Date(job.deadline) < new Date() ? 'Deadline was ' : 'Deadline in '}{formatDistanceToNow(new Date(job.deadline))}</p> */}
                  <p>{new Date(job.deadline) > Date.now() ? `Deadline in ${formatDistanceToNow(new Date(job.deadline))}` : `Deadline was ${formatDistanceToNow(new Date(job.deadline))} ago`}</p>

                  {/* <p className='flex gap-2 items-center'><FaBriefcase /> {job.experienceLevel}</p>
                  <p className='flex gap-2 items-center'><FaLocationDot /> {job.location.join(", ")}</p> */}
                  {
                    isSaved ? (
                      <FaBookmark className='absolute right-4 top-4 text-gray-800 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
                    ) : (
                      <FaRegBookmark className='absolute right-4 top-4 text-gray-800 cursor-pointer hover:scale-110' onClick={() => handleSave(job._id)} />
                    )
                  }

                  <button className={`absolute right-4 bottom-4 py-2 px-8 font-semibold rounded cursor-pointer ${user.appliedJobs.includes(job._id) ? "bg-green-200 text-green-800" : " bg-orange-300/50 text-orange-800 hover:scale-110"}`} onClick={() => navigate(`/user/apply-job/${job._id}`)}>
                    {user.appliedJobs.includes(job._id) ? "Applied" : "Apply"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllJobs




































































// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react'
// import { FaBriefcase } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import { useNavigate } from 'react-router-dom';
// import { FaBookmark } from "react-icons/fa6";
// import { FaRegBookmark  } from "react-icons/fa6";
// import { FaSearch } from 'react-icons/fa';
// import { GiGraduateCap } from "react-icons/gi";
// import { FaRupeeSign } from "react-icons/fa";
// import { AuthContext } from '../../../context/AuthContext';
// import ReactMarkdown from "react-markdown";
// import CurrencyFormatter from '../../../CurrencyFormatter';
// import { ImArrowUpRight } from "react-icons/im";

// const AllJobs = () => {
//   const { user, setUser } = useContext(AuthContext);
//   console.log("User:", user);  

//   const [allJobs, setAllJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [filters, setFilters] = useState({
//     search: "",
//     location: "All Locations",
//     jobType: "All Types",
//     salary: "Any Salary",
//     experience: "Any Experience",
//     sortBy: "Created at"
//   });


//   const filteredJobs = allJobs
//   .filter(job => {
//     const matchSearch = filters.search === '' || 
//       job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
//       job.companyName.toLowerCase().includes(filters.search.toLowerCase());
    
//     // Better location matching for arrays
//     const matchLocation = filters.location === 'All Locations' || 
//       job.location.some(loc => loc.includes(filters.location));
    
//     const matchType = filters.jobType === 'All Types' || job.jobType === filters.jobType;
//     const matchSalary = filters.salary === 'Any Salary' || job.salary === filters.salary;
//     const matchExperience = filters.experience === 'Any Experience' || job.experience === filters.experience;
    
//     return matchSearch && matchLocation && matchType && matchSalary && matchExperience;
//   })
//   .sort((a, b) => {
//     return filters.sortBy === 'Created at'
//       ? new Date(b.createdAt) - new Date(a.createdAt)
//       : new Date(a.deadline) - new Date(b.deadline);
//   });

//   const fetchAllJobs = async() => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`http://localhost:3000/api/job`, { headers: { Authorization: token }});
//       console.log("All jobs:", response.data.jobs);
//       const checking = response.data.jobs[11].salary;  // Last jobs: 400000 number
//       console.log("Last jobs:", checking, typeof checking);
//       setAllJobs(response.data.jobs);
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   const fetchSavedJobs = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`http://localhost:3000/api/savedJobs`, { headers: { Authorization: token } });

//       const jobId = response.data.savedJobs.map(job => job._id);
//       setSavedJobs(jobId);
//       console.log("Saved jobs:", response.data.savedJobs);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchAllJobs();
//     fetchSavedJobs();
//   }, []);

//   const handleSave = async (jobId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const isSaved = savedJobs.includes(jobId);

//       if(isSaved) {
//         await axios.delete(`http://localhost:3000/api/job/unsaveJob/${jobId}`, { headers: { Authorization: token } });
//         setSavedJobs(prev => prev.filter(id => id !== jobId));

//         // updating the user in localstorage and context
//         const updatedUser = { ...user, savedJobs: user.savedJobs.filter(id => id !== jobId) };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);
//       } else {
//         await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
//         setSavedJobs(prev => [...prev, jobId]);
      
//         // updating the user in localstorage and context
//         const updatedUser = { ...user, savedJobs: [ ...user.savedJobs, jobId ] };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUser(updatedUser);
//       }

//       // const response = await axios.post(`http://localhost:3000/api/job/saveJob/${jobId}`, {}, { headers: { Authorization: token } });
//       // console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const navigate = useNavigate();

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
//       <div className='px-4 md:px-8 lg:px-32 py-16'>
//         {/* Header with animated gradient text */}
//         <div className='text-center mb-12'>
//           <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-pulse'>
//             Find Your Dream Job
//           </h1>
//           <p className='text-gray-600 text-lg font-medium'>Discover opportunities that match your skills and aspirations</p>
//         </div>

//         {/* Enhanced Filtering Section */}
//         <div className="backdrop-blur-sm bg-white/80 border border-white/20 rounded-2xl shadow-xl mb-8 p-6 hover:shadow-2xl transition-all duration-300">
//           {/* Search Row with Gradient Border */}
//           <div className='flex flex-col lg:flex-row gap-4 mb-6'>
//             <div className='relative rounded-xl w-full lg:w-3/4 group'>
//               <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity'></div>
//               <div className='relative'>
//                 <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 text-xl z-10" />
//                 <input 
//                   type="text" 
//                   className='w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 shadow-lg' 
//                   placeholder='🔍 Search by job title or company...' 
//                   value={filters.search} 
//                   onChange={e => setFilters({...filters, search: e.target.value})} 
//                 />
//               </div>
//             </div>

//             <div className="space-y-2 relative w-full lg:w-1/4">
//               <select 
//                 id='sortBy' 
//                 className="w-full p-4 border-2 border-indigo-200 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 shadow-lg cursor-pointer" 
//                 value={filters.sortBy} 
//                 onChange={e => setFilters({...filters, sortBy: e.target.value})}
//               >
//                 <option>Created at</option>
//                 <option>End date</option>
//               </select>
//               <label htmlFor='sortBy' className="absolute -top-3 left-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent px-2 text-sm font-semibold">Sort By</label>
//             </div>
//           </div>

//           {/* Filter Options Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="space-y-2 relative group">
//               <select 
//                 id='location' 
//                 className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group-hover:border-blue-300" 
//                 value={filters.location} 
//                 onChange={e => setFilters({...filters, location: e.target.value})}
//               >
//                 <option>All Locations</option>
//                 <option>Bangalore</option>
//                 <option>Hyderabad</option>
//                 <option>Pune</option>
//                 <option>Chennai</option>
//                 <option>Mumbai</option>
//                 <option>Delhi</option>
//                 <option>Remote</option>
//               </select>
//               <label htmlFor='location' className="absolute -top-3 left-4 bg-blue-600 text-white px-2 text-sm font-semibold rounded-full">📍 Location</label>
//             </div>
            
//             <div className="space-y-2 relative group">
//               <select 
//                 id='jobType' 
//                 className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm font-medium focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group-hover:border-green-300" 
//                 value={filters.jobType} 
//                 onChange={e => setFilters({...filters, jobType: e.target.value})}
//               >
//                 <option>All Types</option>
//                 <option>Full-time</option>
//                 <option>Part-time</option>
//                 <option>Contract</option>
//                 <option>Internship</option>
//                 <option>Remote</option>
//               </select>
//               <label htmlFor='jobType' className="absolute -top-3 left-4 bg-green-600 text-white px-2 text-sm font-semibold rounded-full">💼 Job Type</label>
//             </div>

//             <div className="space-y-2 relative group">
//               <select 
//                 id='salary' 
//                 className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm font-medium focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group-hover:border-amber-300" 
//                 value={filters.salary} 
//                 onChange={e => setFilters({...filters, salary: e.target.value})}
//               >
//                 <option>Any Salary</option>
//                 <option>₹3-6 LPA</option>
//                 <option>₹6-12 LPA</option>
//                 <option>₹12-20 LPA</option>
//                 <option>₹20+ LPA</option>
//               </select>
//               <label htmlFor='salary' className="absolute -top-3 left-4 bg-amber-600 text-white px-2 text-sm font-semibold rounded-full">💰 Salary</label>
//             </div>

//             <div className="space-y-2 relative group">
//               <select 
//                 id='experience' 
//                 className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group-hover:border-purple-300" 
//                 value={filters.experience} 
//                 onChange={e => setFilters({...filters, experience: e.target.value})}
//               >
//                 <option>Any Experience</option>
//                 <option>0-2 years</option>
//                 <option>2-5 years</option>
//                 <option>5-10 years</option>
//                 <option>10+ years</option>
//               </select>
//               <label htmlFor='experience' className="absolute -top-3 left-4 bg-purple-600 text-white px-2 text-sm font-semibold rounded-full">🎓 Experience</label>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Jobs Container */}
//         <div className='backdrop-blur-sm bg-white/80 border border-white/20 rounded-2xl shadow-2xl w-full h-[700px] overflow-hidden'>
//           <div className='h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100'>
//             {filteredJobs.length === 0 ? (
//               <div className='flex flex-col items-center justify-center h-full text-gray-500'>
//                 <div className='text-8xl mb-6 animate-bounce'>🔍</div>
//                 <h3 className='text-3xl font-bold mb-4 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent'>No jobs found</h3>
//                 <p className='text-gray-500 text-lg text-center max-w-md'>Try adjusting your filters or search criteria to discover more opportunities</p>
//               </div>
//             ) : (
//               <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
//                 {filteredJobs.map((job) => {
//                   const isSaved = savedJobs.includes(job._id);
//                   return (
//                     <div key={job._id} className='group relative bg-white/90 backdrop-blur-sm border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:border-indigo-300 transition-all duration-500 transform hover:-translate-y-2'>
//                       {/* Animated gradient header */}
//                       <div className='absolute h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 top-0 left-0 w-full rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300'></div>
                      
//                       {/* Company info with enhanced styling */}
//                       <div className='flex items-start gap-4 mb-6'>
//                         <div className='relative'>
//                           <img 
//                             src={`http://localhost:3000/uploads/company-logos/${job.companyLogo}`} 
//                             alt={job.companyLogo} 
//                             className='h-16 w-16 rounded-2xl shadow-lg ring-4 ring-white group-hover:ring-indigo-100 transition-all duration-300' 
//                           />
//                           <div className='absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity'></div>
//                         </div>
//                         <div className='flex-1'>
//                           <h3 className='font-bold text-xl text-gray-800 group-hover:text-indigo-700 transition-colors duration-300 mb-1 leading-tight'>
//                             {job.title}
//                           </h3>
//                           <p className='text-gray-600 font-medium'>{job.companyName}</p>
//                         </div>
//                       </div>

//                       {/* Enhanced tags with modern design */}
//                       <div className="flex flex-wrap gap-2 mb-6">
//                         <span className='bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold border border-blue-200 shadow-sm'>
//                           <FaBriefcase className="text-xs" /> {job.jobType}
//                         </span>
//                         <span className='bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold border border-green-200 shadow-sm'>
//                           <FaLocationDot className="text-xs" /> {job.location.join(", ")}
//                         </span>
//                         <span className='bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold border border-purple-200 shadow-sm'>
//                           <GiGraduateCap className="text-xs" /> {job.experienceLevel}
//                         </span>
//                         <span className='bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold border border-amber-200 shadow-sm'>
//                           <CurrencyFormatter amount={Number(job.salary)} currencyCode="INR" />
//                         </span>
//                       </div>

//                       {/* Enhanced description */}
//                       <div className='text-gray-700 leading-relaxed mb-8 font-medium'>
//                         {/* <ReactMarkdown className="prose prose-sm max-w-none">
//                           {job.description ? job.description.slice(0, 200) + "..." : "No description available."}
//                         </ReactMarkdown> */}
//                       </div>

//                       {/* Enhanced bookmark icon */}
//                       <div className='absolute right-6 top-6'>
//                         {isSaved ? (
//                           <FaBookmark 
//                             className='text-indigo-600 cursor-pointer hover:text-indigo-800 hover:scale-125 transition-all duration-300 text-xl drop-shadow-lg' 
//                             onClick={() => handleSave(job._id)} 
//                           />
//                         ) : (
//                           <FaRegBookmark 
//                             className='text-gray-400 cursor-pointer hover:text-indigo-600 hover:scale-125 transition-all duration-300 text-xl' 
//                             onClick={() => handleSave(job._id)} 
//                           />
//                         )}
//                       </div>
                      
//                       {/* Enhanced apply button */}
//                       <div className='absolute right-6 bottom-6'>
//                         <button 
//                           className={`group/btn flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg ${
//                             user.appliedJobs.includes(job._id) 
//                               ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200 cursor-default" 
//                               : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 active:scale-95"
//                           }`} 
//                           onClick={() => navigate(`/user/apply-job/${job._id}`)}
//                           disabled={user.appliedJobs.includes(job._id)}
//                         >
//                           {user.appliedJobs.includes(job._id) ? (
//                             <>
//                               <span>✅ Applied</span>
//                             </>
//                           ) : (
//                             <>
//                               <span>Apply Now</span>
//                               <ImArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AllJobs