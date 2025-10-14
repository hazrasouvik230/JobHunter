import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import CompanyDetails from './CompanyDetails';
import JobContext from '../../../context/JobsContext';
import { BsBriefcaseFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { FaUserCheck } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { formatDistanceToNow  } from "date-fns";

const AllPostedJobs = () => {
    const [allPostedJobs, setAllPostedJobs] = useState([]);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);

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
    const navigate = useNavigate();

    return (
      <div className='px-6 md:px-32 py-12 bg-gray-50 min-h-screen'>
        <div className='text-center mb-8 mt-16'>
            <div className="absolute"><span className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold"><Link to="/">Back</Link></span></div>

            <p className='text-4xl font-bold text-gray-900 mb-4'>All posted jobs</p>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Find the best talent for your company.</p>
        </div>

        <div>
          {
            allPostedJobs?.length > 0 ?
              <div className='flex justify-between gap-2'>
                <div className='bg-white border border-red-400 w-2/3'>
                  {
                    allPostedJobs.map((allJobs) => {
                      return <div key={allJobs._id} className='border border-l-8 my-4 px-8 py-4 rounded hover:shadow-lg hover:scale-101'>
                        <p className='text-2xl font-bold'>{allJobs.title}</p>

                        <div className="flex gap-8 my-4">
                          <p className='flex items-center gap-1'><BsBriefcaseFill /> {allJobs.jobType}</p>
                          <p className='flex items-center gap-1'><FaLocationDot />{allJobs.location.join(", ")}</p>
                          <p className='flex items-center gap-1'><FaRupeeSign />{allJobs.salary}</p>
                          <p className='flex items-center gap-1'><CiTimer />{formatDistanceToNow(new Date(allJobs.createdAt))} ago</p>
                        </div>

                        <div className='flex gap-2'>
                          {
                            allJobs.requirements.map(ele => {
                              return <span key={ele} className='bg-blue-100 text-blue-800 font-semibold px-8 py-1 rounded-2xl'>{ele}</span>
                            })
                          }
                        </div>
                        
                        <hr className='my-4 text-gray-400' />

                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex  gap-4'>
                            <p className='border border-gray-400 shadow-lg px-4 py-1 rounded-md flex items-center justify-center gap-2'>
                              <FaUserFriends className='border-2 text-4xl p-1 rounded-md text-blue-700' />
                              <div>
                                <p>Applicants</p>
                              <p>{allJobs.applicants?.length || 0}</p>
                              </div>
                            </p>
                            <p className='border border-gray-400 shadow-lg px-4 py-1 rounded-md flex items-center justify-center gap-2'>
                              <FaUserCheck className='border-2 text-4xl p-1 rounded-md text-green-700' />
                              <div>
                                <p>Selected</p>
                                <p>0</p>
                              </div>
                            </p>
                          </div>

                          <div className='flex gap-4'>
                            <button className='px-6 py-2 bg-blue-300 rounded-md cursor-pointer flex items-center justify-center gap-2'>Edit <MdEdit /></button>
                            <button className='px-6 py-2 bg-blue-700 text-white font-semibold rounded-md cursor-pointer flex items-center justify-center gap-2 hover:font-bold' onClick={() => navigate(`/hr/specific-job/${allJobs._id}`)}>View Details<FaChevronRight /></button>
                          </div>
                        </div>
                        <p className='text-xs font-normal text-gray-600'>JOB ID: {allJobs._id}</p>
                      </div>
                    })
                  }
                </div>

                {/* <CompanyDetails allPostedJobs={allPostedJobs} liveJobs={liveJobs} /> */}

                <div className='w-1/3 border border-amber-500 flex flex-col items-center pt-4 gap-2'>
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
                </div>
              </div> :
              <p>You've not post any job yet.</p>
          }
        </div>
      </div>
    )
}

export default AllPostedJobs