import { Link } from "react-router-dom";

export default function Error() {
    return (
        <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center p-4">
            <div className="text-center">                
                <h1 className="text-8xl font-bold text-red-500 mb-4">403</h1>
                
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    Access Forbidden
                </h2>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {/* <p className="blinking"> */}
                    You don't have permission to access this resource. 
                    Please contact your administrator if you believe this is a mistake.
                </p>
                
                <div className="flex gap-4 justify-center">
                    <button onClick={() => window.history.back()} className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 cursor-pointer hover:shadow-lg hover:scale-105 duration-200 ease-in-out">Go Back</button>
                    <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer hover:shadow-lg hover:scale-105 duration-200 ease-in-out"><Link to="/">Go Home</Link></button>
                </div>
            </div>
        </div>
    )
}