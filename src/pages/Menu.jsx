import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import PizzaCard from "../components/PizzaCard";

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

export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [loadingPizzas, setLoadingPizzas] = useState(true);
  const [filter, setFilter] = useState("All");

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

  const filteredPizzas = pizzas.filter((p) => {
    if (filter === "Veg") return p.isVeg;
    if (filter === "Non-Veg") return !p.isVeg;
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1600px] mx-auto p-5 md:p-8 mt-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Full Menu</h2>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {["All", "Veg", "Non-Veg"].map((f) => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-6 py-2 rounded-full font-bold shadow-sm transition-colors text-sm ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {f === "Veg" ? "🟢 " : f === "Non-Veg" ? "🔴 " : ""}{f}
            </motion.button>
          ))}
        </div>
      </div>

      {loadingPizzas ? (
        <div className="flex justify-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
             <p className="font-bold text-gray-500 animate-pulse">Baking fresh pizzas...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
