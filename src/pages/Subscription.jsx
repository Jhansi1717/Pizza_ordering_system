import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

function Subscription() {
  const [credits, setCredits] = useState(null);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("user_id");

  const subscribe = async (planType) => {
    if (!userId) {
      setMessage("Please login first");
      return;
    }
    try {
      await api.post("/subscriptions", {
        user_id: Number(userId),
        plan_type: planType,
      });
      const sub = await api.get(`/subscriptions/me?user_id=${userId}`);
      setCredits(sub.data?.data?.credits_remaining ?? null);
      setMessage(`🎉 Successfully Subscribed to ${planType} tier!`);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Subscription failed. Please try again.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 md:p-8 flex-1 max-w-4xl mx-auto w-full"
    >
      <h2 className="text-3xl font-black text-gray-900 mb-6 drop-shadow-sm flex items-center gap-2">
        <span>⭐</span> SliceMind Subscriptions
      </h2>
      
      <div className="grid sm:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="text-xl font-bold text-gray-500 mb-1">Basic Tier</div>
          <p className="text-4xl font-black text-gray-900 mb-4">2 <span className="text-lg text-gray-400">pizzas / wk</span></p>
          <div className="flex-1 text-gray-600 font-medium space-y-2 mb-8">
            <p>✓ Standard support</p>
            <p>✓ Priority queue</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => subscribe("BASIC")}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg border border-transparent hover:bg-gray-800 transition-colors"
          >
            Choose Basic
          </motion.button>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-red-600 to-orange-500 border border-transparent rounded-[30px] p-8 shadow-xl shadow-red-500/20 flex flex-col text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-7xl opacity-10 rotate-12">👑</div>
          <div className="text-xl font-extrabold text-red-100 mb-1">Pro Tier</div>
          <p className="text-4xl font-black text-white mb-4">5 <span className="text-lg text-red-200">pizzas / wk</span></p>
          <div className="flex-1 text-white font-semibold space-y-2 mb-8 z-10">
            <p>✓ Instant delivery pipeline</p>
            <p>✓ VIP Chat support</p>
            <p>✓ Premium menu access</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => subscribe("PRO")}
            className="w-full bg-white text-red-600 font-black tracking-wide py-4 rounded-xl shadow-xl z-10 relative overflow-hidden transition-colors"
          >
            Upgrade to Pro
          </motion.button>
        </motion.div>
      </div>

      {(credits !== null || message) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm"
        >
          {message && <p className="text-green-800 font-bold mb-2 text-lg">{message}</p>}
          {credits !== null && <p className="text-green-900 font-extrabold text-xl">Current Active Credits: <span className="text-2xl">{credits}</span></p>}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Subscription;
