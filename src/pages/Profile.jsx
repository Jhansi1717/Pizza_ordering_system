import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const userId = localStorage.getItem('user_id') || "Guest";
  const [activeTab, setActiveTab] = useState("taste");

  // Taste Profile State
  const [spicy, setSpicy] = useState(92);
  const [veg, setVeg] = useState(85);
  const [crust, setCrust] = useState(78);

  const [userName, setUserName] = useState(localStorage.getItem('user_name') || "Guest User");
  const [userPhone, setUserPhone] = useState(localStorage.getItem('user_phone') || "+91 9172076535");
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameSave = () => {
    setIsEditingName(false);
    localStorage.setItem('user_name', userName);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 md:p-8 flex flex-col items-center max-w-6xl mx-auto"
    >
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Core Profile */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-white p-8 flex flex-col items-center relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-400/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-400/20 blur-3xl rounded-full" />

            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] rounded-full border-2 border-dashed border-red-200"
              />
              <div className="w-32 h-32 bg-gradient-to-tr from-red-600 via-red-500 to-orange-400 rounded-full mb-6 flex items-center justify-center text-white text-6xl font-black shadow-[0_15px_35px_rgba(239,68,68,0.4)] relative z-10">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {isEditingName ? (
              <input 
                autoFocus
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                className="text-3xl font-black text-gray-900 mb-1 tracking-tight text-center bg-gray-50 border border-gray-200 rounded-lg px-2 outline-none focus:border-red-400 w-full"
              />
            ) : (
              <h2 onClick={() => setIsEditingName(true)} className="text-3xl font-black text-gray-900 mb-1 tracking-tight cursor-pointer hover:text-red-500 transition-colors" title="Click to edit">
                {userName} <span className="text-sm opacity-50 ml-1">✏️</span>
              </h2>
            )}
            <p className="text-gray-500 font-bold mb-8 tracking-wide">{userPhone}</p>
            
            <div className="w-full space-y-3 mb-8">
              <div className="bg-gray-50/50 p-5 rounded-[24px] flex justify-between items-center border border-gray-100 hover:bg-gray-50 transition-colors">
                <span className="text-gray-600 font-bold text-sm">Subscription</span>
                <span className="font-black text-red-600 bg-red-50 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-sm">PRO Member</span>
              </div>
              <div className="bg-gray-50/50 p-5 rounded-[24px] flex justify-between items-center border border-gray-100 hover:bg-gray-50 transition-colors">
                <span className="text-gray-600 font-bold text-sm">AI Credits</span>
                <span className="font-black text-gray-900 flex items-center gap-1.5 border border-yellow-200 bg-yellow-50 px-4 py-1.5 rounded-full text-xs shadow-sm">
                  <span className="text-yellow-500 text-sm">✨</span> 5 Left
                </span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-900 text-white font-black py-4 rounded-[20px] uppercase tracking-widest text-xs hover:bg-black transition-all"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
            >
              Logout Securely
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column: Gamification & Insights */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          
          {/* Enhanced Gamification Banner */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-gray-900 p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-white relative overflow-hidden group"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <motion.div 
              animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-10 -bottom-10 text-[180px] leading-none opacity-10 drop-shadow-2xl pointer-events-none"
            >
              🔥
            </motion.div>
            
            <h3 className="text-2xl font-black mb-2 tracking-tight relative z-10">Your Order Streak</h3>
            <p className="text-gray-400 font-bold text-sm mb-8 relative z-10">Keep ordering to unlock exclusive AI rewards!</p>
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 text-white w-16 h-16 rounded-[20px] font-black text-3xl shadow-[0_10px_20px_rgba(239,68,68,0.3)] border border-red-400/30 rotate-3">
                3
              </div>
              <div>
                <p className="font-extrabold text-xl flex items-center gap-2">3 weeks in a row <span className="animate-pulse">🔥</span></p>
                <p className="text-sm text-gray-300 font-medium">Reward: 1 free premium pizza after 5 orders</p>
              </div>
            </div>
            
            {/* Progress line */}
            <div className="mt-8 w-full bg-gray-800 h-3 rounded-full overflow-hidden relative z-10 border border-gray-700">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "60%" }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.2 }}
                 className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"
               />
            </div>
            <div className="flex justify-between text-xs font-black tracking-widest text-gray-500 mt-3 relative z-10 uppercase">
              <span>Start</span>
              <span className="text-yellow-500 drop-shadow-sm">Free Pizza</span>
            </div>
          </motion.div>

          {/* Toggle Tabs */}
          <div className="flex gap-6 border-b border-gray-200 pb-2">
            {[
              { id: "taste", label: "Neural Taste Profile", icon: "🧠" },
              { id: "overview", label: "Insights", icon: "📊" },
              { id: "addresses", label: "Addresses", icon: "🏠" }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative font-black text-sm pb-4 transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <span className="text-lg">{tab.icon}</span> {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              
              {/* Neural Taste Profile Section */}
              {activeTab === "taste" && (
                <motion.div 
                  key="taste"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Fine-tune your AI</h3>
                    <p className="text-gray-500 font-bold text-sm">Adjust these parameters to change what SliceMind recommends you.</p>
                  </div>

                  <div className="space-y-8">
                    {/* Slider 1 */}
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <label className="font-extrabold text-gray-900 text-lg flex items-center gap-2">🌶️ Spicy Preference</label>
                          <span className="text-xs font-bold text-gray-400">Controls heat levels in recommendations</span>
                        </div>
                        <span className="font-black text-red-500 text-xl">{spicy}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={spicy} onChange={(e) => setSpicy(e.target.value)}
                        style={{ background: `linear-gradient(to right, #ef4444 ${spicy}%, #f3f4f6 ${spicy}%)` }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-red-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-red-500"
                      />
                    </div>

                    {/* Slider 2 */}
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <label className="font-extrabold text-gray-900 text-lg flex items-center gap-2">🥗 Vegetarian Affinity</label>
                          <span className="text-xs font-bold text-gray-400">Prioritizes plant-based options</span>
                        </div>
                        <span className="font-black text-green-500 text-xl">{veg}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={veg} onChange={(e) => setVeg(e.target.value)}
                        style={{ background: `linear-gradient(to right, #22c55e ${veg}%, #f3f4f6 ${veg}%)` }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-green-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-green-500"
                      />
                    </div>

                    {/* Slider 3 */}
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <label className="font-extrabold text-gray-900 text-lg flex items-center gap-2">🥖 Crust Thickness</label>
                          <span className="text-xs font-bold text-gray-400">0% = Thin Crust, 100% = Deep Dish</span>
                        </div>
                        <span className="font-black text-orange-500 text-xl">{crust}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" value={crust} onChange={(e) => setCrust(e.target.value)}
                        style={{ background: `linear-gradient(to right, #f97316 ${crust}%, #f3f4f6 ${crust}%)` }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-orange-500"
                      />
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="mt-10 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-black py-4 rounded-[20px] shadow-[0_10px_20px_rgba(239,68,68,0.2)] text-lg transition-all"
                  >
                    Save AI Preferences
                  </motion.button>
                </motion.div>
              )}

              {/* Insights Section */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8 rounded-[32px] hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">🍕</div>
                    <h4 className="text-blue-900 font-black text-2xl mb-1">12 Pizzas</h4>
                    <p className="text-blue-700 text-sm font-bold opacity-80 mb-6">Ordered this month</p>
                    <p className="text-blue-600 text-xs bg-blue-100/50 inline-block px-4 py-2 rounded-xl font-extrabold uppercase tracking-widest border border-blue-200">Top 5% User</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-8 rounded-[32px] hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">👑</div>
                    <h4 className="text-orange-900 font-black text-2xl mb-1">Margherita</h4>
                    <p className="text-orange-700 text-sm font-bold opacity-80 mb-6">Your all-time favorite</p>
                    <p className="text-orange-600 text-xs bg-orange-100/50 inline-block px-4 py-2 rounded-xl font-extrabold uppercase tracking-widest border border-orange-200">Ordered 8 times</p>
                  </div>
                </motion.div>
              )}

              {/* Address Management Section */}
              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center group hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-[16px] flex items-center justify-center text-2xl shrink-0 group-hover:bg-gray-100 transition-colors border border-gray-100">🏠</div>
                      <div>
                         <h4 className="font-black text-lg flex items-center gap-2">Home <span className="text-[10px] bg-gray-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">Primary</span></h4>
                         <p className="text-gray-500 text-sm font-bold mt-1">123 Tech Park, Block C, Bangalore 560001</p>
                      </div>
                    </div>
                    <button className="text-gray-300 hover:text-gray-900 font-bold text-2xl px-4 transition-colors">&#8942;</button>
                  </div>
                  
                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center group hover:border-gray-300 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-[16px] flex items-center justify-center text-2xl shrink-0 group-hover:bg-gray-100 transition-colors border border-gray-100">💼</div>
                      <div>
                         <h4 className="font-black text-lg">Work</h4>
                         <p className="text-gray-500 text-sm font-bold mt-1">Startup Hub, Phase 2, Koramangala 560034</p>
                      </div>
                    </div>
                    <button className="text-gray-300 hover:text-gray-900 font-bold text-2xl px-4 transition-colors">&#8942;</button>
                  </div>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-4 w-full border-2 border-dashed border-gray-200 text-gray-400 font-black py-6 rounded-[24px] hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all text-lg">
                    + Add New Address
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
