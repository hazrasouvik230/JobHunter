// import React, { useState } from 'react'

import { useState } from "react";
import AddEducation from "./AddEducation";
import AddExperience from "./AddExperience";
import AddProject from "./AddPorject";

// const Profile = () => {
//     const [address, setAddress] = useState("");
//     const [mobile, setMobile] = useState("+91 ");

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(`Name: ${name}, email: ${email}, Address: ${address}, mobile: ${mobile}`);
//     }

//     return (
//         <div className='px-32 py-16'>
//             <p className='text-3xl font-semibold text-shadow-lg pb-8'>Profile</p>
//             <form onSubmit={handleSubmit}>
//                 <div className="w-full h-36 my-4 rounded-2xl bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 animate-gradient bg-[length:400%_400%]">
//                 </div>

//                 <style jsx>
//                 {`
//                     @keyframes gradient {
//                     0% {
//                         background-position: 0% 50%;
//                     }
//                     50% {
//                         background-position: 100% 50%;
//                     }
//                     100% {
//                         background-position: 0% 50%;
//                     }
//                     }

//                     .animate-gradient {
//                     animation: gradient 10s ease infinite;
//                     }
//                 `}
//                 </style>

//                 {/* Image Section */}
//                 <div className="mb-3">
//                     <input type="file" name="image" id="image" className='border border-gray-300 w-full p-1.5 px-3 rounded' placeholder='Please enter your name' />
//                 </div>

//                 {/* Name Section */}
//                 <div className="mb-3">
//                     <label htmlFor="name">Fullname</label><br />
//                     <input type="text" name="name" id="name" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
//                 </div>

//                 {/* Email Section */}
//                 <div className="mb-3">
//                     <label htmlFor="email">Email</label><br />
//                     <input type="email" name="email" id="email" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
//                 </div>

//                 {/* Mobile Section */}
//                 <div className="mb-3">
//                     <label htmlFor="mobile">Mobile</label>
//                     <input type="text" name="mobile" id="mobile" className='border border-gray-300 w-full p-1.5 px-3 rounded' value={mobile} onChange={(e) => setMobile(e.target.value)} />
//                 </div>

//                 {/* Address Section */}
//                 <div className="mb-3">
//                     <label htmlFor="address">Address</label><br />
//                     <input type="text" name="address" id="address" className='border border-gray-300 w-full p-1.5 px-3 rounded' placeholder='Please enter your full address' value={address} onChange={(e) => setAddress(e.target.value)} />
//                 </div>

//                 <div className='mt-4 flex items-center justify-center'>
//                     <input type="submit" value="Save" className='bg-cyan-600/50 text-white px-20 py-2 text-xl font-semibold rounded cursor-pointer hover:scale-110 duration-300 ease-in-out hover:shadow-lg' />
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default Profile







const skills = ["HTML", "CSS", "JS", "React", "Mongoose"];

export default function Profile() {
    const [educationModal, setEducationModal] = useState(false);
    const [experienceModal, setExperienceModal] = useState(false);
    const [projectModal, setProjectModal] = useState(false);

    const handleEducationModalOpen = () => {
        setEducationModal(!educationModal);
    };
    const handleExperienceModalOpen = () => {
        setExperienceModal(!experienceModal);
    };
    const handleProjectModalOpen = () => {
        setProjectModal(!projectModal);
    };
    return (
        <div className='px-32 py-16'>
            <p className='text-3xl font-semibold text-shadow-lg pb-8'>Profile</p>

            <div className="flex justify-between gap-4">
                {/* Left Side */}
                <div className="border w-1/3 flex items-center flex-col px-4 py-8">
                    <img src="/Illustration.png" alt="" className="w-32 h-32 border rounded-full" />
                    <p>Software developer</p>
                    <p className="text-center">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque quibusdam veritatis impedit repudiandae alias dicta cum iste dolor incidunt recusandae aliquid, in enim vel ipsa eligendi commodi mollitia animi? Veritatis.</p>
                    <div className="flex flex-wrap gap-2">
                        {
                            skills.map(skill => {
                                return <span className="bg-amber-200 px-6 py-2 rounded-2xl">{skill}</span>
                            })
                        }
                    </div>
                </div>

                {/* Right Side */}
                <div className="border w-2/3 p-4">
                    {/* Basic info */}
                    <div className="border mb-4 p-4 rounded-lg">
                        <p>Name:</p>
                        <p>Email:</p>
                        <p>Mobile no.:</p>
                        <p>Address:</p>
                        <p>Linkedin:</p>
                    </div>

                    {/* Education */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold">Educations</p>
                        <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleEducationModalOpen}>Add</button>
                        <p className="text-xs text-gray-500">No education details</p>
                        {
                            educationModal && <AddEducation handleEducationModalOpen={handleEducationModalOpen} />
                        }
                    </div>

                    {/* Experience */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold">Experiences</p>
                        <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleExperienceModalOpen}>Add</button>
                        <p className="text-xs text-gray-500">No experiences are there</p>
                        {
                            experienceModal && <AddExperience handleExperienceModalOpen={handleExperienceModalOpen} />
                        }
                    </div>

                    {/* Projects */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold">Projects</p>
                        <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleProjectModalOpen}>Add</button>
                        <p className="text-xs text-gray-500">No projects are there</p>
                        {
                            projectModal && <AddProject handleProjectModalOpen={handleProjectModalOpen} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}