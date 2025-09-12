import { useState } from "react";

export default function AddProject({ handleProjectModalOpen , onSubmit }) {
    const [formData, setFormData] = useState({
        projectTitle: "",
        remarks: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev, [name]: type === "checkbox" ? checked: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const experienceData = {
                ...formData, startDate: new Date(formData.startDate), endDate: formData.currentlyWorking ? null : new Date(formData.endDate)
            };

            await onSubmit(experienceData);

            setFormData({
                projectTitle: "",
                remarks: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false
            });
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
                <button type="button" className="absolute top-3 right-4 text-2xl font-bold text-gray-500 cursor-pointer hover:text-red-600 focus:outline-none" onClick={handleProjectModalOpen}>&times;</button>

                {/* Project Title */}
                <div className="mb-2">
                    <label htmlFor="projectTitle">Project Title</label>
                    <input type="text" name="projectTitle" id="projectTitle" value={formData.projectTitle} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Date */}
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <label htmlFor="startDate">Start Date</label>
                        <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                    </div>
                    <div className="w-full">
                        <label htmlFor="endDate">End Date</label>
                        <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' disabled={formData.currentlyWorking} />
                    </div>
                </div>
                <div className="space-x-2">
                    <input type="checkbox" name="currentlyWorking" id="currentlyWorking" checked={formData.currentlyWorking} onChange={handleChange} />
                    <label htmlFor="currentlyWorking">Currently working</label>
                </div>

                {/* Remarks */}
                <div className="mb-2">
                    <label htmlFor="remarks">Remarks</label>
                    <textarea name="remarks" id="remarks" value={formData.remarks} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded'></textarea>
                </div>

                <input type="submit" value="Update Project" className="bg-green-600 px-6 py-1 rounded-md cursor-pointer hover:scale-105 duration-150 hover:shadow-lg font-semibold text-white" />
            </form>
        </div>
    );
}