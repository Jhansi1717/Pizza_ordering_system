# 🍕 SliceMind - AI-Powered Pizza Delivery

Welcome to **SliceMind**, the world's first AI-powered pizza delivery experience! We predict your cravings before you do.

SliceMind is a premium, full-stack web application featuring stunning glassmorphic UI, fluid animations, an AI Chatbot, and a robust FastAPI backend.

---

## ✨ Features (The Premium Experience)

- 🎨 **Sleek Aesthetic:** Beautiful dark-mode UI with fluid `framer-motion` micro-animations and glowing glassmorphism effects.
- 📱 **Native-Feel Login:** Passwordless OTP Authentication with OS-level autofill support (`autoComplete="one-time-code"`).
- 📍 **Smart Location:** Auto-fetches your real-world neighborhood and city using the OpenStreetMap Geocoding API.
- 🛸 **Live Drone Tracking:** A fully animated radar dashboard that tracks your active "Drone Deliveries" in real-time.
- 🤖 **Neural AI Assistant:** A built-in AI chatbot to help you pick the perfect pizza based on your taste profile.
- 📄 **1-Tap Reorder History:** A beautiful receipt-style order history with instant reordering and downloadable invoices.
- ⚡ **Demo Mode Fallback:** A bulletproof fallback system. If the backend is ever offline, the frontend automatically switches to "Demo Mode", simulating network requests, API responses, and checkout flows perfectly so you can always showcase the app!

---

## 🛠️ Technology Stack

**Frontend:**
- React 19 + Vite ⚡
- Tailwind CSS 4.0 (for atomic, premium styling)
- Framer Motion (for fluid animations)
- React Router DOM
- React Hot Toast

**Backend:**
- Python 3.11+
- FastAPI + Uvicorn (Ultra-fast API framework)
- SQLite (`pizza.db` included out-of-the-box) or PostgreSQL

---

## 🚀 Getting Started (Run Locally)

The easiest way to experience SliceMind is to run both the Frontend and Backend servers simultaneously.

### 1. Start the Backend (Core Engine)
Open a terminal in the project root:
```bash
# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server (runs on http://localhost:8000)
npm run backend
```
*(Note: The `npm run backend` script maps to `uvicorn app.main:app --host 0.0.0.0 --reload --port 8000`)*

### 2. Start the Frontend
Open a **second** terminal in the project root:
```bash
# Install dependencies
npm install

# Start the Vite Dev Server (runs on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser. 

---

## 🌐 Deploying to Production

SliceMind is fully configured and 100% ready to deploy to the cloud!

### Deploying the Backend (Render / Railway)
The backend includes a `Procfile` and `requirements.txt` out-of-the-box.
1. Connect this GitHub repository to Render (or Railway).
2. Create a new **Web Service**.
3. It will automatically detect Python, install `requirements.txt`, and run the `Procfile` command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`.
4. Copy the live URL (e.g. `https://slicemind-api.onrender.com`).

### Deploying the Frontend (Vercel / Netlify)
1. Connect this GitHub repository to Vercel.
2. Vercel will automatically detect it as a **Vite** project.
3. In the Vercel Environment Variables settings, add:
   - `VITE_API_URL` = `<your_live_backend_url>` (from the step above)
4. Hit Deploy! 🚀

---

## 🧪 Testing "Demo Mode" (No Backend Required)

Want to show off the UI but don't want to spin up a backend server? We've got you covered.

SliceMind features a robust **Demo Mode**. Simply run the frontend (`npm run dev`) and leave the backend completely offline. 
- The login screen will automatically bypass the database and let you in (Use OTP code `1234`).
- The Checkout cart will simulate a successful payment and route you to the Drone Tracker.
- The AI Chatbot will serve realistic, mocked recommendations. 

Enjoy your pizza! 🍕
