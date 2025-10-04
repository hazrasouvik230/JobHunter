export default function Notifications({ notifications }) {
    
    return <div className="relative inset-0 z-50">
        <div className="bg-white px-4 py-2 rounded-md absolute shadow-lg border border-gray-300 top-14 right-40">
            {
                notifications.length > 0 ? (
                    <>
                        {
                            notifications.map(notification => {
                                return <div key={notification.id} className="bg-gray-100 my-2 p-2 rounded-md">
                                    <p>{notification.title}</p>
                                    <div className="flex gap-2 mt-1">
                                        <button className="border px-3 rounded-sm bg-blue-400/50">Mark as read</button>
                                        <button className="border px-3 rounded-sm bg-red-400/50">Remove</button>
                                    </div>
                                </div>
                            })
                        }
                    </>
                ) :
                <p>No notification yet...</p>
            }
        </div>
    </div>
}