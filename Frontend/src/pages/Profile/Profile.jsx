// import React, { useState } from 'react'

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














import { useEffect, useState } from "react";
import AddEducation from "./AddEducation";
import AddExperience from "./AddExperience";
import AddProject from "./AddPorject";
import AddCertificate from "./AddCertificate";

import { MdDelete } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaPen } from "react-icons/fa";

import axios from "axios";

const skills = ["HTML", "CSS", "JS", "React", "Mongoose"];

export default function Profile() {
    const [profile, setProfile] = useState(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        return {
            name: user?.name || "",
            email: user?.email || "",
            mobile: "",
            address: "",
            title: "",
            description: "",
            technicalSkills: [],
            softSkills: [],
            languages: [],
            interests: [],
            educations: [],
            experiences: [],
            projects: [],
            certificates: []
        };
    });
    // const [loading, setLoading] = useState(true);

    const [educationModal, setEducationModal] = useState(false);
    const [experienceModal, setExperienceModal] = useState(false);
    const [projectModal, setProjectModal] = useState(false);
    const [certificateModal, setCertificateModal] = useState(false);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/myProfile", { headers: { Authorization: token } });
            console.log(response.data.resume);
            setProfile(response.data.resume);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = () => {
        setEdit(!edit);
    };

    const handleEducationModalOpen = () => {
        setEducationModal(!educationModal);
    };
    const handleExperienceModalOpen = () => {
        setExperienceModal(!experienceModal);
    };
    const handleProjectModalOpen = () => {
        setProjectModal(!projectModal);
    };
    const handleCertificateModalOpen = () => {
        setCertificateModal(!certificateModal);
    };

    const handleEducation = async (educationData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/resume/education", educationData, { headers: { Authorization: token } });
            console.log(response.data);
            await fetchProfile();
            setEducationModal(!educationModal);
        } catch (error) {
            console.log(error);
        }
    };
    const handleExperience = async (experienceData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/resume/experience", experienceData, { headers: { Authorization: token } });
            console.log(response.data);
            await fetchProfile();
            setExperienceModal(!experienceModal);
        } catch (error) {
            console.log(error);
        }
    };
    const handleProject = async (projectData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/resume/project", projectData, { headers: { Authorization: token } });
            console.log(response.data);
            await fetchProfile();
            setProjectModal(!projectModal);
        } catch (error) {
            console.log(error);
        }
    };
    const handleCertificate = async (certificateData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/resume/certificate", certificateData, { headers: { Authorization: token } });
            console.log(response.data);
            await fetchProfile();
            setCertificateModal(!certificateModal);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='px-32 py-16'>
            <div className="flex justify-between">
                <p className='text-3xl font-semibold text-shadow-lg pb-8'>Profile</p>
                <div className="mt-1 space-x-4">
                    <button className="bg-sky-400/50 px-6 py-2 rounded-md font-medium cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ease-in-out">Download Resume</button>
                    <button className="bg-sky-400/50 px-6 py-2 rounded-md font-medium cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ease-in-out" onClick={handleEdit}>{ edit ? "Update Profile" : "Edit Profile"}</button>
                </div>
            </div>

            <div className="flex justify-between gap-4">
                {/* Left Side */}
                <div className="border w-1/3 flex items-center flex-col px-4 py-8">
                    <img src="/Illustration.png" alt="" className="w-32 h-32 border rounded-full" />
                    <p>Software developer</p>
                    <p className="text-center">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque quibusdam veritatis impedit repudiandae alias dicta cum iste dolor incidunt recusandae aliquid, in enim vel ipsa eligendi commodi mollitia animi? Veritatis.</p>
                    
                    <div className="mb-4">
                        {/* <p className="mb-1 flex items-center gap-4">Technical Skills <IoMdAdd className="cursor-pointer hover:bg-amber-300 " /></p> */}
                        <p className="mb-1">Technical Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {
                                skills.map((skill, index) => {
                                    return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
                                })
                            }
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="mb-1">Soft Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {
                                skills.map((skill, index) => {
                                    return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
                                })
                            }
                        </div>
                    </div>    

                    <div className="mb-4">
                        <p className="mb-1">Languages</p>
                        <div className="flex flex-wrap gap-2">
                            {
                                skills.map((skill, index) => {
                                    return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
                                })
                            }
                        </div>
                    </div>    

                    <div className="mb-4">
                        <p className="mb-1">Interests</p>
                        <div className="flex flex-wrap gap-2">
                            {
                                skills.map((skill, index) => {
                                    return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
                                })
                            }
                        </div>
                    </div>    

                </div>

                {/* Right Side */}
                <div className="border w-2/3 p-4">
                    {/* Basic info */}
                    <div className="border mb-4 p-4 rounded-lg">
                        <p>Name: {profile.name}</p>
                        <p>Email: {profile.email}</p>
                        <p>Mobile no.:</p>
                        <p>Address:</p>
                        <p>Linkedin:</p>
                    </div>

                    {/* Education */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold mb-2">Educations</p>
                        {
                            edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleEducationModalOpen}>Add</button>
                        }

                        {
                            profile?.educations?.length > 0 ? (
                                profile.educations.map((education, index) => {
                                    return (
                                        <div key={index} className="mb-2 border p-1 rounded-md relative">
                                            <p className="font-semibold">{education.boardName}</p>
                                            <p>{education.instituteName} - {education.streamName}</p>
                                            <p>Marks: {education.marks}%</p>
                                            <p>Passout: {new Date(education.passout).getFullYear()}</p>

                                            {
                                                edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
                                                    <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                    <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            ) : <p className="text-xs text-gray-500">No education details</p>
                        }

                        {
                            educationModal && <AddEducation handleEducationModalOpen={handleEducationModalOpen} onSubmit={handleEducation} />
                        }
                    </div>

                    {/* Experience */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold">Experiences</p>
                        {
                            edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleExperienceModalOpen}>Add</button>
                        }

                        {
                            profile?.experiences?.length > 0 ? (
                                profile.experiences.map((experience, index) => {
                                    return (
                                        <div key={index} className="mb-2 border p-1 rounded-md relative">
                                            <p className="font-semibold">{experience.companyName}</p>
                                            <p>{experience.companyLogo}</p>
                                            <p>{experience.designationName}</p>
                                            <p>{new Date(experience.startDate).getMonth()}/{new Date(experience.startDate).getFullYear()} - {new Date(experience.endDate).getMonth()}/{new Date(experience.endDate).getFullYear()}</p>

                                            {
                                                edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
                                                    <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                    <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            ) : <p className="text-xs text-gray-500">No experience details</p>
                        }

                        {
                            experienceModal && <AddExperience handleExperienceModalOpen={handleExperienceModalOpen} onSubmit={handleExperience} />
                        }
                    </div>

                    {/* Projects */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold">Projects</p>
                        {
                            edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleProjectModalOpen}>Add</button>
                        }

                        {
                            profile?.projects?.length > 0 ? (
                                profile.projects.map((project, index) => {
                                    return (
                                        <div key={index} className="mb-2 border p-1 rounded-md relative">
                                            <p className="font-semibold">{project.projectTitle}</p>
                                            <p>{project.remarks}</p>
                                            <p>{new Date(project.startDate).getMonth()}/{new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getMonth()}/{new Date(project.endDate).getFullYear()}</p>

                                            {
                                                edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
                                                    <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                    <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            ) : <p className="text-xs text-gray-500">No education details</p>
                        }

                        {
                            projectModal && <AddProject handleProjectModalOpen={handleProjectModalOpen} onSubmit={handleProject} />
                        }
                    </div>

                    {/* Certificate */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold">Certificates</p>
                        {
                            edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleCertificateModalOpen}>Add</button>
                        }

                        {
                            profile?.certificates?.length > 0 ? (
                                profile.certificates.map((certificate, index) => {
                                    return (
                                        <div key={index} className="mb-2 border p-1 rounded-md relative">
                                            <p className="font-semibold">{certificate.certificateName}</p>
                                            <p className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">{certificate.refURL} <FaExternalLinkAlt className="text-xs" /></p>
                                            <p>{certificate.remarks}</p>
                                            <p>{new Date(certificate.startDate).getMonth()}/{new Date(certificate.startDate).getFullYear()} - {new Date(certificate.endDate).getMonth()}/{new Date(certificate.endDate).getFullYear()}</p>

                                            {
                                                edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
                                                    <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                    <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            ) : <p className="text-xs text-gray-500">No education details</p>
                        }

                        {
                            certificateModal && <AddCertificate handleCertificateModalOpen={handleCertificateModalOpen} onSubmit={handleCertificate} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}






















// import { useState } from "react";
// import AddEducation from "./AddEducation";
// import AddExperience from "./AddExperience";
// import AddProject from "./AddPorject";
// import AddCertificate from "./AddCertificate";

// import { IoMdAdd } from "react-icons/io";

// const skills = ["HTML", "CSS", "JS", "React", "Mongoose"];

// export default function Profile() {
//     const [educationModal, setEducationModal] = useState(false);
//     const [experienceModal, setExperienceModal] = useState(false);
//     const [projectModal, setProjectModal] = useState(false);
//     const [certificateModal, setCertificateModal] = useState(false);
//     const [edit, setEdit] = useState(false);

//     const handleEdit = () => {
//         setEdit(!edit);
//     };

//     const handleEducationModalOpen = () => {
//         setEducationModal(!educationModal);
//     };
//     const handleExperienceModalOpen = () => {
//         setExperienceModal(!experienceModal);
//     };
//     const handleProjectModalOpen = () => {
//         setProjectModal(!projectModal);
//     };
//     const handleCertificateModalOpen = () => {
//         setCertificateModal(!certificateModal);
//     };

//     return (
//         <div className='px-32 py-16'>
//             <div className="flex justify-between">
//                 <p className='text-3xl font-semibold text-shadow-lg pb-8'>Profile</p>
//                 <div className="mt-1 space-x-4">
//                     <button className="bg-sky-400/50 px-6 py-2 rounded-md font-medium cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ease-in-out">Download Resume</button>
//                     <button className="bg-sky-400/50 px-6 py-2 rounded-md font-medium cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ease-in-out" onClick={handleEdit}>{ edit ? "Update Profile" : "Edit Profile"}</button>
//                 </div>
//             </div>

//             <div className="flex justify-between gap-4">
//                 {/* Left Side */}
//                 <div className="border w-1/3 flex items-center flex-col px-4 py-8">
//                     <img src="/Illustration.png" alt="" className="w-32 h-32 border rounded-full" />
//                     <p>Software developer</p>
//                     <p className="text-center">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque quibusdam veritatis impedit repudiandae alias dicta cum iste dolor incidunt recusandae aliquid, in enim vel ipsa eligendi commodi mollitia animi? Veritatis.</p>
                    
//                     <div className="mb-4">
//                         {/* <p className="mb-1 flex items-center gap-4">Technical Skills <IoMdAdd className="cursor-pointer hover:bg-amber-300 " /></p> */}
//                         <p className="mb-1">Technical Skills</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map(skill => {
//                                     return <span className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>

//                     <div className="mb-4">
//                         <p className="mb-1">Soft Skills</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map(skill => {
//                                     return <span className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>    

//                     <div className="mb-4">
//                         <p className="mb-1">Languages</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map(skill => {
//                                     return <span className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>    

//                     <div className="mb-4">
//                         <p className="mb-1">Interests</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map(skill => {
//                                     return <span className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>    

//                 </div>

//                 {/* Right Side */}
//                 <div className="border w-2/3 p-4">
//                     {/* Basic info */}
//                     <div className="border mb-4 p-4 rounded-lg">
//                         <p>Name: {JSON.parse(localStorage.getItem("user")).name}</p>
//                         <p>Email: {JSON.parse(localStorage.getItem("user")).email}</p>
//                         <p>Mobile no.:</p>
//                         <p>Address:</p>
//                         <p>Linkedin:</p>
//                     </div>

//                     {/* Education */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold">Educations</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleEducationModalOpen}>Add</button>
//                         }
//                         <p className="text-xs text-gray-500">No education details</p>
//                         {
//                             educationModal && <AddEducation handleEducationModalOpen={handleEducationModalOpen} />
//                         }
//                     </div>

//                     {/* Experience */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold">Experiences</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleExperienceModalOpen}>Add</button>
//                         }
//                         <p className="text-xs text-gray-500">No experiences are there</p>
//                         {
//                             experienceModal && <AddExperience handleExperienceModalOpen={handleExperienceModalOpen} />
//                         }
//                     </div>

//                     {/* Projects */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold">Projects</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleProjectModalOpen}>Add</button>
//                         }
//                         <p className="text-xs text-gray-500">No projects are there</p>
//                         {
//                             projectModal && <AddProject handleProjectModalOpen={handleProjectModalOpen} />
//                         }
//                     </div>

//                     {/* Certificate */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold">Certificates</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleCertificateModalOpen}>Add</button>
//                         }
//                         <p className="text-xs text-gray-500">No certificates are there</p>
//                         {
//                             certificateModal && <AddCertificate handleCertificateModalOpen={handleCertificateModalOpen} />
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }