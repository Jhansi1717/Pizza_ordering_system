import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <motion.button
          onClick={() => setIsOpen(true)}
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: ["0px 0px 0px rgba(239, 68, 68, 0)", "0px 0px 30px rgba(239, 68, 68, 0.4)", "0px 0px 0px rgba(239, 68, 68, 0)"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-2xl border-4 border-white z-50 relative group"
        >
          <span className="relative z-10 group-hover:rotate-12 transition-transform">✨</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity" />
        </motion.button>
      </div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col border-l border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-red-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xl text-white shadow-md">✨</div>
                  <div>
                    <h2 className="font-extrabold text-gray-900 text-lg leading-tight">SliceMind AI</h2>
                    <p className="text-xs font-bold text-gray-400">Always learning your tastes</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
                {/* Natural Language Search */}
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Ask AI to Order</h3>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="e.g. 'I want something spicy with paneer'" 
                      className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-5 pr-12 text-sm font-medium focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all shadow-sm group-hover:shadow-md"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                      <span className="text-sm">↗</span>
                    </button>
                  </div>
                </div>

                {/* Recent Suggestions */}
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Smart Suggestions</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                        <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=100&q=80" alt="Margherita Special" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Margherita Special</h4>
                        <p className="text-xs text-gray-500">94% Match • Friday Favorite</p>
                      </div>
                      <button className="bg-red-50 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Add</button>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                        <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80" alt="Spicy Chicken" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Spicy Chicken Pizza</h4>
                        <p className="text-xs text-gray-500">Based on recent cravings</p>
                      </div>
                      <button className="bg-red-50 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Add</button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all">Repeat Last Order</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all">Clear Cart</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all">View Menu</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
