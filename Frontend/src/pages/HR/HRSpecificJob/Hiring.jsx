import { ImCross } from "react-icons/im";

export default function Hiring({ hiring, setHiring }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white flex items-center justify-center p-8 gap-4 rounded-lg relative">
                <p className="absolute top-2 right-2 text-xs text-gray-500 hover:text-red-500 cursor-pointer hover:scale-115" onClick={() => setHiring(!hiring)}><ImCross /></p>
                <button className="px-6 py-2 border rounded-md hover:scale-105 duration-200 ease-in-out cursor-pointer font-semibold bg-green-500 text-white text-xl hover:font-bold hover:shadow-lg">Hire</button>
                <button className="px-6 py-2 border rounded-md hover:scale-105 duration-200 ease-in-out cursor-pointer font-semibold bg-red-500 text-white text-xl hover:font-bold">Reject</button>
            </div>
        </div>
    )
}