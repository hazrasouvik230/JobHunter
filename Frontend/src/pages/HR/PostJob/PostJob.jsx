import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable';
import { BsStars } from "react-icons/bs";

const PostJob = () => {
    const [title, setTitle] = useState("");
    
    const [role, setRole] = useState([
        { value: 'frontend', label: 'Frontend Developer' },
        { value: 'backend', label: 'Backend Developer' },
        { value: 'designer', label: 'UI/UX Designer' }
    ]);
    const [selectRole, setSelectRole] = useState([]);

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
    const [deadline, setDeadline] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(`Title: ${title}, location: ${selectLocation}`);
    };


    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-medium text-shadow-md pb-8'>Post a Job</p>
            <p className='mb-4'>Find the best talent for your company.</p>
            
            <div className='flex justify-between gap-2'>
                <form className='bg-white border border-red-400 w-4/5' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Job Title</label><br />
                        <input type="text" name="title" id="title" className='border border-gray-300 w-full rounded px-2 py-1' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="location">Location</label>
                        <CreatableSelect isMulti options={location} value={selectLocation} onChange={(newValue) => setSelectLocation(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
                            setLocation((prev) => [...prev, newOption]);
                            setSelectLocation((prev) => [...prev, newOption]);
                        }} />
                    </div>

                    <div>
                        <label htmlFor="role">Job role</label><br />
                        <CreatableSelect isMulti options={role} value={selectRole} onChange={(newValue) => setSelectRole(newValue)} onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
                            setRole((prev) => [...prev, newOption]);
                            setSelectRole((prev) => [...prev, newOption])
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
                            <input type="text" name="salary" id="salary" className='border border-gray-300 w-full rounded px-2 py-1' value={salary} onChange={(e) => setSalary(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <label htmlFor="deadline">Deadline</label><br />
                            <input type="date" name="deadline" id="deadline" className='border border-gray-300 w-full rounded px-2 py-1' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        </div>
                    </div>

                    <div className='relative w-full'>
                        <label htmlFor="deadline">Deadline</label><br />
                        <textarea type="date" name="deadline" id="deadline" className='border border-gray-300 w-full h-36 rounded px-2 py-1' value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        <button type="button" className='absolute px-6 py-3 rounded bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white bottom-4 right-3 flex items-center justify-center gap-2 font-medium text-md opacity-90 cursor-pointer hover:shadow-xl hover:scale-105 duration-200 ease-in-out'>
                            <BsStars className="w-5 h-5" />
                            Generate through AI
                        </button>
                    </div>

                    <div className='flex justify-center mt-4 mb-8'>
                        <input type="submit" value="Post Job" className='bg-sky-400/50 px-8 py-2 rounded text-white font-semibold text-xl hover:scale-105 hover:shadow-lg hover:font-bold duration-300 ease-in-out cursor-pointer' />
                    </div>
                </form>

                <div className='w-1/5 border border-amber-500 flex flex-col items-center pt-4 gap-2'>
                    <img src={JSON.parse(localStorage.getItem("user")).companyLogo} alt={JSON.parse(localStorage.getItem("user")).companyLogo} className='h-32 w-32 rounded-full border' />
                    <p className='text-2xl font-semibold'>{JSON.parse(localStorage.getItem("user")).companyName}</p>
                    <p>Total jobs posted: 0</p>
                    <p>Live posted jobs: 0</p>
                </div>
            </div>
        </div>
    )
}

export default PostJob