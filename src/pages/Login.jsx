import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { phone });
      toast.success(res.data.message || "Security code sent!");
      setStep(2);
    } catch (error) {
      console.warn("Backend not found, using Demo Mode.");
      setTimeout(() => {
        toast.success("Demo Mode: Use code 1234");
        setStep(2);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error("Please enter the full code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, otp });
      if (!res.data?.success) {
        toast.error(res.data?.message || "Invalid security code");
        return;
      }
      const userId = res.data?.data?.user_id;
      localStorage.setItem("user_id", String(userId));
      localStorage.setItem("user_phone", `+91 ${phone}`);
      
      toast.success("Authentication successful. Welcome to SliceMind.");
      navigate("/home");
    } catch (error) {
      setTimeout(() => {
        if (otp === "1234" || otp.length === 4) {
          localStorage.setItem("user_id", "demo_user_123");
          localStorage.setItem("user_phone", `+91 ${phone}`);
          toast.success("Demo Auth successful! Welcome.");
          navigate("/home");
        } else {
          toast.error("Invalid security code");
        }
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-400/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Floating Pizza Nodes */}
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ 
              y: [Math.random() * 20 - 10, Math.random() * -20 + 10, Math.random() * 20 - 10],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute text-4xl opacity-10 blur-[1px]"
            style={{ left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80 + 10}%` }}
          >
            🍕
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto p-5 md:p-8 flex flex-col md:flex-row items-center gap-12 relative z-10">
        
        {/* Left Side: Brand Showcase */}
        <div className="w-full md:w-1/2 text-center md:text-left pt-10 md:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-gray-200 shadow-sm mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-gray-800">SliceMind Core Engine v2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.05] mb-6"
          >
            Smart <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Pizza Ordering.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-lg text-gray-500 font-medium max-w-md mx-auto md:mx-0 leading-relaxed mb-10"
          >
            Access your personalized neural taste profile. Our AI predicts exactly what you're craving before you even know it.
          </motion.p>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center md:justify-start gap-6 text-gray-400 font-bold text-sm">
            <span className="flex items-center gap-2">🧠 Neural Learning</span>
            <span className="flex items-center gap-2">⚡ 1-Tap Reorder</span>
          </motion.div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden"
          >
            {/* Inner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 blur-2xl rounded-full" />
            
            <h2 className="text-2xl font-black text-gray-900 mb-2 relative z-10">Access Terminal</h2>
            <p className="text-gray-500 font-bold text-sm mb-8 relative z-10">Enter your credentials to sync your taste profile.</p>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-6 relative z-10"
                >
                  <div>
                    <label className="block text-xs font-black tracking-widest uppercase text-gray-400 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-bold">+91</span>
                      </div>
                      <input
                        type="tel"
                        autoComplete="tel"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[20px] pl-14 pr-4 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || phone.length < 10}
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-black py-4 rounded-[20px] shadow-[0_10px_20px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Generate Secure Code <span>→</span></>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6 relative z-10"
                >
                  <div>
                    <label className="block text-xs font-black tracking-widest uppercase text-gray-400 mb-2">Security Code</label>
                    <input
                      type="text"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      className="w-full bg-gray-50 border border-gray-200 rounded-[20px] px-6 py-4 text-gray-900 font-black text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      disabled={isLoading}
                      autoFocus
                    />
                    <p className="text-center text-xs text-gray-400 font-bold mt-3">
                      Sent to +91 {phone} <button type="button" onClick={() => setStep(1)} className="text-red-500 underline ml-1">Edit</button>
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || otp.length < 4}
                    type="submit"
                    className="w-full bg-gray-900 text-white font-black py-4 rounded-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Sync Profile & Login <span>⚡</span></>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default Login;