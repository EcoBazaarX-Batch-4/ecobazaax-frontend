# API Contracts & Endpoint Reference (Frontend → Backend)

This file describes the API surface the frontend will call, grouped by area. It provides the HTTP method, path, brief description, expected payload shapes, authentication requirements and example request/response bodies. Use this as the authoritative contract when implementing service functions in `src/services/*`.

> Notes:
- All API paths are prefixed with `/api/v1` in examples.
- Authentication: JWT in `Authorization: Bearer <token>` header for protected endpoints.
- CORS: Backend must allow `http://localhost:5173` (dev) via CORS configuration.

---

## Auth & Profile

POST /api/v1/auth/login
- Description: Login user and return JWT + basic user info.
- Auth: public
- Request:
  ```json
  { "email": "alice@example.com", "password": "secret" }
  ```
- Response (200):
  ```json
  { "token": "ey...", "user": { "id": 1, "name": "Alice", "roles": ["CUSTOMER"] } }
  ```

POST /api/v1/auth/register
- Description: Create a new user account.
- Auth: public
- Request: (example)
  ```json
  { "name": "Alice", "email": "alice@example.com", "password": "secret" }
  ```
- Response (201): created user or token

GET /api/v1/profile/me
- Description: Returns current user's profile (requires Authorization).
- Auth: Bearer token
- Response (200):
  ```json
  { "id": 1, "name": "Alice", "email": "alice@example.com", "roles": ["CUSTOMER"], "ecoPoints": 120 }
  ```

PUT /api/v1/profile/me
- Description: Update user profile fields.
- Auth: Bearer token

## Products & Recommendations

GET /api/v1/recommendations/homepage
- Description: Returns lists like topSellers, lowestCarbon, newArrivals.
- Auth: optional (personalized if auth present)

GET /api/v1/products
- Description: Product listing with pagination and filters.
- Query params: `?page=1&pageSize=24&category=...&minPrice=&maxPrice=`

GET /api/v1/products/{id}
- Description: Product detail.

GET /api/v1/products/{id}/related
- Description: Related product suggestions.

GET /api/v1/products/{id}/reviews
- Description: Fetch product reviews.

POST /api/v1/products/{id}/reviews
- Description: Submit a review (protected: must be customer and have delivered order)

POST /api/v1/tracking/view/{id}
- Description: Record user viewed product (for recently-viewed and personalization).

GET /api/v1/leaderboard/global
- Description: Public leaderboard for Greenest Shoppers.

## Cart & Checkout

GET /api/v1/cart
- Description: Get current user's cart (protected)

POST /api/v1/cart/add
- Description: Add item to cart. Request: `{ "productId": 123, "quantity": 2 }`

PUT /api/v1/cart/update/{cartItemId}
- Description: Update quantity.

DELETE /api/v1/cart/remove/{cartItemId}

POST /api/v1/checkout
- Description: Single transactional endpoint to create an order. Request contains cart snapshot, payment info (payment method id/token provided by Stripe client-side), shipping address id, applied discounts and ecoPoints redemption.

## Profile / Customer-Specific

GET /api/v1/profile/addresses
POST /api/v1/profile/addresses
PUT /api/v1/profile/addresses/{id}
DELETE /api/v1/profile/addresses/{id}

GET /api/v1/profile/orders
GET /api/v1/profile/orders/{id}

GET /api/v1/profile/wishlist
POST /api/v1/profile/wishlist
DELETE /api/v1/profile/wishlist/{id}

GET /api/v1/insights/profile
GET /api/v1/profile/eco-points-history

## Seller API (ROLE_SELLER)

GET /api/v1/seller/products
POST /api/v1/seller/products
PUT /api/v1/seller/products/{id}
DELETE /api/v1/seller/products/{id}

GET /api/v1/insights/seller
GET /api/v1/insights/seller/product-performance

GET /api/v1/seller/orders  <-- NEW (recommended)
- Description: Seller's own orders list. Add this endpoint to backend if not present.

## Admin API (ROLE_ADMIN)

GET /api/v1/admin/users
PUT /api/v1/admin/users/{id}
GET /api/v1/admin/seller-applications
PUT /api/v1/admin/seller-applications/{id}/approve
PUT /api/v1/admin/seller-applications/{id}/reject

CRUD endpoints for site config:
- /api/v1/admin/config/categories
- /api/v1/admin/config/materials
- /api/v1/admin/config/packaging
- /api/v1/admin/config/transport-zones
- /api/v1/admin/config/tax-rates
- /api/v1/admin/config/discounts

## AI Endpoints (recommended)

POST /api/v1/ai/chat
- Description: Chat endpoint for the Co-Pilot. Payload: `{ "message": "...", "context": {...} }`.
- Response: structured messages; may include actions (e.g., `navigate: "/profile/orders"`) or product suggestions.

## Error Handling & Shape
- Common error response shape (400/401/403/404/500):
  ```json
  { "status": 400, "message": "Email already in use", "errors": { "email": "invalid" } }
  ```
- Frontend behavior: `err.response?.data?.message` is used to display server message; if missing, use `err.message`.

## CORS & Dev Setup
- Backend must allow cross-origin requests from the dev origin (e.g., `http://localhost:5173`). In Spring Boot add CORS configuration (or use `@CrossOrigin`) in security config.
- Vite proxy is recommended in development to avoid CORS: add proxy config to `vite.config.js` for `/api` to point to backend.

## Authentication & Token Handling
- Token storage: localStorage is used for persistence (tradeoff: susceptible to XSS). Alternative: use httpOnly cookies for higher security.
- On login: server returns token; frontend stores token and sets default axios Authorization header via the `api` instance.
- On app boot: `AuthContext` reads token from localStorage in `useEffect`, sets axios header and optionally fetches profile to hydrate `user`.

## Sample axios service shape (frontend)
```js
// src/services/api.js
import axios from 'axios';
const api = axios.create({ baseURL: '/api/v1', timeout: 10000 });
// request interceptor for token, response interceptor for error normalization
export default api;
```

## Missing / Recommended New Endpoints
- `GET /api/v1/seller/orders` — seller-specific orders listing.
- `GET /api/v1/homepage-banners` — if a CMS-managed homepage required.
- `POST /api/v1/ai/chat` — AI chat endpoint contract for future Sub-App 5.

---
Use this file as the canonical API contract for frontend developers implementing the `services` layer and for backend teams to verify request/response shapes.
