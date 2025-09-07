export default function AddEducation(props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button type="button" className="absolute top-3 right-4 text-2xl font-bold text-gray-500 cursor-pointer hover:text-red-600 focus:outline-none" onClick={props.handleEducationModalOpen}>&times;</button>

                {/* Board Name */}
                <div className="mb-2">
                    <label htmlFor="boardName">Board name</label>
                    <input type="text" name="boardName" id="boardName" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Institute Name */}
                <div className="mb-2">
                    <label htmlFor="instituteName">Institute name</label>
                    <input type="text" name="instituteName" id="instituteName" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Stream Name */}
                <div className="mb-2">
                    <label htmlFor="streamName">Stream name</label>
                    <input type="text" name="streamName" id="streamName" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Marks */}
                <div className="mb-2">
                    <label htmlFor="marks">Marks (in percentage)</label>
                    <input type="number" name="marks" id="marks" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                {/* Passout */}
                <div className="mb-2">
                    <label htmlFor="passout">Passout</label>
                    <input type="date" name="passout" id="passout" className='border border-gray-300 w-full p-1.5 px-3 rounded' />
                </div>

                <input type="submit" value="Update Education" className="bg-green-600 mt-4 px-6 py-1 rounded-md cursor-pointer hover:scale-105 duration-150 hover:shadow-lg font-semibold text-white" />
            </form>
        </div>
    )
}