export default function Chat() {
    return (
        <div className="p-5 flex flex-col h-screen">

            <div className="flex-1 overflow-y-auto space-y-2">
                <div className="bg-gray-200 p-2 rounded w-fit">
                    Where is my order?
                </div>

                <div className="bg-red-500 text-white p-2 rounded w-fit self-end">
                    Your order is preparing 🍕
                </div>
            </div>

            <div className="flex gap-2 mt-3">
                <input className="border p-2 flex-1 rounded" placeholder="Type message..." />
                <button className="bg-red-500 text-white px-4 rounded">Send</button>
            </div>

            {/* Call Button */}
            <button className="mt-3 bg-green-500 text-white p-3 rounded">
                📞 Call Delivery Partner
            </button>

        </div>
    );
}