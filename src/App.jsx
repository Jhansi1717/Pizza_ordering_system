import { Navigate, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PreOrder from "./pages/PreOrder";
import Subscription from "./pages/Subscription";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import SmartReminder from "./components/SmartReminder";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

import { Toaster } from 'react-hot-toast';

import Footer from "./components/Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-x-hidden">
      <Navbar />
      <SmartReminder />
      <Cart />
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

import Menu from "./pages/Menu";

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/preorder" element={<ProtectedRoute><PreOrder /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;
