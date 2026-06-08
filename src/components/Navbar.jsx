import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { cartItems, toggleCart } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgb(0,0,0,0.05)] border-b border-transparent' : 'bg-white/50 backdrop-blur-md border-b border-gray-100'} text-gray-800 flex flex-wrap justify-between items-center p-4 px-6 md:px-12`}
    >
      <Link to="/home">
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2"
        >
          <span className="drop-shadow-sm">🍕</span> 
          SliceMind<span className="text-primary -ml-1">.</span>
        </motion.h1>
      </Link>

      <div className="flex gap-4 md:gap-8 items-center font-bold text-sm md:text-base mt-2 md:mt-0">
        {["Home", "Menu", "Orders", "History", "Profile", "Chat"].map((item) => {
          const path = `/${item.toLowerCase()}`;
          const isActive = location.pathname === path;
          return (
            <Link key={item} to={path} className="relative group transition-colors px-1 py-1">
              <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-gray-900 font-extrabold" : "text-gray-500 group-hover:text-gray-900"}`}>
                {item}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-primary rounded-t-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              {/* Hover Indicator */}
              {!isActive && (
                <div className="absolute -bottom-1.5 left-1/2 right-1/2 h-[3px] bg-gray-300 rounded-t-full opacity-0 group-hover:opacity-100 group-hover:left-0 group-hover:right-0 transition-all duration-300" />
              )}
            </Link>
          );
        })}
        
        {/* Premium Cart Toggle */}
        <div className="relative ml-4">
          {totalItems > 0 && (
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 scale-150" />
          )}
          <motion.button 
            key={totalItems} // Triggers animation on change
            initial={totalItems > 0 ? { scale: 0.8 } : false}
            animate={totalItems > 0 ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0] } : { scale: 1 }}
            whileHover={{ scale: 1.1, y: -2, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.4 }}
            onClick={toggleCart}
            className="relative bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.04)] p-2.5 rounded-full hover:border-gray-200 transition-all z-10"
          >
            <span className="text-xl leading-none block">🛒</span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
