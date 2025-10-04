// import { useState } from "react";

// export default function ScheduleInterview({ selectedApplicant, scheduleInterviewModal, setScheduleInetrviewModal }) {
//     console.log(selectedApplicant);

//     const [date, setDate] = useState("");
//     const [startingTime, setStartingTime] = useState("");
//     const [endingTime, setEndingTime] = useState("");

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const formdate = { date, startingTime, endingTime };
//         // console.log("Date:", date, "ST:", startingTime, "ET:", endingTime);
//         console.log(formdate);
//         setScheduleInetrviewModal(!scheduleInterviewModal);
//     }

//     const handleClose = () => {
//         setScheduleInetrviewModal(!scheduleInterviewModal)
//     }
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//             <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
//                 <p>Applicant Name: {selectedApplicant.name}</p>

//                 <div>
//                     <label htmlFor="date">Date</label>
//                     <input type="date" name="date" id="date" className="w-full border px-4 py-2 border-gray-300 rounded-md" value={date} onChange={(e) => setDate(e.target.value)} />
//                 </div>

//                 <div className="flex gap-2">
//                     <div className="mb-4 w-full">
//                         <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="startingTime">Starting Time</label>
//                         <input type="time" id="startingTime" name="startingTime" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={startingTime} onChange={(e) => setStartingTime(e.target.value)} />
//                     </div>

//                     <div className="mb-4 w-full">
//                         <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="endingTime">Ending Time</label>
//                         <input type="time" id="endingTime" name="endingTime" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={endingTime} onChange={(e) => setEndingTime(e.target.value)} />
//                     </div>
//                 </div>

//                 <div className="flex gap-2">
//                     <button className="w-full bg-red-300 py-2 rounded-md cursor-pointer" onClick={handleClose}>Cancel</button>
//                     <input type="submit" value="Schedule" className="w-full bg-green-400 py-2 rounded-md cursor-pointer" />
//                 </div>
//             </form>
//         </div>
//     )
// }




















import { useEffect, useState } from "react";
import axios from "axios";

export default function ScheduleInterview({ selectedApplicant, scheduleInterviewModal, setScheduleInetrviewModal, job }) {
    console.log(selectedApplicant);

    const [date, setDate] = useState("");
    const [startingTime, setStartingTime] = useState("");
    const [endingTime, setEndingTime] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User:", user);

    useEffect(() => {
        handleSubmit();
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formdata = { jobId: job._id, applicantId: selectedApplicant._id, hrId: user._id, date, startTime: startingTime, endTime: endingTime };
        console.log(formdata);
        setScheduleInetrviewModal(!scheduleInterviewModal);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/interview/scheduleInterview", formdata, { headers: { Authorization: token }});
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        setScheduleInetrviewModal(!scheduleInterviewModal)
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
                <p>Applicant Name: {selectedApplicant.name}</p>

                <div>
                    <label htmlFor="date">Date</label>
                    <input type="date" name="date" id="date" className="w-full border px-4 py-2 border-gray-300 rounded-md" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="flex gap-2">
                    <div className="mb-4 w-full">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="startingTime">Starting Time</label>
                        <input type="time" id="startingTime" name="startingTime" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={startingTime} onChange={(e) => setStartingTime(e.target.value)} />
                    </div>

                    <div className="mb-4 w-full">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="endingTime">Ending Time</label>
                        <input type="time" id="endingTime" name="endingTime" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={endingTime} onChange={(e) => setEndingTime(e.target.value)} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="w-full bg-red-300 py-2 rounded-md cursor-pointer" onClick={handleClose}>Cancel</button>
                    <input type="submit" value="Schedule" className="w-full bg-green-400 py-2 rounded-md cursor-pointer" />
                </div>
            </form>
        </div>
    )
}