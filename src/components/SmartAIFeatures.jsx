import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function SmartAIFeatures() {
  const [typingText, setTypingText] = useState("");
  const fullText = "Learning your pizza preferences...";
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const handleQuickReorder = () => {
    addToCart({
      id: 115,
      name: "Margherita Special",
      base_type: "Thin Crust",
      price: 400,
      isVeg: true,
      rating: "4.8"
    });
    setIsCartOpen(true);
    toast.success("Friday Night Usual added to cart!");
  };

  const handleApplyDeal = () => {
    toast.success("AI Coupon BOGO auto-applied to checkout!", { icon: "✨" });
  };

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setTypingText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        i = 0; // loop
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="py-20 my-16 bg-gradient-to-b from-transparent via-red-50/30 to-transparent relative overflow-hidden rounded-[40px] border border-gray-50">
      
      {/* Animated Background Nodes */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ 
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
            className={`absolute rounded-full bg-gradient-to-r from-red-400 to-orange-400 blur-2xl ${i % 2 === 0 ? 'w-64 h-64' : 'w-40 h-40'}`}
            style={{ 
              left: `${15 * i}%`, 
              top: `${Math.random() * 80}%` 
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-gray-200 shadow-sm mb-6"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-gray-800">SliceMind Core Engine</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Pizza ordering, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">perfected by AI</span>
          </h2>
          <p className="text-lg font-bold text-gray-500 h-8 font-mono">{typingText}<span className="animate-pulse">|</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Taste Learning */}
          <motion.div 
            onClick={() => navigate("/profile")}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-red-100 transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] cursor-pointer group"
          >
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-inner">🧠</div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-red-500 transition-colors">Hyper-Personalized Taste</h3>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">Our neural network analyzes your past 50 orders to predict exactly what crust, toppings, and spices you are craving right now. <span className="text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Adjust Profile &rarr;</span></p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>Spicy Preference</span> <span>92%</span></div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "92%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>Vegetarian Affinity</span> <span>85%</span></div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }} className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>Pan Crust Love</span> <span>78%</span></div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "78%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }} className="h-full bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Smart Reordering */}
          <motion.div 
            onClick={handleQuickReorder}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-blue-100 transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] cursor-pointer group relative overflow-hidden"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-inner">⚡</div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors">Predictive Reordering</h3>
            <p className="text-gray-500 font-medium leading-relaxed mb-6">We know it's Friday night. We already prepared your Margherita Special cart. Just one tap to order. <span className="text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Tap to Add &rarr;</span></p>
            
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 relative mt-auto group-hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍕</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Friday Night Usual</p>
                  <p className="text-xs text-gray-400 font-bold">1x Margherita, 1x Coke</p>
                </div>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-2 -top-2 bg-blue-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg shadow-md"
              >
                Ready
              </motion.div>
            </div>
          </motion.div>

          {/* Card 3: Dynamic Pricing & Offers */}
          <motion.div 
            onClick={handleApplyDeal}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-800 hover:border-gray-700 transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] cursor-pointer group text-white relative overflow-hidden"
          >
            <div className="w-14 h-14 bg-gray-800 text-yellow-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-inner relative z-10">✨</div>
            <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-yellow-400 transition-colors relative z-10">AI-Optimized Deals</h3>
            <p className="text-gray-400 font-medium leading-relaxed mb-6 relative z-10">Our engine scans thousands of permutations to apply the absolute best coupon combo for your specific cart automatically. <span className="text-yellow-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Apply Now &rarr;</span></p>
            
            <div className="mt-8 flex items-end gap-2 relative z-10">
              <div className="text-gray-500 line-through font-bold text-lg">₹850</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 group-hover:scale-110 transition-transform origin-bottom-left">₹620</div>
              <div className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded mb-1">Saved 27%</div>
            </div>
            <div className="mt-4 flex gap-2 relative z-10">
              <span className="bg-gray-800 border border-gray-700 text-xs font-bold px-2 py-1 rounded text-gray-300">AUTO-APPLIED</span>
              <span className="bg-gray-800 border border-gray-700 text-xs font-bold px-2 py-1 rounded text-gray-300 group-hover:bg-yellow-400/20 group-hover:text-yellow-400 transition-colors">BOGO</span>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-400/10 transition-colors" />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
