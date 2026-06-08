import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";

export default function History() {
  const { orders, loadingOrders: loading } = useOrder();
  const { addToCart, setIsCartOpen } = useCart();

  const handleReorder = (order) => {
     addToCart({
       id: 999,
       name: `Reorder #${order.id} Selection`,
       base_type: "Pan",
       price: Math.max(200, Math.floor((order.total_price || 300) / 1.15)),
       isVeg: true,
       rating: "4.8"
     });
     setIsCartOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 md:p-8 max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2">
            Taste History.
          </h2>
          <p className="text-gray-500 font-bold">Your past AI-curated experiences.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white/80 backdrop-blur-xl rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="text-6xl mb-6 opacity-50">📜</div>
          <p className="text-2xl text-gray-900 font-black tracking-tight mb-2">The vault is empty.</p>
          <p className="text-gray-500 font-medium">You haven't ordered anything yet.</p>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, idx) => (
            <motion.div 
              key={order.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col h-full group"
            >
              {/* Receipt Header */}
              <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-4 relative">
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full" />
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Order #{order.id}</span>
                    <h3 className="font-extrabold text-gray-900 text-lg mt-1 group-hover:text-red-500 transition-colors">Neural Selection</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-gray-900">₹{order.total_price || "0"}</span>
                  </div>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="flex-1 space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">📅</div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Date</p>
                    <p className="font-bold text-gray-800 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">✅</div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Status</p>
                    <p className={`font-bold text-sm ${order.status !== 'DELIVERED' ? 'text-green-600' : 'text-gray-800'}`}>
                      {order.status || "CONFIRMED"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleReorder(order)} 
                className="w-full bg-gradient-to-r from-red-50 to-orange-50 text-red-600 font-black rounded-[16px] py-3.5 border border-red-100 shadow-sm transition-colors hover:from-red-100 hover:to-orange-100 flex items-center justify-center gap-2"
              >
                1-Tap Reorder <span>⚡</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
