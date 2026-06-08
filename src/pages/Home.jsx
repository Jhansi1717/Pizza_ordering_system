import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import api from "../services/api";
import PizzaCard from "../components/PizzaCard";
import OffersCarousel from "../components/OffersCarousel";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import DeliveryStatusBanner from "../components/DeliveryStatusBanner";
import FloatingAIAssistant from "../components/FloatingAIAssistant";
import SmartAIFeatures from "../components/SmartAIFeatures";

const EXTRA_PIZZAS = [
  "Mexican Green Wave", "Deluxe Veggie", "Indi Tandoori Paneer", "Chicken Fiesta Pizza", 
  "Double Cheese Margherita", "Spicy Chicken Pizza", "Mushroom Feast", "Peppy Paneer", "Veg Extravaganza",
  "Chicken Golden Delight", "Non Veg Supreme", "Cheese n Corn Pizza", "Fresh Veggie", 
  "Chicken Sausage Pizza", "Paneer Makhani", "Margherita Special", "Veggie Paradise", 
  "Meatzaa Pizza", "Keema Do Pyaza", "Veggie Supreme", "Chicken Dominator", "Non Veg Extravaganza",
  "Italian Pepperoni", "Four Cheese Supreme", "BBQ Chicken Classic"
].map((name, index) => {
  const isNonVeg = ["chicken", "meat", "pepperoni", "beef", "pork", "bacon", "keema", "non veg", "bbq", "sausage", "extravaganza"].some(kw => name.toLowerCase().includes(kw));
  return {
    id: 100 + index,
    name,
    base_type: index % 2 === 0 ? "Thin Crust" : "Pan",
    prep_time: 15 + (index % 10),
    price: 250 + (index * 10),
    isVeg: !isNonVeg,
    rating: (4.1 + (index % 9) / 10).toFixed(1)
  };
});

