import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e) {}
    }
    return [{ role: "bot", text: "Hi! How can I help you with your cravings today? 🍕", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("user_id");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    const initialMessage = [{ role: "bot", text: "Hi! How can I help you with your cravings today? 🍕", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
    setMessages(initialMessage);
    localStorage.setItem("chat_messages", JSON.stringify(initialMessage));
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userText = message.trim();
    const timeNow = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    setMessages((prev) => [...prev, { role: "user", text: userText, time: timeNow }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/chat/query", {
        user_id: Number(userId),
        message: userText,
      });
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data?.data?.response || "I didn't quite get that.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
      ]);
    } catch (error) {
      console.warn("Backend not found, using Demo Mode AI response.");
      const demoResponses = [
        "Based on your profile, I recommend the Triple Pepperoni. It's an 89% match for you! 🍕",
        "Sure thing! I can add a Margherita Special to your cart if you'd like. Want me to do that?",
        "Our drones are fully charged and ready for your order. What are you craving today?",
        "I'm currently operating in Demo Mode, but I'm still learning your taste preferences! 🧠"
      ];
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: randomResponse, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col w-full max-w-3xl mx-auto"
    >
      <div className="bg-white/90 backdrop-blur-xl flex-1 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col overflow-hidden relative">
        
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/30">
              🍕
            </div>
            <div>
              <h2 className="font-extrabold tracking-tight text-xl">SliceMind</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <p className="text-xs font-medium text-white/90 uppercase tracking-wider">Online</p>
              </div>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
            Clear
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 relative z-10 custom-scrollbar bg-slate-50">
          {messages.map((m, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div 
                className={`max-w-[80%] px-5 py-3.5 text-[15px] font-medium leading-relaxed relative shadow-sm ${
                  m.role === "user" 
                    ? "bg-gradient-to-br from-red-500 to-red-600 text-white rounded-[24px] rounded-tr-[4px]" 
                    : "bg-white text-gray-700 rounded-[24px] rounded-tl-[4px] border border-gray-100"
                }`}
              >
                <span>{m.text}</span>
              </div>
              <span className="text-[11px] text-gray-400 mt-1.5 font-medium px-1">
                {m.time}
              </span>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="bg-white px-5 py-4 rounded-[24px] rounded-tl-[4px] shadow-sm border border-gray-100 flex gap-2 items-center">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Modern Input */}
        <div className="p-4 bg-white border-t border-gray-100 relative z-10">
          <div className="flex gap-3 items-center bg-slate-50 p-2 rounded-full border border-gray-200 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-50 transition-all">
            <input
              className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-700 font-medium placeholder-gray-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Ask for pizza recommendations..."
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage} 
              disabled={loading || !message.trim()}
              className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:shadow-none transition-all mr-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
