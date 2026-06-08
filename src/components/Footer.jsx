import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-20 relative overflow-hidden w-full max-w-full">
      {/* Background glow effects */}
      <div className="absolute top-0 right-[10%] w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍕</span>
              <span className="text-2xl font-black tracking-tight text-white">SliceMind<span className="text-red-500">.</span></span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed mt-2 max-w-xs">
              The world's first AI-powered pizza delivery experience. We predict your cravings before you do.
            </p>
            <div className="flex gap-4 mt-4">
              <motion.button whileHover={{ scale: 1.1, y: -2 }} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                𝕏
              </motion.button>
              <motion.button whileHover={{ scale: 1.1, y: -2 }} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                📸
              </motion.button>
              <motion.button whileHover={{ scale: 1.1, y: -2 }} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                💼
              </motion.button>
            </div>
          </div>

          {/* Column 2: Tech & Features */}
          <div className="flex flex-col gap-4">
            <h4 className="font-extrabold text-lg text-white mb-2 uppercase tracking-widest text-xs">Core Engine</h4>
            <ul className="space-y-3">
              <li><span className="text-gray-400 hover:text-red-400 transition-colors font-medium cursor-pointer">Neural Taste Profile</span></li>
              <li><span className="text-gray-400 hover:text-red-400 transition-colors font-medium cursor-pointer">Predictive Reordering</span></li>
              <li><span className="text-gray-400 hover:text-red-400 transition-colors font-medium cursor-pointer">Dynamic Pricing Deals</span></li>
              <li><span className="text-gray-400 hover:text-red-400 transition-colors font-medium cursor-pointer">Smart Drone Delivery</span></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-4">
            <h4 className="font-extrabold text-lg text-white mb-2 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-3">
              <li><span className="text-gray-400 hover:text-white transition-colors font-medium cursor-pointer">About Us</span></li>
              <li><span className="text-gray-400 hover:text-white transition-colors font-medium cursor-pointer">Careers <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full ml-2">WE'RE HIRING</span></span></li>
              <li><span className="text-gray-400 hover:text-white transition-colors font-medium cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-gray-400 hover:text-white transition-colors font-medium cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>

          {/* Column 4: App Download */}
          <div className="flex flex-col gap-4">
            <h4 className="font-extrabold text-lg text-white mb-2 uppercase tracking-widest text-xs">Get The App</h4>
            <p className="text-gray-400 font-medium mb-2">Experience 1-tap AI ordering on the go.</p>
            <div className="flex flex-col gap-3">
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white text-gray-900 rounded-xl px-4 py-3 flex items-center gap-3 w-48 shadow-lg">
                <span className="text-2xl text-gray-900">🍎</span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-500 leading-none">Download on the</p>
                  <p className="font-black leading-none mt-1">App Store</p>
                </div>
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3 w-48">
                <span className="text-2xl">🤖</span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 leading-none">GET IT ON</p>
                  <p className="font-black leading-none mt-1">Google Play</p>
                </div>
              </motion.button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © 2026 SliceMind Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
