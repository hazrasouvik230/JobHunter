import React from 'react'
import { FaUsers } from "react-icons/fa";
import { PiBuildingsFill } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const info = [
        { label: "Enrolled users", icon: FaUsers, counts: 123 },
        { label: "Enrolled companies", icon: PiBuildingsFill, counts: 12345 },
        { label: "Revenue generated", icon: FaSackDollar, counts: 123456 },
    ];

    return (
        <div className='px-6 md:px-32 py-12 pb-20 bg-gray-50'>
            <div className='text-center mb-8 mt-16'>
                <div className="absolute">
                    <Link to="/user/all-jobs" className="text-start hover:text-blue-800 cursor-pointer ease-in-out text-gray-600 hover:font-semibold">Back</Link>
                </div>

                <p className='text-4xl font-bold text-gray-900 text-shadow-lg mb-4'>Admin Dashboard</p>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Track your job applications</p>
                </div>

            <div className='flex items-center justify-between my-8'>
                {
                    info.map((ele) => {
                        return <div key={ele.label} className='bg-amber-200/50 flex items-center w-2/7 px-8 py-4 gap-4 rounded-md shadow-2xl'>
                            <ele.icon className='text-5xl p-1 border rounded' />
                            <div>
                                <p className='text-3xl font-bold'>{ele.counts}</p>
                                <p className='text-sm font'>{ele.label}</p>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default AdminDashboard