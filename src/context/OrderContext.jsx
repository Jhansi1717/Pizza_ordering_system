import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const userId = localStorage.getItem("user_id");

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setLoadingOrders(false);
      return;
    }
    setLoadingOrders(true);
    try {
      const res = await api.get(`/orders?user_id=${userId}`);
      setOrders(res.data?.data?.orders || []);
    } catch (e) {
      console.error("Failed to fetch orders via Context", e);
    } finally {
      setLoadingOrders(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrderLocally = (newOrder) => {
    // Prepend the new order conceptually
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, setOrders, loadingOrders, fetchOrders, addOrderLocally }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
