export default function AddProject(props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button type="button" className="absolute top-3 right-4 text-2xl font-bold text-gray-500 cursor-pointer hover:text-red-600 focus:outline-none" onClick={props.handleProjectModalOpen}>&times;</button>
            </form>
        </div>
    );
}