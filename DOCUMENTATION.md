# SliceMind — Technical Documentation

This document describes the current repository implementation and separates implemented features from presentation-only UI and future work.

## 1. System architecture

```text
React 19 + Vite
       │
       │ Axios / REST
       ▼
FastAPI
       │
       │ SQLAlchemy
       ▼
PostgreSQL or local SQLite configuration
```

The frontend and backend are separate applications in the same repository.

## 2. Frontend

The frontend is a React 19 application built with Vite.

Main routes:

| Route | Purpose |
|---|---|
| `/` | Phone login |
| `/home` | Main home page |
| `/menu` | Pizza menu |
| `/orders` | Active orders |
| `/history` | Order history UI |
| `/profile` | User profile |
| `/subscription` | BASIC/PRO subscriptions |
| `/preorder` | Pre-order management |
| `/chat` | Assistant |

The application uses `CartContext` for cart state and `OrderContext` for order-list state.

## 3. Authentication

The login flow is phone based.

```text
Phone
  ↓
POST /auth/login
  ↓
Enter 1234
  ↓
POST /auth/verify-otp
  ↓
user_id
  ↓
localStorage
```

The backend currently contains:

```python
VALID_OTP = "1234"
```

Therefore this is a **demo OTP flow**, not a real SMS authentication system.

There is no SMS gateway, OTP expiration, rate limiting, or production identity verification.

## 4. Menu

On startup, the backend seeds five pizzas if the database is empty:

| Pizza | Base | Preparation | Price |
|---|---|---:|---:|
| Margherita | Thin Crust | 15 min | ₹199 |
| Farmhouse | Pan | 18 min | ₹249 |
| Pepperoni | Cheese Burst | 20 min | ₹299 |
| Veggie Delight | Thin Crust | 17 min | ₹229 |
| BBQ Chicken | Pan | 22 min | ₹319 |

The frontend also defines additional static pizza entries. These static entries are not automatically inserted into the backend database.

## 5. Pizza customization

The current customizer provides:

### Size
- Regular: +₹0
- Medium: +₹100
- Large: +₹200

### Crust
- Classic Hand Tossed: +₹0
- Thin Crust: +₹30
- Cheese Burst: +₹120

### Toppings
- Extra Cheese: +₹50
- Black Olives: +₹30
- Jalapenos: +₹30
- Grilled Mushrooms: +₹40

The frontend calculates the customized item price and keeps customization metadata inside the cart item.

## 6. Cart and checkout

Cart state is held in React.

Implemented behavior includes:
- adding pizza items
- increasing/decreasing quantities
- removing items
- opening/closing the cart drawer
- bulk-mode quantity behavior
- checkout form

The checkout sends a `POST /orders` request.

The current frontend contains a fallback/demo path when the API request fails. There is no external payment gateway and no real payment authorization.

## 7. Order service

The backend `POST /orders` flow:

1. validates the user,
2. checks the requested pizza IDs,
3. calculates the number of pizzas,
4. attempts applicable subscription-credit deduction,
5. creates the order,
6. creates order-item records,
7. records an `order_created` event,
8. commits and returns the order.

The backend currently exposes:

- `POST /orders`
- `GET /orders/{order_id}`

It does **not** expose a collection `GET /orders` endpoint.

The frontend `OrderContext` requests `GET /orders?user_id=...`, so the order-list/history integration is currently incomplete.

## 8. Subscription service

Subscription records are stored per user.

| Plan | Credits | Duration |
|---|---:|---:|
| BASIC | 2 pizzas | 7 days |
| PRO | 5 pizzas | 7 days |

A new subscription replaces the existing subscription.

No payment or billing provider is integrated.

## 9. Pre-order and scheduling service

Pre-orders:

- are generated from the recommendation service,
- remain pending for 15 minutes,
- can be confirmed,
- can be cancelled,
- become orders when confirmed and a slot is available.

Scheduling:

- creates 15-minute delivery slots,
- covers a rolling 24-hour window,
- gives each slot a capacity of 20.

## 10. Recommendation service

The recommendation engine is deterministic.

It reads `order_created` event metadata, compares event time with the current UTC hour, and counts pizza quantities.

Selection order:

```text
User orders near current hour
        ↓
Most frequently ordered matching pizza
        ↓
Most frequent pizza globally
        ↓
First pizza in database
```

This is a **rule-based recommendation algorithm**, not a trained recommender model.

## 11. Chat service

