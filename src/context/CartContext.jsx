import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (pizza) => {
    const cartItemId = pizza.cartItemId || pizza.id;
    setCartItems((prev) => {
      const exists = prev.find((item) => (item.cartItemId || item.id) === cartItemId);
      if (exists) {
        return prev.map((item) =>
          (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, quantity: 1, cartItemId }];
    });
    toast.success(`${pizza.name} added to cart!`, {
      icon: '🍕',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontWeight: 'bold'
      },
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        (item.cartItemId || item.id) === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);
  
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, addToCart, updateQuantity, clearCart, toggleCart, setIsCartOpen, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
