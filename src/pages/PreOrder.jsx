import { useEffect, useState } from "react";
import api from "../services/api";
function PreOrder() {
  const [preorders, setPreorders] = useState([]);
  const [pizzasById, setPizzasById] = useState({});
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("user_id");

  const loadPreorders = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/preorders?user_id=${userId}`);
      setPreorders(res.data?.data?.preorders || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load preorders");
    }
  };

  const loadPizzas = async () => {
    try {
      const res = await api.get("/pizzas");
      const pizzas = res.data?.data?.pizzas || [];
      const mapping = {};
      pizzas.forEach((pizza) => {
        mapping[pizza.id] = pizza.name;
      });
      setPizzasById(mapping);
    } catch {
      // Keep UI usable even if pizza names fail.
    }
  };

  const confirmPreorder = async (id) => {
    try {
      await api.post(`/preorders/${id}/confirm`);
      setMessage("PreOrder confirmed");
      loadPreorders();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to confirm preorder");
    }
  };

  const cancelPreorder = async (id) => {
    try {
      await api.post(`/preorders/${id}/cancel`);
      setMessage("PreOrder cancelled");
      loadPreorders();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to cancel preorder");
    }
  };

  useEffect(() => {
    loadPreorders();
    loadPizzas();
  }, []);

  return (
    <div className="bg-gray-50 flex-1 p-5 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">PreOrders</h1>
        {preorders.length === 0 && <p className="text-gray-700">No active preorders</p>}
        <div className="space-y-3">
          {preorders.map((preorder) => {
            const firstItem = preorder.suggested_items?.[0];
            const pizzaName = pizzasById[firstItem?.pizza_id] || `Pizza #${firstItem?.pizza_id}`;
            return (
              <div key={preorder.id} className="bg-white border rounded-lg p-4 space-y-2">
                <p className="font-medium">{pizzaName}</p>
                <p className="text-sm text-gray-600">Status: {preorder.status}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => confirmPreorder(preorder.id)}
                    className="bg-green-600 text-white rounded px-3 py-2 text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => cancelPreorder(preorder.id)}
                    className="bg-red-600 text-white rounded px-3 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

export default PreOrder;