The backend chat service is also deterministic.

| Intent | Keywords |
|---|---|
| Order status | `order`, `status`, `where` |
| Delivery time | `when`, `arrive`, `eta` |
| Subscription credits | `credits`, `balance` |

The backend does not call an LLM.

The frontend also has mocked fallback responses for failed API requests.

## 12. Location

The home page requests browser geolocation and performs reverse geocoding through the OpenStreetMap Nominatim API.

If location access or lookup fails, a hard-coded fallback address is displayed. That address is demo placeholder content and is not connected to a real delivery database.

## 13. Delivery tracking UI

The Orders page includes:

- status progress
- animated radar
- a drone-style moving indicator
- a fixed ETA
- route text

These are **frontend presentation animations**. No live driver/drone/GPS telemetry or dispatch service exists in the backend.

## 14. Promotional / AI-themed UI

The repository includes product-style UI such as:

- “AI-Powered Ordering”
- “Predictive Reordering”
- AI match percentages
- promotional offers
- “AI Support”
- drone delivery visuals

The current backend does not provide machine-learning prediction for pizza recommendations, an LLM chatbot, dynamic coupon optimization, or live drone tracking.

Where such values are hard-coded in the frontend, they should be treated as presentation data.

## 15. PWA

`vite.config.js` uses `vite-plugin-pwa`.

Current PWA configuration includes:
- auto update registration,
- standalone display,
- theme/background colors,
- pizza SVG icon.

## 16. Database models

### User
- id
- phone

### Pizza
- id
- name
- description
- image_url
- base_type
- prep_time
- price

### Order
- id
- user_id
- slot_id
- status
- created_at

### OrderItem
- id
- order_id
- pizza_id
- quantity
- customizations

### Subscription
- id
- user_id
- plan_type
- credits_remaining
- start_date
- end_date
- auto_renew

### PreOrder
- id
- user_id
- suggested_items
- status
- expires_at

### Slot
- id
- start_time
- end_time
- capacity
- used_capacity

### EventLog
- id
- user_id
- event_type
- JSON metadata
- timestamp

## 17. API integration

The frontend Axios client uses:

```text
VITE_API_URL
```

with a local-development fallback of:

```text
http://localhost:8000
```

The frontend sends API requests directly to the configured backend origin.

## 18. Environment configuration

Example:

```env
DATABASE_URL=postgresql+psycopg2://...
VITE_API_URL=http://localhost:8000
```

Real credentials must not be committed.

## 19. Local development

Backend:

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --reload --port 8000
```

Frontend:

```bash
npm install
npm run dev
```

Typical local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## 20. Deployment

The repository contains:

```text
Procfile
web: uvicorn app.main:app --host 0.0.0.0 --port 10000
```

There is no Render Blueprint, Vercel configuration, Dockerfile, or other provider-specific deployment definition in the repository.

Therefore this documentation does not claim an active cloud deployment.

For real production use, additional infrastructure would be required for:
- real OTP delivery,
- payment processing,
- secure sessions,
- persistent managed database,
- monitoring and backups,
- rate limiting,
- order-list API,
- delivery tracking.

## 21. Testing status

The repository does not contain a complete automated end-to-end test suite.

Before considering a deployment production-ready, manually or automatically verify:
- login and OTP verification,
- menu loading,
- pizza customization,
- cart calculations,
- order creation,
- order retrieval,
- subscription creation,
- credit deduction,
- pre-order lifecycle,
- recommendation response,
- chat response,
- database persistence,
- frontend/backend integration.

## 22. Known implementation gaps

These are current code-level gaps rather than future marketing claims:

- Fixed OTP `1234`.
- No SMS provider.
- No payment gateway.
- No real delivery tracking.
- No LLM integration.
- No ML recommendation model.
- Frontend requests `GET /orders`, but backend provides only `GET /orders/{order_id}`.
- Detailed pizza customizations are not included in the order payload sent by the current Cart component.
- Some frontend fallback/demo behavior can hide backend failures.
- `pizza.db` is tracked in the repository and should not be treated as production persistence.

## 23. Future engineering work

- Real authentication/OTP provider.
- Proper session/token security.
- Collection order-history API.
- Server-side customization persistence.
- Payment gateway.
- Live delivery updates.
- LLM integration.
- Evaluated recommendation model.
- Dynamic promotion service.
- Automated testing and CI.
- Production migrations, monitoring, backups, and rate limiting.

## Author

**Bhukya Jhansi**
