import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getPizzaImage } from "../utils/getPizzaImage";

export default function PizzaCustomizerModal({ pizza, isOpen, onClose, onAddToCart }) {
  const [size, setSize] = useState("Medium");
  const [crust, setCrust] = useState("Classic Hand Tossed");
  const [toppings, setToppings] = useState([]);

  if (!isOpen || !pizza) return null;

  const sizeOptions = [
    { name: "Regular", price: 0 },
    { name: "Medium", price: 100 },
    { name: "Large", price: 200 }
  ];

  const crustOptions = [
    { name: "Classic Hand Tossed", price: 0 },
    { name: "Thin Crust", price: 30 },
    { name: "Cheese Burst", price: 120 }
  ];

  const toppingOptions = [
    { name: "Extra Cheese", price: 50 },
    { name: "Black Olives", price: 30 },
    { name: "Jalapenos", price: 30 },
    { name: "Grilled Mushrooms", price: 40 }
  ];

  const toggleTopping = (toppingName) => {
    if (toppings.includes(toppingName)) {
      setToppings(toppings.filter(t => t !== toppingName));
    } else {
      setToppings([...toppings, toppingName]);
    }
  };

  const calculateTotal = () => {
    let total = pizza.price;
    total += sizeOptions.find(s => s.name === size)?.price || 0;
    total += crustOptions.find(c => c.name === crust)?.price || 0;
    toppings.forEach(tName => {
      total += toppingOptions.find(t => t.name === tName)?.price || 0;
    });
    return total;
  };

  const handleAdd = () => {
    const finalPrice = calculateTotal();
    const cartItemId = `${pizza.id}-${size}-${crust}-${toppings.join(",")}`;
    const customizedPizza = {
      ...pizza,
      price: finalPrice,
      cartItemId: cartItemId,
      customizations: { size, crust, toppings }
    };
    onAddToCart(customizedPizza);
    onClose();
  };

  const imageUrl = getPizzaImage(pizza);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-[90vw] max-w-[500px] h-auto max-h-[90vh] bg-white z-[60] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Image */}
            <div className="relative h-48 bg-gray-100 shrink-0">
              <img src={imageUrl} alt={pizza.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full text-white font-bold flex items-center justify-center hover:bg-white/40 transition-colors">✕</button>
              <div className="absolute bottom-4 left-5">
                <h2 className="text-2xl font-black text-white">{pizza.name}</h2>
                <p className="text-white/80 text-sm font-medium">{pizza.isVeg ? "🟩 Pure Veg" : "🟥 Non-Veg"}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50">
              
              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Choose Size</h3>
                <div className="flex gap-2">
                  {sizeOptions.map(opt => (
                    <button 
                      key={opt.name}
                      onClick={() => setSize(opt.name)}
                      className={`flex-1 py-3 px-2 rounded-xl font-bold border-2 transition-all ${size === opt.name ? 'border-primary bg-red-50 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      <div className="text-sm">{opt.name}</div>
                      <div className="text-xs mt-0.5 opacity-80">{opt.price > 0 ? `+₹${opt.price}` : 'Base'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crust Selection */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Choose Crust</h3>
                <div className="space-y-2">
                  {crustOptions.map(opt => (
                    <button 
                      key={opt.name}
                      onClick={() => setCrust(opt.name)}
                      className={`w-full flex justify-between items-center py-3 px-4 rounded-xl font-bold border-2 transition-all ${crust === opt.name ? 'border-primary bg-red-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
                    >
                      <span>{opt.name}</span>
                      <span className="text-sm">{opt.price > 0 ? `+₹${opt.price}` : 'Free'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Selection */}
              <div className="mb-2">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Add Extra Toppings</h3>
                <div className="grid grid-cols-2 gap-2">
                  {toppingOptions.map(opt => {
                    const isSelected = toppings.includes(opt.name);
                    return (
                      <button 
                        key={opt.name}
                        onClick={() => toggleTopping(opt.name)}
                        className={`flex flex-col items-start p-3 rounded-xl font-bold border-2 transition-all ${isSelected ? 'border-primary bg-red-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
                      >
                        <div className="flex justify-between w-full">
                          <span className="text-sm">{opt.name}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                            {isSelected && <span className="text-[10px]">✓</span>}
                          </div>
                        </div>
                        <span className="text-xs mt-1 opacity-80">+₹{opt.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold tracking-wide py-4 rounded-2xl shadow-lg shadow-red-500/30 flex justify-between px-6"
              >
                <span>Add to Cart</span>
                <span>₹{calculateTotal()}</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
