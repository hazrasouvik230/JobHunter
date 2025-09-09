import { useState } from "react"

export default function AddExperience({ handleExperienceModalOpen, onSubmit }) {
    const [formData, setFormData] = useState({
        companyName: "",
        companyLogo: "",
        designationName: "",
        remarks: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const experienceData = {
                ...formData, startDate: new Date(formData.startDate), endDate: new Date(formData.endDate)
            };

            await onSubmit(experienceData);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
                <button type="button" className="absolute top-3 right-4 text-2xl font-bold text-gray-500 cursor-pointer hover:text-red-600 focus:outline-none" onClick={handleExperienceModalOpen}>&times;</button>

                {/* Company Name */}
                <div className="mb-2">
                    <label htmlFor="companyName">Company name</label>
                    <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Company Logo */}
                <div className="mb-2">
                    <label htmlFor="companyLogo">Company Logo</label>
                    <input type="file" name="companyLogo" id="companyLogo" value={formData.companyLogo} onChange={handleChange}  className='border border-gray-300 text-gray-400 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Designation Name */}
                <div className="mb-2">
                    <label htmlFor="designationName">Designation name</label>
                    <input type="text" name="designationName" id="designationName" value={formData.designationName} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Remarks */}
                <div className="mb-2">
                    <label htmlFor="remarks">Remarks</label>
                    <textarea name="remarks" id="remarks" value={formData.remarks} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded'></textarea>
                </div>

                {/* Passout */}
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <label htmlFor="startDate">Start Date</label>
                        <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                    </div>
                    <div className="w-full">
                        <label htmlFor="endDate">End Date</label>
                        <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                    </div>
                </div>
                <div className="space-x-2">
                    <input type="checkbox" name="present" id="present" value={formData.currentlyWorking} onChange={handleChange} />
                    <label htmlFor="present">Currently working</label>
                </div>

                <input type="submit" value="Update Experience" className="bg-green-600 mt-4 px-6 py-1 rounded-md cursor-pointer hover:scale-105 duration-150 hover:shadow-lg font-semibold text-white" />
            </form>
        </div>
    )
}