export default function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [loadingPizzas, setLoadingPizzas] = useState(true);
  const [filter, setFilter] = useState("All");
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  const pizzaX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const pizzaY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  
  const widgetX = useTransform(smoothX, [-0.5, 0.5], [25, -25]);
  const widgetY = useTransform(smoothY, [-0.5, 0.5], [25, -25]);
  
  const ingredientsX = useTransform(smoothX, [-0.5, 0.5], [35, -35]);
  const ingredientsY = useTransform(smoothY, [-0.5, 0.5], [35, -35]);

  useEffect(() => {
    api.get("/pizzas").then((res) => {
      let apiPizzas = [];
      if (res.data && res.data.data && res.data.data.pizzas) {
        apiPizzas = res.data.data.pizzas;
      } else {
        apiPizzas = res.data?.data || [];
      }
      
      const enrichedApiPizzas = apiPizzas.map((p, i) => {
        const isNonVeg = ["chicken", "meat", "pepperoni", "beef", "pork", "bacon", "keema", "non veg", "bbq", "sausage", "extravaganza"].some(kw => p.name.toLowerCase().includes(kw));
        return {
          ...p,
          isVeg: !isNonVeg,
          rating: (4.6 + i % 4 / 10).toFixed(1)
        };
      });

      const combined = [...enrichedApiPizzas, ...EXTRA_PIZZAS];
      const uniquePizzas = [...new Map(combined.map(p => [p.id, p])).values()];
      
      setPizzas(uniquePizzas);
      setLoadingPizzas(false);
    }).catch(err => {
      console.error(err);
      setPizzas(EXTRA_PIZZAS);
      setLoadingPizzas(false);
    });
  }, []);

  const handleQuickReorder = () => {
    const usual = pizzas.find(p => p.name === "Margherita Special") || EXTRA_PIZZAS[15];
    addToCart(usual);
    setIsCartOpen(true);
  };

  const filteredPizzas = pizzas.filter((p) => {
    if (filter === "Veg") return p.isVeg;
    if (filter === "Non-Veg") return !p.isVeg;
    return true;
  });

  return (
    <>
      <DeliveryStatusBanner />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="px-5 md:px-8 mt-4 lg:mt-6 mb-2"
      >
        <OffersCarousel />
      </motion.div>
      <FloatingAIAssistant />
      
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-gray-50 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-100/40 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/40 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1600px] mx-auto p-5 md:p-8"
        onMouseMove={handleMouseMove}
      >
        {/* Split Layout Hero Section */}
        <section className="relative min-h-[500px] lg:min-h-[600px] flex flex-col lg:flex-row items-center mb-16 rounded-[40px] bg-white border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.03)] overflow-hidden px-8 lg:px-16 py-12 gap-12">
          
          {/* Left: Content */}
          <div className="flex-1 w-full z-20 relative text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 px-4 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase mb-6 border border-red-100 shadow-sm"
            >
              <span className="text-sm">✨</span> AI-Powered Ordering
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-[36px] sm:text-[48px] lg:text-[72px] font-[800] leading-[1.05] tracking-tight text-gray-900 mb-6"
            >
              Smart <br className="hidden lg:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-red-500">
                Taste Match.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="text-lg lg:text-xl font-medium text-gray-500 max-w-md mx-auto lg:mx-0 leading-relaxed mb-10"
            >
              Experience the future of food delivery. Our AI analyzes your taste profile to curate the perfect slice, every single time.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button onClick={() => navigate("/menu")} className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                Explore Menu
              </button>
              <button onClick={() => setIsCartOpen(true)} className="bg-white text-gray-900 border border-gray-200 hover:border-gray-300 px-8 py-4 rounded-full font-bold text-lg shadow-sm transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 w-full sm:w-auto">
                View Cart
              </button>
            </motion.div>
          </div>

          {/* Right: Parallax Image & AI Widget */}
          <div className="flex-1 w-full relative min-h-[400px] flex items-center justify-center lg:justify-end">
            
            {/* Parallax Pizza Image */}
            <motion.div 
              style={{ x: pizzaX, y: pizzaY }}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] border-[8px] border-white"
            >
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" alt="Premium Pizza" className="w-full h-full object-cover" />
            </motion.div>

            {/* Floating Ingredients */}
            <motion.div style={{ x: ingredientsX, y: ingredientsY }} className="absolute inset-0 pointer-events-none z-0">
              <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] left-[10%] text-5xl opacity-25">🍅</motion.div>
              <motion.div animate={{ y: [10, -10, 10], rotate: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] left-[5%] text-4xl opacity-25">🌿</motion.div>
              <motion.div animate={{ y: [-5, 15, -5], rotate: [0, 25, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] right-[10%] text-3xl opacity-25">🧀</motion.div>
            </motion.div>

            {/* AI Recommendation Widget (Floating Glass Card) */}
            <motion.div 
              style={{ x: widgetX, y: widgetY }}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, type: "spring", bounce: 0.4 }}
              className="absolute -bottom-6 lg:-bottom-10 lg:-left-12 z-30 bg-white/70 backdrop-blur-2xl border border-white p-5 rounded-[24px] shadow-[0_20px_50px_rgb(0,0,0,0.1)] max-w-[280px]"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">AI Pick For You</span>
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">Margherita Special</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">98% Match</div>
                <span className="text-xs text-gray-400 font-medium line-clamp-1">Based on evening cravings</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleQuickReorder} className="flex-1 bg-red-50 text-red-600 font-bold text-xs py-2 rounded-xl hover:bg-red-100 transition-colors">Order Now</button>
              </div>
              
              {/* Pulse Glow Effect */}
              <motion.div animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute inset-0 border-2 border-red-300 rounded-[24px] z-[-1] pointer-events-none" />
            </motion.div>
            
          </div>
        </section>

        {/* Today's AI Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-[32px] border border-gray-100 shadow-[0_15px_40px_rgb(0,0,0,0.04)] mb-12 p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12 group overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Pizza Image Container */}
          <div className="w-full md:w-1/3 relative flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }} 
              transition={{ duration: 0.5 }}
              className="relative z-10 w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] rounded-full shadow-2xl border-4 border-white overflow-hidden"
            >
              <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80" alt="Recommendation" className="w-full h-full object-cover" />
            </motion.div>
            
            {/* Floating Match Badge */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 md:right-0 bg-gradient-to-br from-red-500 to-orange-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow-lg border-2 border-white z-20 flex items-center gap-1"
            >
              <span className="animate-pulse">✨</span> 96% MATCH
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 w-full text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-red-100">
              Today's Top AI Pick
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">Spicy Chicken Inferno</h2>
            <p className="text-gray-500 font-medium mb-6 leading-relaxed max-w-xl mx-auto md:mx-0">
              Based on your love for extra spice and Friday night chicken cravings. Our neural network predicts this will be your new favorite.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 lg:gap-8 mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calories</span>
                <span className="text-lg font-bold text-gray-800 flex items-center gap-1">🔥 850 kcal</span>
              </div>
              <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prep Time</span>
                <span className="text-lg font-bold text-gray-800 flex items-center gap-1">⏱ 20 Mins</span>
              </div>
              <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                <span className="text-2xl font-black text-gray-900">₹450</span>
              </div>
            </div>

            <button 
              onClick={() => handleQuickReorder()}
              className="bg-gray-900 text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_10px_20px_rgb(0,0,0,0.15)] hover:bg-black hover:shadow-[0_15px_30px_rgb(0,0,0,0.2)] transition-all active:scale-95 w-full md:w-auto"
            >
              Order Now
            </button>
          </div>
        </motion.div>

        {/* Quick Actions - Horizontally aligned */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 lg:gap-6 mb-12 w-full justify-between"
        >
          <motion.button 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onClick={handleQuickReorder} whileHover={{ scale: 1.03, y: -4, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }} whileTap={{ scale: 0.98 }} 
            className="flex-1 flex items-center gap-4 bg-white px-6 py-5 rounded-2xl font-bold shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all group"
          >
            <motion.div whileHover={{ rotate: 15 }} className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl transition-transform shrink-0">⚡</motion.div>
            <div className="flex flex-col items-start"><span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quick Action</span><span className="text-gray-800 text-lg whitespace-nowrap">Reorder Last</span></div>
          </motion.button>
          
          <motion.button 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onClick={handleQuickReorder} whileHover={{ scale: 1.03, y: -4, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }} whileTap={{ scale: 0.98 }} 
            className="flex-1 flex items-center gap-4 bg-white px-6 py-5 rounded-2xl font-bold shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all group"
          >
            <motion.div whileHover={{ rotate: -15 }} className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl transition-transform shrink-0">📅</motion.div>
            <div className="flex flex-col items-start"><span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Schedule</span><span className="text-gray-800 text-lg whitespace-nowrap">Repeat Friday</span></div>
          </motion.button>
          
          <motion.button 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onClick={handleQuickReorder} whileHover={{ scale: 1.03, y: -4, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }} whileTap={{ scale: 0.98 }} 
            className="flex-1 flex items-center gap-4 bg-white px-6 py-5 rounded-2xl font-bold shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all group"
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center text-xl transition-transform shrink-0">✨</motion.div>
            <div className="flex flex-col items-start"><span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Favorite</span><span className="text-gray-800 text-lg whitespace-nowrap">Your Usual</span></div>
          </motion.button>
        </motion.div>
      </motion.div>


      {/* AI Recommendation Section */}
      <div className="mb-14">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Recommended for you <span className="text-2xl">🍕</span>
          </h2>
          <p className="text-gray-500 font-bold text-sm mt-1">Based on your past orders</p>
        </div>
        
        {loadingPizzas ? (
          <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.slice(0, 3).map((pizza) => (
               <div key={`rec-${pizza.id}`} className="relative">
                 <div className="absolute -top-3 -left-3 z-10 text-3xl animate-bounce">✨</div>
                 <PizzaCard pizza={pizza} />
               </div>
            ))}
          </div>
        )}
      </div>

      <SmartAIFeatures />

    </>

  );
}