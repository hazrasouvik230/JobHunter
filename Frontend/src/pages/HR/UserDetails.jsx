import axios from "axios";
import { useState } from "react";
import { useEffect } from "react"
import { Link } from "react-router-dom";

export default function UserDetails() {
    const [allJobs, setAllJobs] = useState([]);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);

    useEffect(() => {
        (async() => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/api/job/allPostedJobsByHR`, { headers: { Authorization: token } });
                // console.log(response.data.jobs);
                setAllJobs(response.data.jobs);

                // Fetch subscription info
                const subResponse = await axios.get(`http://localhost:3000/api/subscription/current`, {
                    headers: { Authorization: token }
                });
                // console.log(subResponse.data.subscription);
                setSubscriptionInfo(subResponse.data.subscription);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const liveJobs = allJobs.filter((job) => new Date(job.deadline) > Date.now());

    return (
        <div className='border-2 border-gray-400 flex flex-col items-center py-8 gap-2 rounded-xl bg-white shadow-xl'>
            <img src={`http://localhost:3000/uploads/company-logos/${JSON.parse(localStorage.getItem("user")).companyLogo}`} alt={JSON.parse(localStorage.getItem("user")).companyLogo} className='h-32 w-32 rounded-full border-4 border-gray-400' />
            <p className='text-2xl text-center font-semibold'>{JSON.parse(localStorage.getItem("user")).companyName}</p>
            
            <div className="text-center my-6 w-5/6 py-6 rounded-xl bg-blue-50 relative">
                <div className="absolute flex items-center justify-center -top-4.5 w-full">
                    <span className="font-semibold text-lg bg-gradient-to-tr from-cyan-600 to-purple-700 text-white px-8 py-1 rounded-4xl">{subscriptionInfo?.planName || 'Free'} Plan</span>
                </div>
                
                <p className="pt-2">Total jobs posted: {allJobs.length}</p>
                <p>Live posted jobs: {liveJobs.length}</p>
                <p className={`font-medium ${subscriptionInfo?.remainingPosts <= 0 ? 'text-red-600' : 'text-green-600'}`}>Remaining posts: {subscriptionInfo?.jobPostsLimit === 999999 ? "Unlimited" : `${subscriptionInfo?.remainingPosts || 0}/${subscriptionInfo?.jobPostsLimit || 3}`}</p>
                {
                    subscriptionInfo?.isExpired && (
                        <p className="text-red-600 text-sm mt-2">Subscription Expired!</p>
                    )
                }
            </div>
            
            <button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'><Link to="/hr/buy-subscription">{subscriptionInfo?.planName === 'Free' ? 'Upgrade Plan' : 'Manage Subscription'}</Link></button>
        </div>
    )
}