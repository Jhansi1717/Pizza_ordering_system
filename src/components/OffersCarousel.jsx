import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const offers = [
  { id: 1, text: "🔥 20% off on your favorite pizza!", bg: "bg-gradient-to-r from-red-500 to-red-600" },
  { id: 2, text: "🛵 Free delivery on your usual order", bg: "bg-gradient-to-r from-blue-500 to-blue-600" },
  { id: 3, text: "🎉 Buy 1 Get 1 Free on Large Pizzas", bg: "bg-gradient-to-r from-green-500 to-green-600" },
];

export default function OffersCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden relative h-16 rounded-2xl shadow-md mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 flex items-center justify-center text-white font-extrabold text-sm md:text-lg tracking-wide ${offers[index].bg}`}
        >
          {offers[index].text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
