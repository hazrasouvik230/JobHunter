import React from 'react'
import { FaFacebookF } from "react-icons/fa6";
import { SiInstagram } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <div style={{ background: "#F0F0F5"}} className='px-32 py-16'>
        <div className='flex flex-col items-center justify-center gap-8 mb-12 sm:flex-row sm:justify-around'>
            <div className='flex flex-col items-center justify-center sm:items-start'>
                <h1 className='font-bold text-2xl'>HireHub</h1>
                <p className='text-sm font-normal text-gray-500 '>Call now: +91 1236547890</p>
                <p className='text-sm font-normal text-gray-500 '>Address: Kolkata</p>
            </div>

            <div className='flex flex-col items-center justify-center sm:items-start'>
                <h2 className='font-bold text-xl'>Candidate</h2>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Browse Jobs</p>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Candidate Dashboard</p>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Saved Jobs</p>
            </div>

            <div className='flex flex-col items-center justify-center sm:items-start'>
                <h2 className='font-bold text-xl'>Company</h2>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Post a Job</p>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Employeers Dashboard</p>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Applications</p>
            </div>

            <div className='flex flex-col items-center justify-center sm:items-start'>
                <h2 className='font-bold text-xl'>Support</h2>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Help & Support</p>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>Feedback</p>
                <p className='text-sm font-thin text-gray-500 cursor-pointer hover:text-gray-900 hover:font-normal'>FAQs</p>
            </div>
        </div>

        <hr className='text-slate-400' />

        <div className='flex flex-col-reverse items-center justify-between gap-2 font-thin text-xs mt-4 -mb-8 sm:flex-row sm:px-12'>
            <p className='text-slate-700'><span className='font-extrabold'>&copy;</span>Job Portal. All rights Reserved to <span className='font-extrabold drop-shadow'>Souvik Hazra</span></p>

            <div className='flex gap-4'>
                <FaFacebookF className='text-2xl border p-1 rounded shadow-md cursor-pointer hover:bg-slate-200/50 hover:scale-[1.1] hover:font-normal ease-in-out' />
                <SiInstagram className='text-2xl border p-1 rounded shadow-md cursor-pointer hover:bg-slate-200/50 hover:scale-[1.1] hover:font-normal ease-in-out' />
                <FaLinkedinIn className='text-2xl border p-1 rounded shadow-md cursor-pointer hover:bg-slate-200/50 hover:scale-[1.1] hover:font-normal ease-in-out' />
            </div>
        </div>
    </div>
  )
}

export default Footer