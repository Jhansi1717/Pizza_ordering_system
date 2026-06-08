import { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useCart } from "../context/CartContext";
import { getPizzaImage } from "../utils/getPizzaImage";
import PizzaCustomizerModal from "./PizzaCustomizerModal";

function PizzaCard({ pizza }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const imageUrl = getPizzaImage(pizza);

  // 3D Tilt Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Generate random mock match score based on pizza id
  const matchScore = 85 + (pizza.id % 14);

  return (
    <>
      <div style={{ perspective: 1000 }} className="h-full">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.02, boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[24px] overflow-hidden flex flex-col border border-gray-100 h-full relative group shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
        >
          <div className="relative bg-gray-50 w-full overflow-hidden" style={{ transform: "translateZ(30px)" }}>
            <motion.img 
              src={imageUrl} 
              alt={pizza.name} 
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full aspect-[4/3] object-cover rounded-t-[24px]"
            />
            
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider z-10 border border-white">
              {pizza.isVeg ? <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> : <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>}
              <span className="mt-0.5 text-gray-800">{pizza.isVeg ? "VEG" : "NON-VEG"}</span>
            </div>

            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider z-10 flex items-center gap-1 shadow-[0_4px_15px_rgba(239,68,68,0.5)] group-hover:scale-105 transition-transform">
              <span className="animate-pulse text-xs">✨</span> {matchScore}% MATCH
            </div>
            
            {/* Soft inner shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          
          <div className="p-6 flex flex-col flex-1 gap-2 bg-white" style={{ transform: "translateZ(40px)" }}>
            <h3 className="text-xl font-[800] text-gray-900 leading-tight tracking-tight group-hover:text-primary transition-colors">{pizza.name}</h3>
            
            <div className="flex items-center gap-3 mt-1 mb-3">
              <div className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 border border-orange-100">
                <span className="text-[10px]">⭐</span> {pizza.rating}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{pizza.base_type}</p>
            </div>
            
            <div className="mt-auto pt-4 flex items-center justify-between">
              <p className="font-[900] text-2xl text-gray-900 tracking-tight">₹{pizza.price}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="relative overflow-hidden bg-primary text-white font-extrabold rounded-xl px-6 py-2.5 transition-all shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_25px_rgba(239,68,68,0.4)] group/btn"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Add <span className="opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300 text-lg">+</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <PizzaCustomizerModal 
        pizza={pizza} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddToCart={addToCart} 
      />
    </>
  );
}

export default PizzaCard;
