# 🍕 SliceMind — Pizza Ordering System

A full-stack pizza ordering web application built with React 19 + Vite on the frontend and FastAPI + SQLAlchemy on the backend.

> **Current scope:** This is a functional demo/coursework project. It does not currently provide real SMS OTP delivery, real payment processing, live driver/drone tracking, or an LLM-powered assistant.

## What is implemented

- Phone-number login with a fixed demo OTP (`1234`).
- Pizza menu retrieval from `GET /pizzas`.
- Pizza customization for size, crust, and extra toppings.
- Client-side cart state and quantity management.
- Order creation through `POST /orders`.
- BASIC and PRO subscription records.
- Pre-order generation, confirmation, cancellation, expiry, and delivery-slot scheduling.
- Rule-based pizza recommendations from recorded order events.
- Rule-based chat for order-status, delivery-time, and subscription-credit questions.
- Browser geolocation with OpenStreetMap Nominatim reverse geocoding on the home page.
- React Router navigation and Vite PWA configuration.
- Framer Motion animations and React Hot Toast notifications.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Tailwind CSS 4 |
| Animation / UX | Framer Motion, React Hot Toast |
| HTTP client | Axios |
| Backend | Python, FastAPI, Uvicorn |
| ORM | SQLAlchemy |
| Database | PostgreSQL when `DATABASE_URL` is configured; SQLite is also supported for local development |
| PWA | vite-plugin-pwa |

Exact dependency versions are defined in `package.json` and `requirements.txt`.

## Core flow

```text
Phone number
    ↓
POST /auth/login
    ↓
Enter OTP 1234
    ↓
POST /auth/verify-otp
    ↓
Store user_id in localStorage
    ↓
Home
    ↓
Menu → Customize → Cart
    ↓
POST /orders
    ↓
Orders
```

Additional flows:

```text
Home → PreOrder → Recommendation → Confirm / Cancel
Home → Subscription → BASIC / PRO
Home → Chat → Rule-based assistant
```

## Seeded backend menu

When the pizza table is empty, the backend seeds five pizzas:

| Pizza | Base | Preparation | Price |
|---|---|---:|---:|
| Margherita | Thin Crust | 15 min | ₹199 |
| Farmhouse | Pan | 18 min | ₹249 |
| Pepperoni | Cheese Burst | 20 min | ₹299 |
| Veggie Delight | Thin Crust | 17 min | ₹229 |
| BBQ Chicken | Pan | 22 min | ₹319 |

The frontend also contains additional static pizza entries and combines them with API results.

## Pizza customization

**Sizes**
- Regular: +₹0
- Medium: +₹100
- Large: +₹200

**Crusts**
- Classic Hand Tossed: +₹0
- Thin Crust: +₹30
- Cheese Burst: +₹120

**Toppings**
- Extra Cheese: +₹50
- Black Olives: +₹30
- Jalapenos: +₹30
- Grilled Mushrooms: +₹40

The customized price is calculated in frontend state and the customization metadata is retained in the cart item.

## Orders and history

The backend currently exposes:

- `POST /orders`
- `GET /orders/{order_id}`

Order creation validates the user and pizza IDs, creates an order, creates order-item rows, records an `order_created` event, applies eligible subscription-credit deduction, and commits the transaction.

The frontend `OrderContext` also requests `GET /orders?user_id=...`, but that collection endpoint is not currently implemented in the backend. Therefore the persistent order-list/history flow has a known integration gap.

The active-order page also contains animated delivery visuals and an invoice action that are presentation-oriented; there is no live dispatch or invoice-generation service in the backend.

## Subscriptions

| Plan | Credits | Duration |
|---|---:|---:|
| BASIC | 2 pizzas | 7 days |
| PRO | 5 pizzas | 7 days |

There is no external billing or payment gateway.

## Pre-orders and scheduling

- Pending pre-orders expire after 15 minutes.
- A pre-order can be confirmed or cancelled.
- Delivery slots are generated every 15 minutes for a rolling 24-hour window.
- Each slot has capacity 20.
- Confirming a pre-order creates an order and increments slot usage.

## Recommendation engine

The recommendation service is **rule-based**, not a machine-learning model.

It uses `order_created` events to prefer pizzas previously ordered by the user near the current UTC hour, then falls back to the most frequently ordered pizza globally and finally to the first pizza in the database.

