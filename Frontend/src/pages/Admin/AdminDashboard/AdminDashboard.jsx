import React from 'react'
import { FaUsers } from "react-icons/fa";
import { PiBuildingsFill } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";

const AdminDashboard = () => {
    const info = [
        { label: "Enrolled users", icon: FaUsers, counts: 123 },
        { label: "Enrolled companies", icon: PiBuildingsFill, counts: 12345 },
        { label: "Revenue generated", icon: FaSackDollar, counts: 123456 },
    ];

    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-medium text-shadow-md pb-8 mt-24'>Admin Dashboard</p>

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