export default function ImageUploadModal() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
                <p>Are sure to update your profile image?</p>

                <div>
                    <button>Yes</button>
                    <button>No</button>
                </div>
            </div>
        </div>
    )
}