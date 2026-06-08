import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DeliveryStatusBanner() {
  const [locationName, setLocationName] = useState("Fetching location...");
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName("Location not supported");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || "";
            const neighborhood = data.address.suburb || data.address.neighbourhood || data.address.road || "";
            setLocationName(`${neighborhood}${neighborhood && city ? ', ' : ''}${city}` || "Location Found");
          } else {
            setLocationName("Location Found");
          }
        } catch (error) {
          setLocationName("123 Tech Park, Bangalore"); // Fallback
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setLocationName("123 Tech Park, Bangalore"); // Fallback on permission denied
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  }, []);

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)] relative z-30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
            <span className="text-xl relative z-10">📍</span>
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-10 h-10 bg-green-400 rounded-full blur-sm" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Live Delivery</h4>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-800 line-clamp-1 max-w-[200px] sm:max-w-[300px]">
                {locationName}
              </p>
              {isLocating && (
                <span className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Animated Progress Tracker */}
        <div className="flex-1 max-w-lg hidden lg:block px-8 relative">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full relative"
            >
              {/* Shimmer effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
            </motion.div>
          </div>
          
          {/* Moving Bike */}
          <motion.div 
            initial={{ left: "0%" }}
            animate={{ left: "65%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 -translate-y-1/2 -ml-3 text-2xl drop-shadow-md z-10"
          >
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 0.3, repeat: Infinity }}>
              🛵
            </motion.div>
          </motion.div>
          
          <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>Preparing</span>
            <span className="text-red-500">On The Way</span>
            <span>Delivered</span>
          </div>
        </div>

        {/* Right Side: ETA */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 8, ease: "linear", repeat: Infinity }} className="text-lg">⏱</motion.span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">ETA</span>
            <span className="text-sm font-bold text-gray-900 leading-none mt-1">15 Mins</span>
          </div>
        </div>

      </div>
    </div>
  );
}
