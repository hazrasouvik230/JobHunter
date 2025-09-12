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














// import { useEffect, useState } from "react";
// import AddEducation from "./AddEducation";
// import AddExperience from "./AddExperience";
// import AddProject from "./AddPorject";
// import AddCertificate from "./AddCertificate";

// import { MdDelete } from "react-icons/md";
// import { FaExternalLinkAlt } from "react-icons/fa";
// import { FaPen } from "react-icons/fa";

// import axios from "axios";

// const skills = ["HTML", "CSS", "JS", "React", "Mongoose"];

// export default function Profile() {
//     const [profile, setProfile] = useState(() => {
//         const user = JSON.parse(localStorage.getItem("user"));
//         return {
//             name: user?.name || "",
//             email: user?.email || "",
//             mobile: "",
//             address: "",
//             title: "",
//             description: "",
//             technicalSkills: [],
//             softSkills: [],
//             languages: [],
//             interests: [],
//             educations: [],
//             experiences: [],
//             projects: [],
//             certificates: []
//         };
//     });
//     // const [loading, setLoading] = useState(true);

//     const [educationModal, setEducationModal] = useState(false);
//     const [experienceModal, setExperienceModal] = useState(false);
//     const [projectModal, setProjectModal] = useState(false);
//     const [certificateModal, setCertificateModal] = useState(false);
//     const [edit, setEdit] = useState(false);

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const fetchProfile = async () => {
//         try {
//             // setLoading(true);
//             const token = localStorage.getItem("token");
//             const response = await axios.get("http://localhost:3000/api/myProfile", { headers: { Authorization: token } });
//             console.log(response.data.resume);
//             setProfile(response.data.resume);
//         } catch (error) {
//             console.log(error);
//         }
//     };

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

//     const handleEducation = async (educationData) => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.post("http://localhost:3000/api/resume/education", educationData, { headers: { Authorization: token } });
//             console.log(response.data);
//             await fetchProfile();
//             setEducationModal(!educationModal);
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const handleExperience = async (experienceData) => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.post("http://localhost:3000/api/resume/experience", experienceData, { headers: { Authorization: token } });
//             console.log(response.data);
//             await fetchProfile();
//             setExperienceModal(!experienceModal);
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const handleProject = async (projectData) => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.post("http://localhost:3000/api/resume/project", projectData, { headers: { Authorization: token } });
//             console.log(response.data);
//             await fetchProfile();
//             setProjectModal(!projectModal);
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const handleCertificate = async (certificateData) => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.post("http://localhost:3000/api/resume/certificate", certificateData, { headers: { Authorization: token } });
//             console.log(response.data);
//             await fetchProfile();
//             setCertificateModal(!certificateModal);
//         } catch (error) {
//             console.log(error);
//         }
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
//                     {
//                         edit ? <input type="text" name="title" id="title" className="border w-[89%] rounded-md p-2" placeholder="9632" /> : <>Software developer</>
//                     }

//                     {
//                         edit ? <textarea type="text" name="describe" id="describe" className="border w-[89%] rounded-md p-2" placeholder="9632" /> : <p className="text-center">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque quibusdam veritatis impedit repudiandae alias dicta cum iste dolor incidunt recusandae aliquid, in enim vel ipsa eligendi commodi mollitia animi? Veritatis.</p>
//                     }
                    
//                     <div className="mb-4">
//                         {/* <p className="mb-1 flex items-center gap-4">Technical Skills <IoMdAdd className="cursor-pointer hover:bg-amber-300 " /></p> */}
//                         <p className="mb-1">Technical Skills</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map((skill, index) => {
//                                     return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>

//                     <div className="mb-4">
//                         <p className="mb-1">Soft Skills</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map((skill, index) => {
//                                     return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>    

//                     <div className="mb-4">
//                         <p className="mb-1">Languages</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map((skill, index) => {
//                                     return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>    

//                     <div className="mb-4">
//                         <p className="mb-1">Interests</p>
//                         <div className="flex flex-wrap gap-2">
//                             {
//                                 skills.map((skill, index) => {
//                                     return <span key={index} className="bg-amber-200 px-6 py-1 rounded-2xl text-xs">{skill}</span>
//                                 })
//                             }
//                         </div>
//                     </div>    

//                 </div>

//                 {/* Right Side */}
//                 <div className="border w-2/3 p-4">
//                     {/* Basic info */}
//                     <div className="border mb-4 p-4 rounded-lg">
//                         <p className="mb-1">Name: {profile.name}</p>
//                         <p className="mb-1">Email: {profile.email}</p>
//                         <p className="flex items-center justify-between mb-1">Mobile no.: {
//                             edit ? <input type="text" name="mobile" id="mobile" className="border w-[89%] rounded-md p-2" placeholder="9632" /> : <>{profile.mobile}</>
//                         }</p>

//                         <p className="flex items-center justify-between mb-1">Address: {
//                             edit ? <input type="text" name="address" id="address" className="border w-[89%] rounded-md p-2" placeholder="9632" /> : <>{profile.address}</>
//                         }</p>

//                         <p className="flex items-center justify-between">LinkedIn: {
//                             edit ? <input type="text" name="linkedin" id="linkedin" className="border w-[89%] rounded-md p-2" placeholder="9632" /> : <>{profile.linkedin}</>
//                         }</p>
//                     </div>

//                     {/* Education */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold mb-2">Educations</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleEducationModalOpen}>Add</button>
//                         }

//                         {
//                             profile?.educations?.length > 0 ? (
//                                 profile.educations.map((education, index) => {
//                                     return (
//                                         <div key={index} className="mb-2 border p-1 rounded-md relative">
//                                             <p className="font-semibold">{education.boardName}</p>
//                                             <p>{education.instituteName} - {education.streamName}</p>
//                                             <p>Marks: {education.marks}%</p>
//                                             <p>Passout: {new Date(education.passout).getFullYear()}</p>

//                                             {
//                                                 edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
//                                                     <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
//                                                     <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
//                                                 </div>
//                                             }
//                                         </div>
//                                     )
//                                 })
//                             ) : <p className="text-xs text-gray-500">No education details</p>
//                         }

//                         {
//                             educationModal && <AddEducation handleEducationModalOpen={handleEducationModalOpen} onSubmit={handleEducation} />
//                         }
//                     </div>

//                     {/* Experience */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold">Experiences</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleExperienceModalOpen}>Add</button>
//                         }

//                         {
//                             profile?.experiences?.length > 0 ? (
//                                 profile.experiences.map((experience, index) => {
//                                     return (
//                                         <div key={index} className="mb-2 border p-1 rounded-md relative">
//                                             <p className="font-semibold">{experience.companyName}</p>
//                                             <p>{experience.companyLogo}</p>
//                                             <p>{experience.designationName}</p>
//                                             <p>{new Date(experience.startDate).getMonth()}/{new Date(experience.startDate).getFullYear()} - {new Date(experience.endDate).getMonth()}/{new Date(experience.endDate).getFullYear()}</p>

//                                             {
//                                                 edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
//                                                     <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
//                                                     <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
//                                                 </div>
//                                             }
//                                         </div>
//                                     )
//                                 })
//                             ) : <p className="text-xs text-gray-500">No experience details</p>
//                         }

//                         {
//                             experienceModal && <AddExperience handleExperienceModalOpen={handleExperienceModalOpen} onSubmit={handleExperience} />
//                         }
//                     </div>

//                     {/* Projects */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold">Projects</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleProjectModalOpen}>Add</button>
//                         }

//                         {
//                             profile?.projects?.length > 0 ? (
//                                 profile.projects.map((project, index) => {
//                                     return (
//                                         <div key={index} className="mb-2 border p-1 rounded-md relative">
//                                             <p className="font-semibold">{project.projectTitle}</p>
//                                             <p>{project.remarks}</p>
//                                             <p>{new Date(project.startDate).getMonth()}/{new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getMonth()}/{new Date(project.endDate).getFullYear()}</p>

//                                             {
//                                                 edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
//                                                     <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
//                                                     <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
//                                                 </div>
//                                             }
//                                         </div>
//                                     )
//                                 })
//                             ) : <p className="text-xs text-gray-500">No education details</p>
//                         }

//                         {
//                             projectModal && <AddProject handleProjectModalOpen={handleProjectModalOpen} onSubmit={handleProject} />
//                         }
//                     </div>

//                     {/* Certificate */}
//                     <div className="border mb-4 p-4 rounded-lg relative">
//                         <p className="text-xl font-semibold">Certificates</p>
//                         {
//                             edit && <button className="absolute top-3.5 right-4 px-6 py-1 cursor-pointer rounded-md bg-amber-200" onClick={handleCertificateModalOpen}>Add</button>
//                         }

//                         {
//                             profile?.certificates?.length > 0 ? (
//                                 profile.certificates.map((certificate, index) => {
//                                     return (
//                                         <div key={index} className="mb-2 border p-1 rounded-md relative">
//                                             <p className="font-semibold">{certificate.certificateName}</p>
//                                             <p className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">{certificate.refURL} <FaExternalLinkAlt className="text-xs" /></p>
//                                             <p>{certificate.remarks}</p>
//                                             <p>{new Date(certificate.startDate).getMonth()}/{new Date(certificate.startDate).getFullYear()} - {new Date(certificate.endDate).getMonth()}/{new Date(certificate.endDate).getFullYear()}</p>

//                                             {
//                                                 edit && <div className="absolute right-1 top-1 flex gap-2 items-center">
//                                                     <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
//                                                     <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" />
//                                                 </div>
//                                             }
//                                         </div>
//                                     )
//                                 })
//                             ) : <p className="text-xs text-gray-500">No education details</p>
//                         }

//                         {
//                             certificateModal && <AddCertificate handleCertificateModalOpen={handleCertificateModalOpen} onSubmit={handleCertificate} />
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }






















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






