## Chat assistant

The backend assistant is **keyword based**. It currently handles:

| Intent | Keywords |
|---|---|
| Order status | `order`, `status`, `where` |
| Delivery time | `when`, `arrive`, `eta` |
| Subscription credits | `credits`, `balance` |

It does not call an LLM API or autonomously place an order. The frontend also contains demo fallback responses when the API request fails.

## Location and delivery UI

The home page requests browser geolocation and reverse-geocodes coordinates through OpenStreetMap Nominatim.

The active-order screen contains animated radar/drone-style visuals and fixed ETA text. These are UI simulations. The repository has no live driver/drone/GPS/dispatch service.

A hard-coded fallback address exists for location failures and should be treated as demo data only.

## Authentication limitation

The backend uses:

```python
VALID_OTP = "1234"
```

No SMS provider, OTP expiry, rate limiting, or production identity verification is configured.

## API reference

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Start phone login |
| POST | `/auth/verify-otp` | Verify demo OTP |
| GET | `/pizzas` | List pizzas |
| POST | `/orders` | Create order |
| GET | `/orders/{order_id}` | Get one order |
| POST | `/preorders/generate` | Generate pre-order |
| GET | `/preorders?user_id=...` | List active pre-orders |
| POST | `/preorders/{id}/confirm` | Confirm pre-order |
| POST | `/preorders/{id}/cancel` | Cancel pre-order |
| POST | `/subscriptions` | Create/replace subscription |
| GET | `/subscriptions/me?user_id=...` | Get subscription |
| GET | `/recommendation?user_id=...` | Get recommendation |
| POST | `/chat/query` | Query assistant |

When the backend is running locally, FastAPI interactive docs are available at:

```text
http://localhost:8000/docs
```

## Run locally

### Backend

```bash
python -m venv venv

# Windows
venv\\Scripts\\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --reload --port 8000
```

### Frontend

Open another terminal in the repository root:

```bash
npm install
npm run dev
```

Vite normally serves the frontend at:

```text
http://localhost:5173
```

### Environment

```env
DATABASE_URL=postgresql+psycopg2://...
VITE_API_URL=http://localhost:8000
```

Do not commit real credentials.

## Deployment

The repository contains a Python `Procfile`:

```text
web: uvicorn app.main:app --host 0.0.0.0 --port 10000
```

There is no provider-specific Render/Vercel/Netlify deployment configuration in this repository. The project documentation therefore does not claim a specific active cloud deployment.

For production use, additional infrastructure is required for real OTP delivery, payments, secure authentication/session management, monitoring, backups, rate limiting, and deployment-specific configuration.

## Security and production limitations

Current implementation details include:

- SQLAlchemy ORM for database access.
- CORS configured with all origins and credentials disabled.
- `user_id` stored in browser `localStorage`.
- Several endpoints accept `user_id` directly from the client.
- No rate limiting.
- Fixed demo OTP.
- No external payment provider.
- No independent security audit.

The current authentication and checkout implementation should not be used for real customer identity or payment data without additional security infrastructure.

## UI claims vs implementation

Some interface labels use product language such as “AI”, “neural”, “predictive”, and “drone”. In the current repository these correspond to:

- deterministic recommendation logic,
- keyword-based chat,
- static promotional percentages,
- animated delivery visuals,
- presentation-only app-store buttons,
- a timed invoice notification rather than an invoice-generation service.

These distinctions are documented so the repository describes the implementation rather than marketing claims.

## Project structure

```text
Pizza_ordering_system/
├── app/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   └── services/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── utils/
├── public/
├── index.html
├── package.json
├── requirements.txt
├── Procfile
├── .env.example
├── README.md
└── DOCUMENTATION.md
```

## Future work

- Real SMS OTP provider and secure authentication.
- Persistent `GET /orders` collection endpoint.
- Server-side validation/storage of pizza customizations.
- Real payment gateway.
- Real delivery tracking.
- LLM-powered assistant.
- Evaluated recommendation model.
- Server-side promotion/coupon system.
- Automated unit, API, and end-to-end tests.
- Production database migrations, backups, monitoring, and rate limiting.

## Author

**Bhukya Jhansi**

Repository: https://github.com/Jhansi1717/Pizza_ordering_system
