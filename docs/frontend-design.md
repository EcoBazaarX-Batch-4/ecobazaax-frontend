# Frontend Design — EcoBazzar X

This document collects the frontend UI/UX design decisions, layout patterns, component catalog, theming, responsive rules and the AI Co-Pilot integration strategy.

## High-level Goals
- Clean, modern, minimalist e‑commerce UX with emphasis on eco-metrics.
- Reusable components (ProductCard, StatCard, DataTable, CarbonBadge).
- Responsive: mobile-first breakpoints with MUI Grid & system.
- Accessible: semantic HTML, keyboard navigation, ARIA where necessary.

## Theme & Visual System
- Base: MUI v5/v6 theme object.
- Colors (suggested):
  - Background: `#FFFFFF`
  - Text: `#333333`
  - Primary (Eco Green): `#2ECC71` (buttons, positive CTAs)
  - Secondary (Links): standard Blue `#1976d2`
  - Muted: `#F4F6F8` (cards, surfaces)

- Typography: system font stack or Google Fonts (Inter/Roboto).
- Spacing: 8px baseline (MUI default).

## Global Layouts
- `PublicLayout` (Standard Store Layout)
  - Top: `Header` (logo, search, nav links, smart cart icon, login status)
  - Main: `Outlet` for route content
  - Bottom: `Footer` (links, legal, social)

- `DashboardLayout` (Seller/Admin)
  - Sidebar: persistent navigation (left)
  - Content: main panel (right)
  - Topbar: small header for quick actions and user menu

## Core Components Catalog
- `Header` — logo, search input, navigation (use `<Link>`), cart icon with badge.
- `Footer` — site links, newsletter signup, legal links.
- `ProductCard` — image, name, price, eco-badge, add-to-cart.
- `ProductGrid` — responsive grid of `ProductCard`.
- `ProductDetail` components — hero image, details pane, eco metrics.
- `CartSummary` — sticky summary, totals, eco total, checkout CTA.
- `ProtectedRoute` — route guard wrapper using `useAuth()` and `<Navigate/>`.
- `DataTable` — reusable MUI table with pagination & sorting.
- `StatCard` — KPI tile for dashboards.
- `CarbonBadge` — small visual indicating footprint (green/yellow/red).
- `Toast` — lightweight, non-blocking notifications.

## Forms & Validation
- Use controlled components (React state) for small forms.
- Use `react-hook-form` for complex forms (seller product wizard) to reduce render overhead.
- Schema validation with `Zod` or `Yup` for consistent error messages and client/server parity.

## Routing & Code Organization
- Use React Router v6 with nested routes & `Outlet` for layouts.
- Route structure: `/, /products, /product/:id, /cart, /checkout, /profile/*, /seller/*, /admin/*`.
- Keep each sub-app's pages under `src/pages/<subapp>` and components under `src/components/<subapp>`.

## State Management
- Use React Context for Auth and Cart (`src/contexts/AuthContext.jsx`, `src/contexts/CartContext.jsx`).
- Use React Query (optional / recommended) for server state (fetching lists, caching, invalidation). If not using React Query, centralize API calls under `src/services/*` and use explicit re-fetching patterns.

## Accessibility
- All form controls labeled.
- Keyboard-first navigation for modals and drawer components.
- Color contrast checked for primary buttons and status badges.

## Performance & Optimization
- Use Vite dev server and production build with Rollup-based optimization.
- Lazy-load large pages and route-based code splitting via `React.lazy` + `Suspense`.
- Optimize images (use responsive srcset), use webp where possible.
- Tree-shake and import components individually from MUI to keep bundle small.

## AI Co-Pilot Integration (Sub-App 5)
- Integration style: split-panel overlay (default collapsed FAB -> expands to 30% right sidebar).
- App resizes: main content should be responsive and shrink to ~70% width when AI is open.
- Communication: `src/services/aiService.js` will POST user messages to `/api/v1/ai/chat` and receive structured responses.
- Response rendering: chat messages can contain structured payloads (e.g., product suggestions) that the front-end will render as interactive mini-cards within the main content area or in the chat.

## UX Patterns & Microcopy
- Loading indicators: use `CircularProgress` for page-level loads, skeletons for lists.
- Empty states: friendly messages and CTAs (e.g., "You have no saved addresses — add one now").
- Error handling: Alerts for server errors using `error.response.data.message` when present.

## Folder Structure (recommended)
```
src/
  components/
  contexts/
  hooks/
  pages/
  services/
  styles/
  assets/
  main.jsx
  App.jsx
```

## Deliverables for Phase 1 (Public Storefront)
- Header, Footer, PublicLayout
- HomePage, ProductListPage, ProductDetailPage, SearchPage
- ProductCard component, Recommendation widgets

---
End of frontend design document.
