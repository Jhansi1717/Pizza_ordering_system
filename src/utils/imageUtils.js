const CURATED_IMAGES = {
  "Margherita Special": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80",
  "Italian Pepperoni": "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80",
  "Double Cheese": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  "Veg Extravaganza": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=400&q=80",
  "BBQ Chicken Classic": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
  "Spicy Chicken": "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&q=80"
};

export function getPizzaImage(pizza) {
  if (!pizza) return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";

  // Check for curated map first
  if (CURATED_IMAGES[pizza.name]) {
    return CURATED_IMAGES[pizza.name];
  }

  // Fallback to Unsplash dynamic with signature to defeat cache
  const query = (pizza.name || "pizza").replace(/\s+/g, ',').toLowerCase();
  return `https://source.unsplash.com/400x300/?pizza,${query}&sig=${pizza.id}`;
}
