import React from 'react';
import { IoBriefcaseOutline } from "react-icons/io5";
import { FaBuildingColumns, FaUsers } from "react-icons/fa6";
import { FaGraduationCap } from "react-icons/fa6";

const stats = [
    { icon: <IoBriefcaseOutline className='text-blue-500 text-3xl' />, number: "1,75,324", label: "Live Job" },
    { icon: <FaBuildingColumns className='text-blue-500 text-3xl' />, number: "97,354", label: "Companies" },
    { icon: <FaUsers className='text-blue-500 text-3xl' />, number: "38,47,154", label: "Candidates" },
    { icon: <FaGraduationCap className='text-blue-500 text-3xl' />, number: "7,532", label: "Job landed" },
];

const Info = () => {
    return (
        <div className='w-full -mt-4 pb-12'>
            <div className='flex flex-wrap justify-center gap-6 max-w-6xl mx-auto'>
                {stats.map((item, index) => (
                    <div key={index} className='flex items-center gap-4 bg-white border rounded-lg shadow-md px-6 py-4 w-64'>
                        <div className='bg-blue-100 p-3 rounded'>
                            {item.icon}
                        </div>
                        <div>
                            <p className='text-xl font-semibold'>{item.number}</p>
                            <p className='text-sm text-gray-500'>{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Info;