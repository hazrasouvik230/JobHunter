import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import Info from './Info';

const Hero = () => {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(title.trim(), location.trim());
        setTitle("");
        setLocation("");
    }

    return (
        <div className='bg-gray-200/50'>
            <div className='flex flex-col-reverse items-center p-4 gap-8 sm:flex-row sm:justify-around sm:p-12 lg:p-16'>
        
            {/* Text and Form Section */}
            <div className='flex flex-col items-center text-center sm:items-start sm:text-start lg:mt-12 w-full sm:w-1/2'>
                <h1 className='text-2xl font-extrabold mb-2 sm:text-3xl sm:mb-6 lg:text-5xl'>
                Find a job that suits<br />
                <span className='lg:text-6xl text-sky-700'>your interest & skills.</span>
                </h1>
                
                <p className='text-sm font-light text-slate-600 mb-4 sm:mb-6 lg:text-lg'>
                Discover thousands of job opportunities tailored to your strengths and passions.
                </p>
                
                {/* Search Form */}
                <form className='bg-white w-full max-w-2xl border rounded-lg p-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm' onSubmit={handleSubmit}>

                    {/* Job Title Input */}
                    <div className='flex items-center gap-2 border-b sm:border-none pb-2 sm:pb-0'>
                        <FiSearch className='text-blue-600 text-xl' />
                        <input type="text" id="text" name="text" placeholder='Job title, keyword...' className='w-full bg-transparent focus:outline-none placeholder:text-gray-400' aria-label="Job title or keyword" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    {/* Location Input */}
                    <div className='flex items-center gap-2 border-b sm:border-none pb-2 sm:pb-0'>
                        <CiLocationOn className='text-blue-600 text-xl' />
                        <input type="text" id="location" name="location" placeholder='Location' className='w-full bg-transparent focus:outline-none placeholder:text-gray-400' aria-label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    {/* Submit Button */}
                    <input type="submit" value="Find job" className='bg-sky-600 text-white font-semibold py-2 px-6 rounded hover:scale-105 transition-transform duration-300 ease-in-out hover:font-bold w-full sm:text-xs sm:w-auto' />
                </form>

                {/* Suggestions */}
                {/* <p className='text-gray-400 text-xs'>
                    Suggestion: <span className='text-blue-600 cursor-pointer hover:underline'>Designer, Programming, Digital Marketing, Video, Animation.</span>
                </p> */}
            </div>

            {/* Hero Image */}
            <div className='w-full sm:w-2/5'>
                <img
                src="./Illustration.png"
                alt="Job search illustration"
                className='w-full h-auto object-contain'
                loading="lazy"
                />
            </div>
        </div>

        <Info />
    </div>
  );
};

export default Hero;
