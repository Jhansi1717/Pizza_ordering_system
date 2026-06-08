import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

export default function Cart() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, cartTotal, clearCart } = useCart();
  const { addOrderLocally, fetchOrders } = useOrder();
  const [loading, setLoading] = useState(false);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: "", phone: "", address: "", payment: "" });
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    if (!checkoutData.payment) {
      alert("Please select a payment method before confirming the order.");
      return;
    }
    
    setLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      
      const payload = {
        user_id: Number(userId),
        items: cartItems.map(item => ({
          pizza_id: item.id >= 100 ? 1 : item.id, // mocked backend hack for new custom ids
          quantity: item.quantity
        }))
      };

      const res = await api.post("/orders", payload);
      
      const newOrder = res.data?.data?.order || {
        id: Math.floor(Math.random() * 10000),
        status: "CONFIRMED",
        total_price: cartTotal + Math.round(cartTotal * 0.05) + 10 + 40,
        items: cartItems
      };
      
      addOrderLocally(newOrder);
      fetchOrders();
      
      clearCart();
      setIsCartOpen(false);
      setIsCheckoutMode(false);
      alert("🎉 Order Placed Successfully! We're tracking it now.");
      navigate("/orders");
    } catch (error) {
      console.warn("Backend not found, using Demo Mode for checkout.");
      const demoOrder = {
        id: Math.floor(Math.random() * 10000),
        status: "CONFIRMED",
        total_price: cartTotal + Math.round(cartTotal * 0.05) + 10 + 40,
        items: cartItems
      };
      
      addOrderLocally(demoOrder);
      
      clearCart();
      setIsCartOpen(false);
      setIsCheckoutMode(false);
      alert("🎉 (Demo) Order Placed Successfully! We're tracking it now.");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setIsCheckoutMode(false), 300);
  };

  const getMultiplier = () => isBulkMode ? 10 : 1;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={closeCart}
          />
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[450px] max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 h-[88px]">
              {isCheckoutMode ? (
                 <button onClick={() => setIsCheckoutMode(false)} className="text-gray-500 font-bold hover:text-gray-900 transition-colors flex items-center gap-2">
                   <span>←</span> Back to Cart
                 </button>
               ) : (
                 <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart</h2>
                   <div className="flex items-center mt-1 gap-2">
                     <span className="text-xs font-bold text-gray-500">Bulk Mode (x10)</span>
                     <button 
                       onClick={() => setIsBulkMode(!isBulkMode)} 
                       className={`w-10 h-5 rounded-full relative transition-colors ${isBulkMode ? 'bg-primary' : 'bg-gray-300'}`}
                     >
                       <motion.div layout className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${isBulkMode ? 'right-0.5' : 'left-0.5'}`}/>
                     </button>
                   </div>
                 </div>
               )}
              <button onClick={closeCart} className="text-gray-400 hover:text-red-500 font-bold text-2xl transition-colors self-start">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {!isCheckoutMode ? (
                <>
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <span className="text-6xl mb-4 grayscale opacity-50">🛒</span>
                      <p className="text-lg font-bold">Your cart is empty</p>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {isBulkMode && (
                        <div className="bg-green-50 text-green-700 text-xs font-bold text-center py-2 rounded-lg border border-green-100 animate-pulse mb-2">
                           Bulk mode enabled! Use + to add exactly 10 quantities at once.
                        </div>
                      )}
                      {cartItems.map((item) => (
                        <div key={item.cartItemId || item.id} className="flex gap-4 p-4 bg-gray-50 rounded-[20px] border border-gray-100">
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-800 leading-tight pr-2">
                                  {item.name} <span className="text-[10px] align-top">{item.isVeg ? "🟢" : "🔴"}</span>
                                </span>
                                {item.customizations && (
                                  <div className="text-xs text-gray-500 mt-1 font-medium">
                                    {item.customizations.size} • {item.customizations.crust}
                                    {item.customizations.toppings?.length > 0 && ` • +${item.customizations.toppings.length} extras`}
                                  </div>
                                )}
                              </div>
                              <span className="font-extrabold text-primary">₹{item.price * item.quantity}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-auto">
                              <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                <button className="px-3 py-1 font-bold hover:bg-gray-100 text-gray-600 transition-colors" onClick={() => updateQuantity(item.cartItemId || item.id, -getMultiplier())}>-</button>
                                <span className="px-3 py-1 font-bold text-gray-900 border-x border-gray-200 min-w-[32px] text-center">{item.quantity}</span>
                                <button className="px-3 py-1 font-bold hover:bg-gray-100 text-gray-600 transition-colors" onClick={() => updateQuantity(item.cartItemId || item.id, getMultiplier())}>+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Checkout Details</h2>
                  
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input autoFocus className="w-full mt-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-semibold focus:border-primary focus:outline-none transition-colors" value={checkoutData.name} onChange={e=>setCheckoutData({...checkoutData, name: e.target.value})} placeholder="e.g. John Doe" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                    <input type="tel" className="w-full mt-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-semibold focus:border-primary focus:outline-none transition-colors" value={checkoutData.phone} onChange={e=>setCheckoutData({...checkoutData, phone: e.target.value})} placeholder="e.g. +91 99999 99999" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Delivery Address</label>
                    <textarea className="w-full mt-1 border-2 border-gray-200 rounded-xl px-4 py-3 font-semibold focus:border-primary focus:outline-none transition-colors h-24 resize-none" value={checkoutData.address} onChange={e=>setCheckoutData({...checkoutData, address: e.target.value})} placeholder="123 Pizza Street..." />
                  </div>
                  
                  <div className="pt-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block pl-1">Select Payment (Mandatory)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["UPI", "Cash on Delivery"].map(method => (
                         <button key={method} onClick={() => setCheckoutData({...checkoutData, payment: method})} className={`py-4 rounded-xl font-bold border-2 transition-all ${checkoutData.payment === method ? 'border-primary bg-red-50 text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{method}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="space-y-2 mb-4 text-sm font-semibold text-gray-500 tracking-wide">
                  <div className="flex justify-between"><span>Subtotal {isBulkMode && "🔥 (Bulk)"}</span><span className="text-gray-800">₹{cartTotal}</span></div>
                  <div className="flex justify-between"><span>GST (5%)</span><span className="text-gray-800">₹{Math.round(cartTotal * 0.05)}</span></div>
                  <div className="flex justify-between"><span>Platform Fee</span><span className="text-gray-800">₹10</span></div>
                  <div className="flex justify-between"><span>Delivery Partner Fee</span><span className="text-gray-800">₹40</span></div>
                </div>
                
                <div className="flex justify-between font-black text-xl mb-6 pt-4 border-t border-gray-200">
                  <span className="text-gray-900">Grand Total</span>
                  <span className="text-primary">₹{cartTotal + Math.round(cartTotal * 0.05) + 10 + 40}</span>
                </div>
                
                {!isCheckoutMode ? (
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCheckoutMode(true)}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold tracking-wide py-4 rounded-xl shadow-lg shadow-red-500/30"
                  >
                    Proceed to Checkout
                  </motion.button>
                ) : (
                  <motion.button 
                    whileHover={(!loading && checkoutData.name && checkoutData.phone && checkoutData.address && checkoutData.payment) ? { scale: 1.02 } : {}} 
                    whileTap={(!loading && checkoutData.name && checkoutData.phone && checkoutData.address && checkoutData.payment) ? { scale: 0.98 } : {}}
                    onClick={handlePlaceOrder}
                    disabled={loading || !checkoutData.name || !checkoutData.phone || !checkoutData.address || !checkoutData.payment}
                    className="w-full bg-gray-900 text-white font-extrabold tracking-wide py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                  >
                    {loading ? "Processing..." : `Confirm & Pay ₹${cartTotal + Math.round(cartTotal * 0.05) + 10 + 40}`}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
