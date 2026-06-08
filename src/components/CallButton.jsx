import { motion } from "framer-motion";

export default function CallButton() {
  return (
    <motion.button
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 bg-green-500 text-white font-semibold py-3 px-5 rounded-full shadow-lg z-[30] flex items-center gap-2"
      onClick={() => alert("Calling Delivery Partner...")}
    >
      📞 Call Delivery Partner
    </motion.button>
  );
}
