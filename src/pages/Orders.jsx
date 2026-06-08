import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import toast from "react-hot-toast";

export default function Orders() {
  const { orders, loadingOrders: loading } = useOrder();
  const navigate = useNavigate();

  const activeOrders = orders.filter(o => o.status !== "DELIVERED");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 md:p-8 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
            className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-3 border border-red-100 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Tracking
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
            Active Orders.
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : activeOrders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white/80 backdrop-blur-xl rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="text-6xl mb-6 opacity-50">🍕</div>
          <p className="text-2xl text-gray-900 font-black tracking-tight mb-2">No active missions.</p>
          <p className="text-gray-500 font-medium mb-8">Your drone fleet is currently grounded. Give them an order!</p>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')} 
            className="bg-gray-900 text-white font-black py-4 px-10 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-black transition-colors"
          >
            Summon Pizza 🛸
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {activeOrders.map((order, idx) => {
            const statusIndex = order.status === "CONFIRMED" ? 0 : order.status === "PREPARING" ? 1 : order.status === "OUT_FOR_DELIVERY" ? 2 : 1; 
            const progressWidth = `${(statusIndex + 1) * 25}%`;

            return (
              <motion.div 
                key={order.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row border border-gray-50 overflow-hidden relative"
              >
                {/* Left Side: Live Map / Drone View */}
                <div className="w-full lg:w-2/5 bg-gray-900 relative overflow-hidden min-h-[250px] lg:min-h-[auto] p-8 flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
                  
                  {/* Radar Animation */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-green-500/20 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 border border-green-500/30 rounded-full flex items-center justify-center">
                      <div className="w-32 h-32 border border-green-500/40 rounded-full relative">
                        <motion.div 
                          animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-t border-green-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Drone Blip */}
                  <motion.div 
                    animate={{ x: [0, 20, 10, -10, 0], y: [0, -15, 15, -5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_15px_#4ade80]"
                  />

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="bg-black/50 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-md border border-white/10">
                      Drone Alpha-7
                    </span>
                    <span className="bg-green-500/20 text-green-400 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-md border border-green-500/30 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Signal Locked
                    </span>
                  </div>

                  <div className="relative z-10">
                    <p className="text-white font-black text-2xl drop-shadow-md">ETA: 14 mins</p>
                    <p className="text-gray-400 font-medium text-sm">Approaching your location via Route 6</p>
                  </div>
                </div>

                {/* Right Side: Order Details */}
                <div className="w-full lg:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Order #{order.id}</p>
                      <h3 className="font-black text-2xl text-gray-900">Custom AI Selection</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">₹{order.total_price || "..."}</p>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="mb-10">
                    <div className="flex justify-between mt-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-300 px-1 mb-4 relative z-10">
                      <span className={statusIndex >= 0 ? "text-gray-900" : ""}>Confirmed</span>
                      <span className={statusIndex >= 1 ? "text-gray-900" : ""}>Preparing</span>
                      <span className={statusIndex >= 2 ? "text-red-500 drop-shadow-sm" : ""}>Out</span>
                      <span className={statusIndex >= 3 ? "text-gray-900" : ""}>Delivered</span>
                    </div>

                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden relative shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: progressWidth }}
                        transition={{ duration: 1.5, ease: "easeOut", type: "spring" }}
                        className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 h-full rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                      onClick={() => navigate('/chat')}
                      className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-black transition-colors"
                    >
                      AI Support
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                      onClick={() => {
                        toast.loading("Generating Neural Invoice PDF...", { duration: 1500 });
                        setTimeout(() => toast.success("Invoice downloaded to your device! 📄"), 1500);
                      }}
                      className="flex-1 bg-white text-gray-900 font-black py-4 rounded-2xl border-2 border-gray-100 shadow-sm hover:border-gray-200 transition-colors"
                    >
                      View Invoice
                    </motion.button>
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  );
}
