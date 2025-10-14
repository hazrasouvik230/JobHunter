import { useContext, useEffect, useState } from "react"
import axios from "./config/axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function Interview() {
    const { user } = useContext(AuthContext)
    const { id } = useParams();
    console.log(user)
    
    const [interviewDetails, setInterviewDetails] = useState(null);

    useEffect(() => {
        (async() => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/api/interview/specificInterview/${id}`, { headers: { Authorization: token } });
                console.log(response.data.interview);

                setInterviewDetails(response.data.interview);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <div className='px-6 md:px-32 py-14 bg-gray-50'>
            <div className='mt-16 flex items-center justify-center'>
                {
                    interviewDetails && (
                            <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-12 text-center">
                                <h1 class="text-3xl text-gray-800 font-bold mb-4">{interviewDetails.jobId.title}</h1>
                                <div class="text-2xl text-indigo-500 font-semibold mb-8">{interviewDetails.hrId.companyName}</div>

                                {
                                    user.role === "HR" && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div class="bg-gray-50 rounded-2xl p-6 my-8 border-2 border-gray-200">
                                                    <div class="text-2xl text-gray-800 font-bold mb-2">{user.name}</div>
                                                    <div class="text-gray-500 text-base mb-4">{user.email}</div>
                                                </div>
            
                                                <p>&rarr;</p>
            
                                                <div class="bg-gray-50 rounded-2xl p-6 my-8 border-2 border-gray-200">
                                                    <div class="text-2xl text-gray-800 font-bold mb-2">{interviewDetails.applicantId.name}</div>
                                                    <div class="text-gray-500 text-base mb-4">{interviewDetails.applicantId.email}</div>
                                                </div>
                                            </div>
                                            
                                            <button class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" onclick="startCall()"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>Start Call</button>
                                        </>
                                    )
                                }

                                {
                                    user.role === "User" && (
                                        <>
                                            <div class="bg-gray-50 rounded-2xl p-6 my-8 border-2 border-gray-200">
                                                <div class="text-2xl text-gray-800 font-bold mb-2">{user.name}</div>
                                                <div class="text-gray-500 text-base mb-4">{user.email}</div>
                                            </div>
                                            <button class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none py-3 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" onclick="startCall()"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>Accept Call</button>
                                        </>
                                    )
                                }

                                <div class="my-6">
                                    <div class="inline-flex gap-2">
                                        <div class="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                                        <div class="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                                        <div class="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                                    </div>
                                </div>

                                <p class="text-gray-500 text-sm mt-8">
                                    {
                                        user.role === "HR" ? "Creating a welcoming and supportive environment during the interview process not only helps candidates perform their best, but also reflects the values and culture of the organization." : "Please wait while we prepare your interview session. The interviewer will join shortly. Make sure your audio and video are working properly."
                                    }
                                </p>
                            </div>
                        // </div>
                    )
                }
            </div>

        </div>
    )
}