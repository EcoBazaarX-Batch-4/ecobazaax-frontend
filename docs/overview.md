# EcoBazzar X — Project Overview & Phase Summary

This document is a concise, printable summary that concludes the multiple ideations and captures the final agreed project plan. It is intended as the first thing to print and distribute to stakeholders before diving into the detailed design files.

## Project Vision
EcoBazzar X is a single-page React application (Vite) backed by a Spring Boot REST API. The platform promotes sustainable shopping by combining an ecommerce storefront with a carbon-footprint engine, gamification, and role-based portals (Customer, Seller, Admin). The frontend will be built with React + MUI and will be structured as four sub-apps inside a single SPA.

## Phase Summary (Printable)

Phase 0 — The Foundation (Setup)
- Goal: Create a blank, working React project and core contexts (Auth, Cart).
- Deliverables: Vite project, `src/services/api.js`, `src/contexts/AuthContext.jsx`, `src/contexts/CartContext.jsx`, dev dependencies installed and dev server working.

Phase 1 — The Public Storefront (Sub-App 1)
- Goal: Guest browsing & conversion funnel.
- Deliverables: Header/Footer, Home, Product Listing, Product Detail, Search, Login/Register, ProductCard, recommendations integration.

Phase 2 — The Customer Portal (Sub-App 2)
- Goal: Full logged-in customer experience (cart, checkout, profile, addresses, orders, wishlist, insights).
- Deliverables: CartPage, Checkout wizard (address/shipping/payment), Profile & AddressBook, OrderHistory, Stripe integration.

Phase 3 — The Seller Portal (Sub-App 3)
- Goal: Business UI for sellers (product create/edit, product management, orders, analytics).
- Deliverables: SellerDashboard, ProductGrid (MUI X), Product creation wizard (multi-step), Seller orders and settings.

Phase 4 — The Admin Portal (Sub-App 4)
- Goal: Platform configuration & moderation (God Mode).
- Deliverables: AdminDashboard, UserManagement, SellerApprovals, ConfigHub (7 config pages for master data), site-wide reports.

Phase 5 — Polish & AI (Sub-App 5) — Optional / Future
- Goal: Finalize theming and integrate an Assistive AI Co-Pilot as a split-panel overlay (30% chat, 70% content).
