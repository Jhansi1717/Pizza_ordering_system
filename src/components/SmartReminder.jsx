import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function SmartReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    // Only show on Home or Orders page after a few seconds
    if (location.pathname === "/home" || location.pathname === "/orders") {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // show after 5s

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [location.pathname]);

  const handleQuickAdd = () => {
    // Mock your usual
    addToCart({
      id: 998,
      name: "Margherita Special",
      base_type: "Pan",
      price: 280,
      isVeg: true,
      rating: "4.9"
    });
    setIsVisible(false);
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-[10px] p-4 rounded-[24px] shadow-2xl border border-gray-200 flex items-center justify-between gap-4 max-w-[90vw] md:max-w-[400px] w-full"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex justify-center items-center text-xl shrink-0">🍕</div>
            <div>
              <p className="font-black text-gray-900 text-sm leading-tight">It's your usual pizza time!</p>
              <p className="text-gray-500 font-bold text-xs mt-0.5">Order Margherita Special?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsVisible(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors font-bold text-xs"
            >
              ✕
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className="bg-primary text-white font-extrabold px-4 py-2 rounded-xl shadow-md text-xs hover:bg-red-600 transition-colors"
            >
              Order
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
