# Feature Map — Modules → Sub-Apps → Pages

This document maps backend modules and endpoints to the frontend pages and features. Use this as the master checklist during development.

## Summary by Sub-App

### Sub-App 1 — Public Storefront (Guest + Customer)
- Pages:
  - Home (`/`)
  - Product Listing (`/products`)
  - Product Detail (`/product/:id`)
  - Search Results (`/products/search?q=`)
  - Login (`/login`) / Register (`/register`)
  - Optional: Leaderboard (`/leaderboard/global`)

- Features & Endpoints:
  - Homepage recommendations: `GET /api/v1/recommendations/homepage`
  - Product catalogue & search: `GET /api/v1/products`, `GET /api/v1/products/search`
  - Product detail: `GET /api/v1/products/{id}`
  - Related products: `GET /api/v1/products/{id}/related`
  - Reviews: `GET /api/v1/products/{id}/reviews`, `POST /api/v1/products/{id}/reviews`
  - Tracking views: `POST /api/v1/tracking/view/{id}`

### Sub-App 2 — Customer Portal (ROLE_CUSTOMER)
- Pages:
  - Cart (`/cart`)
  - Checkout wizard (`/checkout`)
  - Profile Dashboard (`/profile`)
  - Address Book (`/profile/addresses`)
  - Order History (`/profile/orders`)
  - Order Detail (`/profile/orders/:id`)
  - Wishlist (`/profile/wishlist`)

- Features & Endpoints:
  - Auth: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/profile/me`
  - Cart operations: `GET /api/v1/cart`, `POST /api/v1/cart/add`, `PUT /api/v1/cart/update/{id}`, `DELETE /api/v1/cart/remove/{id}`
  - Checkout: `POST /api/v1/checkout` (atomic flow)
  - Addresses: `GET/POST/PUT/DELETE /api/v1/profile/addresses` (or `/profile/addresses/**`)
  - Orders: `GET /api/v1/profile/orders`, `GET /api/v1/profile/orders/{id}`
  - Insights: `GET /api/v1/insights/profile`, `GET /api/v1/profile/eco-points-history`

### Sub-App 3 — Seller Portal (ROLE_SELLER)
- Pages:
  - Seller Dashboard (`/seller/dashboard`)
  - Product List (`/seller/products`)
  - Create/Edit Product (`/seller/products/new`, `/seller/products/:id/edit`)
  - Seller Orders (`/seller/orders`)
  - Store Settings (`/seller/settings`)

- Features & Endpoints:
  - Product CRUD for seller: `GET/POST/PUT/DELETE /api/v1/seller/products` etc.
  - Seller insights: `GET /api/v1/insights/seller`, `GET /api/v1/insights/seller/product-performance`
  - Seller orders: (Add `GET /api/v1/seller/orders` to backend)

### Sub-App 4 — Admin Portal (ROLE_ADMIN)
- Pages:
  - Admin Dashboard (`/admin/dashboard`)
  - User Management (`/admin/users`)
  - Seller Approvals (`/admin/seller-applications`)
  - Configuration Hub (`/admin/config/*`)
  - Reports & Exports

- Features & Endpoints:
  - Admin CRUD for master data: `GET/POST/PUT/DELETE /api/v1/admin/**`
  - Insights: `GET /api/v1/insights/admin`, `GET /api/v1/insights/admin/leaderboards`

## Shared Features & Cross-Cutting Concerns
- Auth & Security
  - Use `AuthContext` to manage token, user, roles, `isAuthenticated`, `loading`.
  - `ProtectedRoute` and `SellerProtectedRoute` / `AdminProtectedRoute` for RBAC.

- Cart & Checkout
  - `CartContext` loads cart only if `isAuthenticated` and role is `CUSTOMER` (avoids 403 from backend).

- Error handling & UX
  - Service layer (`src/services/*`) normalizes API errors. Components check `err.response.data.message`.

- AI Co-Pilot (future)
  - Overlay/Sidebar accessible across the app; no dedicated pages required by default.
