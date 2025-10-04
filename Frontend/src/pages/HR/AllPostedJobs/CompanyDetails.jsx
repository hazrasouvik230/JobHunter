import { useContext } from "react"
import JobContext from "../../../context/JobsContext"

export default function CompanyDetails() {
    const { allPostedJobs, liveJobs } = useContext(JobContext);
    
    return <div className='w-1/5 border border-amber-500 flex flex-col items-center pt-4 gap-2'>
        <img src={`http://localhost:3000/uploads/company-logos/${JSON.parse(localStorage.getItem("user")).companyLogo}`} alt={JSON.parse(localStorage.getItem("user")).companyLogo} className='h-32 w-32 rounded-full border' />
        <p className='text-2xl font-semibold'>{JSON.parse(localStorage.getItem("user")).companyName}</p>
        <p>Total jobs posted: {allPostedJobs.length}</p>
        <p>Live posted jobs: {liveJobs.length}</p>
    </div>
}