import { useEffect, useState } from "react";
import AddEducation from "./AddEducation";
import AddExperience from "./AddExperience";
import AddProject from "./AddPorject";
import AddCertificate from "./AddCertificate";

import { MdDelete, MdClose } from "react-icons/md";
import { FaExternalLinkAlt, FaPen } from "react-icons/fa";
import axios from "axios";

export default function Profile() {
    const [profile, setProfile] = useState(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        return {
            name: user?.name || "",
            email: user?.email || "",
            mobile: "",
            address: "",
            linkedin: "",
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
    
    const [editProfile, setEditProfile] = useState({...profile});
    const [educationModal, setEducationModal] = useState(false);
    const [experienceModal, setExperienceModal] = useState(false);
    const [projectModal, setProjectModal] = useState(false);
    const [certificateModal, setCertificateModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newSkillInputs, setNewSkillInputs] = useState({
        technicalSkills: "",
        softSkills: "",
        languages: "",
        interests: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (edit) {
            setEditProfile({...profile});
        }
    }, [edit, profile]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/myProfile", { 
                headers: { Authorization: token } 
            });
            setProfile(response.data.resume);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (edit) {
            // Update profile
            updateProfile();
        }
        setEdit(!edit);
    };

    const updateProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:3000/api/resume", 
                editProfile, 
                { headers: { Authorization: token } }
            );
            setProfile(response.data.resume);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewSkillInput = (e, field) => {
        const { value } = e.target;
        setNewSkillInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addNewSkill = (field) => {
        if (newSkillInputs[field].trim() === "") return;
        
        setEditProfile(prev => ({
            ...prev,
            [field]: [...prev[field], newSkillInputs[field].trim()]
        }));
        
        setNewSkillInputs(prev => ({
            ...prev,
            [field]: ""
        }));
    };

    const removeSkill = (field, index) => {
        setEditProfile(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
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
            await axios.post(
                "http://localhost:3000/api/resume/education", 
                educationData, 
                { headers: { Authorization: token } }
            );
            await fetchProfile();
            setEducationModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleExperience = async (experienceData) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:3000/api/resume/experience", 
                experienceData, 
                { headers: { Authorization: token } }
            );
            await fetchProfile();
            setExperienceModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleProject = async (projectData) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:3000/api/resume/project", 
                projectData, 
                { headers: { Authorization: token } }
            );
            await fetchProfile();
            setProjectModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCertificate = async (certificateData) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:3000/api/resume/certificate", 
                certificateData, 
                { headers: { Authorization: token } }
            );
            await fetchProfile();
            setCertificateModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteEducation = async (id) => {
        try {
            const confirm = window.confirm(`Are you sure to delete the education details with id ${id}`);
            if(confirm) {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `http://localhost:3000/api/resume/education/${id}`, 
                    { headers: { Authorization: token } }
                );
                await fetchProfile();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteExperience = async (id) => {
        try {
            const confirm = window.confirm(`Are you sure to delete the education details with id ${id}`);
            if(confirm) {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `http://localhost:3000/api/resume/experience/${id}`, 
                    { headers: { Authorization: token } }
                );
            }
            await fetchProfile();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProject = async (id) => {
        try {
            const confirm = window.confirm(`Are you sure to delete the education details with id ${id}`);
            if(confirm) {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `http://localhost:3000/api/resume/project/${id}`, 
                    { headers: { Authorization: token } }
                );
            }
            await fetchProfile();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCertificate = async (id) => {
        try {
            const confirm = window.confirm(`Are you sure to delete the education details with id ${id}`);
            if(confirm) {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `http://localhost:3000/api/resume/certificate/${id}`, 
                    { headers: { Authorization: token } }
                );
            }
            await fetchProfile();
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewSkill(field);
        }
    };

    if (loading) {
        return <div className="px-32 py-16 flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className='px-4 md:px-16 lg:px-32 py-8 md:py-16'>
            <div className="flex flex-col md:flex-row justify-between">
                <p className='text-2xl md:text-3xl font-semibold pb-4 md:pb-8'>Profile</p>
                <div className="mt-1 space-x-2 md:space-x-4">
                    <button className="bg-sky-400/50 px-4 md:px-6 py-2 rounded-md font-medium cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ease-in-out text-sm md:text-base">Download Resume</button>
                    <button className="bg-sky-400/50 px-4 md:px-6 py-2 rounded-md font-medium cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ease-in-out text-sm md:text-base" onClick={handleEdit}>{edit ? "Update Profile" : "Edit Profile"}</button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-4">
                {/* Left Side */}
                <div className="border w-full lg:w-1/3 flex items-center flex-col px-4 py-8 rounded-lg">
                    <img src="/Illustration.png" alt="" className="w-32 h-32 border rounded-full" />
                    
                    <div className="w-full mb-4 text-center">
                        {edit ? (
                            <input 
                                type="text" 
                                name="title" 
                                value={editProfile.title} 
                                onChange={handleInputChange}
                                className="border w-full rounded-md p-2 text-center" 
                                placeholder="Job Title" 
                            />
                        ) : (
                            <p className="font-semibold text-lg">{profile.title || "Software Developer"}</p>
                        )}
                    </div>

                    <div className="w-full mb-4">
                        {edit ? (
                            <textarea 
                                name="description" 
                                value={editProfile.description} 
                                onChange={handleInputChange}
                                className="border w-full rounded-md p-2" 
                                placeholder="Describe yourself" 
                                rows="4"
                            />
                        ) : (
                            <p className="text-center text-sm">
                                {profile.description || "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque quibusdam veritatis impedit repudiandae alias dicta cum iste dolor incidunt recusandae aliquid, in enim vel ipsa eligendi commodi mollitia animi? Veritatis."}
                            </p>
                        )}
                    </div>
                    
                    {/* Technical Skills */}
                    <div className="w-full mb-4">
                        <p className="mb-1 font-semibold">Technical Skills</p>
                        {edit ? (
                            <div className="mb-2">
                                <div className="flex items-center">
                                    <input 
                                        type="text" 
                                        value={newSkillInputs.technicalSkills} 
                                        onChange={(e) => handleNewSkillInput(e, 'technicalSkills')}
                                        onKeyPress={(e) => handleKeyPress(e, 'technicalSkills')}
                                        className="border w-full rounded-md p-2" 
                                        placeholder="Add a skill and press Enter or click Add" 
                                    />
                                    <button 
                                        onClick={() => addNewSkill('technicalSkills')}
                                        className="ml-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editProfile.technicalSkills.map((skill, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs flex items-center">
                                            {skill}
                                            <MdClose 
                                                className="ml-1 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeSkill('technicalSkills', index)} 
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profile.technicalSkills.length > 0 ? (
                                    profile.technicalSkills.map((skill, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs">{skill}</span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500">No technical skills added</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Soft Skills */}
                    <div className="w-full mb-4">
                        <p className="mb-1 font-semibold">Soft Skills</p>
                        {edit ? (
                            <div className="mb-2">
                                <div className="flex items-center">
                                    <input 
                                        type="text" 
                                        value={newSkillInputs.softSkills} 
                                        onChange={(e) => handleNewSkillInput(e, 'softSkills')}
                                        onKeyPress={(e) => handleKeyPress(e, 'softSkills')}
                                        className="border w-full rounded-md p-2" 
                                        placeholder="Add a skill and press Enter or click Add" 
                                    />
                                    <button 
                                        onClick={() => addNewSkill('softSkills')}
                                        className="ml-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editProfile.softSkills.map((skill, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs flex items-center">
                                            {skill}
                                            <MdClose 
                                                className="ml-1 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeSkill('softSkills', index)} 
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profile.softSkills.length > 0 ? (
                                    profile.softSkills.map((skill, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs">{skill}</span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500">No soft skills added</span>
                                )}
                            </div>
                        )}
                    </div>    

                    {/* Languages */}
                    <div className="w-full mb-4">
                        <p className="mb-1 font-semibold">Languages</p>
                        {edit ? (
                            <div className="mb-2">
                                <div className="flex items-center">
                                    <input 
                                        type="text" 
                                        value={newSkillInputs.languages} 
                                        onChange={(e) => handleNewSkillInput(e, 'languages')}
                                        onKeyPress={(e) => handleKeyPress(e, 'languages')}
                                        className="border w-full rounded-md p-2" 
                                        placeholder="Add a language and press Enter or click Add" 
                                    />
                                    <button 
                                        onClick={() => addNewSkill('languages')}
                                        className="ml-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editProfile.languages.map((language, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs flex items-center">
                                            {language}
                                            <MdClose 
                                                className="ml-1 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeSkill('languages', index)} 
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profile.languages.length > 0 ? (
                                    profile.languages.map((language, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs">{language}</span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500">No languages added</span>
                                )}
                            </div>
                        )}
                    </div>    

                    {/* Interests */}
                    <div className="w-full mb-4">
                        <p className="mb-1 font-semibold">Interests</p>
                        {edit ? (
                            <div className="mb-2">
                                <div className="flex items-center">
                                    <input 
                                        type="text" 
                                        value={newSkillInputs.interests} 
                                        onChange={(e) => handleNewSkillInput(e, 'interests')}
                                        onKeyPress={(e) => handleKeyPress(e, 'interests')}
                                        className="border w-full rounded-md p-2" 
                                        placeholder="Add an interest and press Enter or click Add" 
                                    />
                                    <button 
                                        onClick={() => addNewSkill('interests')}
                                        className="ml-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editProfile.interests.map((interest, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs flex items-center">
                                            {interest}
                                            <MdClose 
                                                className="ml-1 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeSkill('interests', index)} 
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profile.interests.length > 0 ? (
                                    profile.interests.map((interest, index) => (
                                        <span key={index} className="bg-amber-200 px-3 py-1 rounded-2xl text-xs">{interest}</span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500">No interests added</span>
                                )}
                            </div>
                        )}
                    </div>    
                </div>

                {/* Right Side */}
                <div className="border w-full lg:w-2/3 p-4 rounded-lg">
                    {/* Basic info */}
                    <div className="border mb-4 p-4 rounded-lg">
                        <p className="mb-2 flex items-center justify-between">Name: {profile.name}</p>
                        <p className="mb-2 flex items-center justify-between">Email: {profile.email}</p>
                        <p className="mb-2 flex items-center justify-between">Mobile: { edit ? <input type="text" name="mobile" value={editProfile.mobile} onChange={handleInputChange}className="border w-3/4 rounded-md p-2" placeholder="Mobile number" /> : <span>{profile.mobile || "Not provided"}</span> }</p>
                        <p className="mb-2 flex items-center justify-between">Address: { edit ? <input type="text" name="address" value={editProfile.address} onChange={handleInputChange}className="border w-3/4 rounded-md p-2" placeholder="Address" /> : <span>{profile.address || "Not provided"}</span> }</p>
                        <p className="flex items-center justify-between">LinkedIn: { edit ? <input type="text" name="linkedin" value={editProfile.linkedin} onChange={handleInputChange}className="border w-3/4 rounded-md p-2" placeholder="LinkedIn URL" /> : <span>{profile.linkedin || "Not provided"}</span> }</p>
                    </div>

                    {/* Education Section */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold mb-2">Education</p>
                        {
                            edit && <button className="absolute top-4 right-4 px-4 py-1 cursor-pointer rounded-md bg-amber-200 text-sm" onClick={handleEducationModalOpen}>Add</button>
                        }

                        {
                            profile?.educations?.length > 0 ? (
                                profile.educations.map((education, index) => (
                                    <div key={index} className="mb-3 border p-3 rounded-md relative">
                                        <p className="font-semibold">{education.boardName}</p>
                                        <p>{education.instituteName} - {education.streamName}</p>
                                        <p>Marks: {education.marks}%</p>
                                        <p>Passout: {new Date(education.passout).getFullYear()}</p>

                                        {
                                            edit && <div className="absolute right-3 top-3 flex gap-2 items-center">
                                                <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" onClick={() => deleteEducation(education._id)} />
                                            </div>
                                        }
                                    </div>
                                ))
                            ) : <p className="text-xs text-gray-500">No education details added</p>
                        }

                        {
                            educationModal && <AddEducation handleEducationModalOpen={handleEducationModalOpen} onSubmit={handleEducation} />
                        }
                    </div>

                    {/* Experience Section */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold mb-2">Experience</p>
                        {
                            edit && <button className="absolute top-4 right-4 px-4 py-1 cursor-pointer rounded-md bg-amber-200 text-sm" onClick={handleExperienceModalOpen}>Add</button>
                        }

                        {
                            profile?.experiences?.length > 0 ? (
                                profile.experiences.map((experience, index) => (
                                    <div key={index} className="mb-3 border p-3 rounded-md relative">
                                        <p className="font-semibold">{experience.companyName}</p>
                                        <p>{experience.designationName}</p>
                                        <p>
                                            {new Date(experience.startDate).toLocaleDateString()} -{" "}
                                            {new Date(experience.endDate).toLocaleDateString()}
                                        </p>

                                        {
                                            edit && <div className="absolute right-3 top-3 flex gap-2 items-center">
                                                <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" onClick={() => deleteExperience(experience._id)} />
                                            </div>
                                        }
                                    </div>
                                ))
                            ) : <p className="text-xs text-gray-500">No experience details added</p>
                        }

                        {
                            experienceModal && <AddExperience handleExperienceModalOpen={handleExperienceModalOpen} onSubmit={handleExperience} />
                        }
                    </div>

                    {/* Projects Section */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold mb-2">Projects</p>
                        {
                            edit && <button className="absolute top-4 right-4 px-4 py-1 cursor-pointer rounded-md bg-amber-200 text-sm" onClick={handleProjectModalOpen}>Add</button>
                        }

                        {
                            profile?.projects?.length > 0 ? (
                                profile.projects.map((project, index) => (
                                    <div key={index} className="mb-3 border p-3 rounded-md relative">
                                        <p className="font-semibold">{project.projectTitle}</p>
                                        <p>{project.remarks}</p>
                                        <p>
                                            {new Date(project.startDate).toLocaleDateString()} -{" "}
                                            {new Date(project.endDate).toLocaleDateString()}
                                        </p>

                                        {
                                            edit && <div className="absolute right-3 top-3 flex gap-2 items-center">
                                                <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" onClick={() => deleteProject(project._id)} />
                                            </div>
                                        }
                                    </div>
                                ))
                            ) : <p className="text-xs text-gray-500">No project details added</p>
                        }

                        {
                            projectModal && <AddProject handleProjectModalOpen={handleProjectModalOpen} onSubmit={handleProject} />
                        }
                    </div>

                    {/* Certificate */}
                    <div className="border mb-4 p-4 rounded-lg relative">
                        <p className="text-xl font-semibold mb-2">Certificates</p>
                        {
                            edit && <button className="absolute top-4 right-4 px-4 py-1 cursor-pointer rounded-md bg-amber-200 text-sm" onClick={handleCertificateModalOpen}>Add</button>
                        }

                        {
                            profile?.certificates?.length > 0 ? (
                                profile.certificates.map((certificate, index) => (
                                    <div key={index} className="mb-3 border p-3 rounded-md relative">
                                        <p className="font-semibold">{certificate.certificateName}</p>
                                        {
                                            certificate.refURL && <a href={certificate.refURL} target="_blank" rel="noopener noreferrer"className="flex items-center gap-1 text-blue-600 hover:underline">{certificate.refURL} <FaExternalLinkAlt className="text-xs" /></a>
                                        }
                                        <p>{certificate.remarks}</p>
                                        <p>{new Date(certificate.startDate).toLocaleDateString()} -{" "}{new Date(certificate.endDate).toLocaleDateString()}</p>

                                        {
                                            edit && <div className="absolute right-3 top-3 flex gap-2 items-center">
                                                <FaPen className="text-sm cursor-pointer hover:text-yellow-400 hover:scale-110" />
                                                <MdDelete className="cursor-pointer hover:text-red-500 hover:scale-110" onClick={() => deleteCertificate(certificate._id)} />
                                            </div>
                                        }
                                    </div>
                                ))
                            ) : <p className="text-xs text-gray-500">No certificate details added</p>
                        }

                        {
                            certificateModal && <AddCertificate handleCertificateModalOpen={handleCertificateModalOpen} onSubmit={handleCertificate} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}