import axios from "axios";
import { ImCross } from "react-icons/im";
import { useState } from "react";

export default function Hiring(props) {
    const [loading, setLoading] = useState(false);

    const handleDecision = async (decision) => {
        const confirmMessage = decision === "hired" ? "Are you sure you want to hire this candidate?" : "Are you sure you want to reject this candidate?";
        
        const confirm = window.confirm(confirmMessage);
        if (!confirm) return;

        setLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:3000/api/interview/decision`, { jobId: props.job._id, applicantId: props.applicant.applicantId._id, decision }, { headers: { Authorization: token } });
            // console.log(response.data);
            
            if (response.data.success) {
                alert(response.data.message);
                
                if (props.onSuccess) {
                    await props.onSuccess();
                }
                
                if (props.onClose) {
                    props.onClose();
                } else {
                    props.setHiring(false);
                }
            }
        } catch (error) {
            // console.log(error);
            const errorMessage = error.response?.data?.message || "Failed to update applicant status";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        } else {
            props.setHiring(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white flex justify-center flex-col p-8 gap-4 rounded-lg relative min-w-sm max-w-md">
                <button className="absolute top-2 right-2 text-xs text-gray-500 hover:text-red-500 cursor-pointer hover:scale-115 transition-all p-2" onClick={handleClose} disabled={loading}><ImCross /></button>
                <p className="font-bold text-2xl text-gray-800">{props.job?.title}</p>
                
                <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {props.applicant?.applicantId?.name}</p>
                    <p className="text-gray-700"><span className="font-semibold">Email:</span> {props.applicant?.applicantId?.email}</p>
                    <p className="text-gray-700"><span className="font-semibold">Rating:</span> {props.applicant?.rating > 0 ? `${props.applicant.rating} / 10` : "Not rated"}</p>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-4 text-center">Make your final decision for this candidate</p>
                    <div className="w-full flex items-center justify-between gap-3">
                        <button className="w-full px-6 py-2 border rounded-md hover:scale-105 duration-200 ease-in-out cursor-pointer font-semibold bg-green-500 text-white text-xl hover:font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" onClick={() => handleDecision("hired")} disabled={loading}>{loading ? "Processing..." : "Hire"}</button>
                        <button className="w-full px-6 py-2 border rounded-md hover:scale-105 duration-200 ease-in-out cursor-pointer font-semibold bg-red-500 text-white text-xl hover:font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" onClick={() => handleDecision("rejected")} disabled={loading}>{loading ? "Processing..." : "Reject"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}