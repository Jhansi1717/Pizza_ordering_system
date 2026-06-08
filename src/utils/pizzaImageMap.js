export const pizzaImageMap = {
  "Margherita": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80",
  "Farmhouse": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  "Pepperoni": "https://images.unsplash.com/photo-1548365328-9f547fb0953d?auto=format&fit=crop&w=400&q=80",
  "Veggie Delight": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80",
  "BBQ Chicken": "https://images.unsplash.com/photo-1601924579527-5e0d7e5e8a53?auto=format&fit=crop&w=400&q=80",
  "Mexican Green Wave": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=400&q=80",
  "Deluxe Veggie": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=400&q=80",
  "Indi Tandoori Paneer": "https://images.unsplash.com/photo-1620374645313-61c34c1d32c3?auto=format&fit=crop&w=400&q=80",
  "Chicken Fiesta": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
  "Double Cheese": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  "Spicy Chicken": "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=400&q=80",
  "Mushroom Feast": "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=400&q=80",
  "Peppy Paneer": "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&q=80",
  "Veg Extravaganza": "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80",
  "Chicken Golden Delight": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=400&q=80",
  "Non Veg Supreme": "https://images.unsplash.com/photo-1585238342024-78d387fbf32d?auto=format&fit=crop&w=400&q=80",
  "Cheese n Corn": "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=400&q=80",
  "Fresh Veggie": "https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&w=400&q=80",
  "Chicken Sausage": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
  "Paneer Makhani": "https://images.unsplash.com/photo-1604367980998-0c679237b67b?auto=format&fit=crop&w=400&q=80",
  "Margherita Special": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80",
  "Veggie Paradise": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  "Meatzaa": "https://images.unsplash.com/photo-1601924582975-7e4c5f8b6b5e?auto=format&fit=crop&w=400&q=80",
  "Keema Do Pyaza": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80",
  "Veggie Supreme": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=400&q=80",
  "Chicken Dominator": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
  "ExtravaganZZa": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  "Italian Pepperoni": "https://images.unsplash.com/photo-1548365328-9f547fb0953d?auto=format&fit=crop&w=400&q=80",
  "Four Cheese Supreme": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=400&q=80",
  "BBQ Chicken Classic": "https://images.unsplash.com/photo-1601924579527-5e0d7e5e8a53?auto=format&fit=crop&w=400&q=80"
};

export function getPizzaImage(pizza) {
  return pizzaImageMap[pizza?.name] || 
    "https://images.unsplash.com/photo-1601924582975-7e4c5f8b6b5e?auto=format&fit=crop&w=400&q=80";
}
