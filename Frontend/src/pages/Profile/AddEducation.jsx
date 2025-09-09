import { useState } from "react"

export default function AddEducation({ handleEducationModalOpen, onSubmit }) {
    const [formData, setFormData] = useState({
        boardName: "",
        instituteName: "",
        streamName: "",
        marks: "",
        passout: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const educationData = {
                ...formData, marks: Number(formData.marks), passout: new Date(formData.passout)
            };

            await onSubmit(educationData);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
                <button type="button" className="absolute top-3 right-4 text-2xl font-bold text-gray-500 cursor-pointer hover:text-red-600 focus:outline-none" onClick={handleEducationModalOpen}>&times;</button>

                {/* Board Name */}
                <div className="mb-2">
                    <label htmlFor="boardName">Board name</label>
                    <input type="text" name="boardName" id="boardName" value={formData.boardName} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Institute Name */}
                <div className="mb-2">
                    <label htmlFor="instituteName">Institute name</label>
                    <input type="text" name="instituteName" id="instituteName" value={formData.instituteName} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Stream Name */}
                <div className="mb-2">
                    <label htmlFor="streamName">Stream name</label>
                    <input type="text" name="streamName" id="streamName" value={formData.streamName} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Marks */}
                <div className="mb-2">
                    <label htmlFor="marks">Marks (in percentage)</label>
                    <input type="number" name="marks" id="marks" value={formData.marks} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Passout */}
                <div className="mb-2">
                    <label htmlFor="passout">Passout</label>
                    <input type="date" name="passout" id="passout" value={formData.passout} onChange={handleChange} className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                <input type="submit" value="Update Education" className="bg-green-600 mt-4 px-6 py-1 rounded-md cursor-pointer hover:scale-105 duration-150 hover:shadow-lg font-semibold text-white" />
            </form>
        </div>
    )
}