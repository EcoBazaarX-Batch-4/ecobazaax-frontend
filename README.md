# EcoBazaarX Frontend

A modern, full-featured React-based e-commerce platform dedicated to sustainable and eco-friendly products. Built with Vite, Material-UI, and advanced modern web technologies, EcoBazaarX provides a seamless shopping experience with comprehensive role-based features for customers, sellers, and administrators.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [Build & Deployment](#build--deployment)
- [Project Architecture](#project-architecture)
- [Available Routes](#available-routes)
- [Component Documentation](#component-documentation)
- [Context & State Management](#context--state-management)
- [Services](#services)
- [Styling & Theming](#styling--theming)
- [UI Components](#ui-components)
- [Configuration](#configuration)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🌱 Overview

EcoBazaarX is a comprehensive e-commerce solution focused on promoting sustainable products and reducing carbon footprints. The platform serves three main user roles:

- **Customers**: Browse, purchase, and track eco-friendly products
- **Sellers**: Manage inventory, create products, and monitor sales with carbon tracking
- **Administrators**: Oversee the platform, manage users, approve sellers, and view reports

The platform integrates AI-powered chatbot assistance, carbon footprint tracking, eco-points system, and payment processing through Stripe.

---

## ✨ Key Features

### Public Features
- **Product Discovery**: Browse eco-friendly products with detailed filtering
- **Product Search**: Real-time search across the marketplace
- **Eco Leaderboard**: Track users by their carbon footprint reduction
- **Product Detail Pages**: Comprehensive product information with carbon impact data
- **User Authentication**: Secure login and registration system
- **AI Chatbot**: Real-time customer support and product recommendations

### Customer Features
- **Shopping Cart**: Add, remove, and manage products
- **Checkout Process**: Secure payment processing with Stripe
- **Order History**: Track past purchases and delivery status
- **Order Details**: View comprehensive order information
- **Wishlist**: Save favorite products for later
- **Address Book**: Manage delivery addresses
- **Profile Dashboard**: View personal stats, eco-points, and carbon footprint
- **Security Settings**: Manage account security and preferences

### Seller Features
- **Seller Dashboard**: Overview of sales, orders, and performance metrics
- **Product Management**: Create, edit, and list products
- **Carbon Input**: Track product carbon footprints
- **Order Management**: View and process customer orders
- **Store Settings**: Customize store appearance and information
- **Analytics**: Monitor sales performance and trends

### Admin Features
- **Admin Dashboard**: Platform overview and key metrics
- **User Management**: Create, edit, and manage user accounts
- **Seller Approvals**: Review and approve new sellers
- **Order Management**: Monitor all platform orders
- **Configuration Hub**: Manage platform settings and configurations
- **Reports**: Generate and view platform analytics
- **Leaderboard Management**: Manage the eco-points leaderboard

---

## 🛠 Tech Stack

### Frontend Framework & Build
- **React 18+**: Modern UI library with hooks
- **Vite**: Next-generation build tool for faster development
- **TypeScript**: Type safety where applicable (`.ts` and `.tsx` files)
- **React Router v6**: Client-side routing and navigation

### UI & Styling
- **Material-UI (MUI) v7**: Comprehensive component library
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Emotion**: CSS-in-JS styling for MUI
- **PostCSS**: CSS transformation

### State Management & Data
- **React Context API**: Global state management (Auth, Cart)
- **TanStack React Query**: Server state management
- **Axios**: HTTP client for API requests
- **React Hook Form**: Efficient form handling
- **Zod**: Schema validation

### UI Component Libraries
- **shadcn/ui**: Pre-built, customizable components
- **Sonner**: Toast notifications
- **React Hooks**: Custom hooks for mobile detection and toast management

### Payment & E-commerce
- **Stripe React**: Payment processing integration
- **Stripe.js**: Payment element integration

### Development Tools
- **ESLint**: Code quality and style enforcement
- **Bun**: Fast package manager and runtime

---

## 📁 Project Structure

```
ecobazaax-frontend-main/
├── public/
│   ├── logo.png              # Main logo (72px width)
│   ├── logo.jpg              # Alternative logo
│   ├── tree.png              # Eco-theme image
│   ├── placeholder.svg       # Placeholder images
│   └── robots.txt            # SEO configuration
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── admin/
│   │   │   ├── AdminLeaderboardList.jsx
│   │   │   └── AdmnDashboardlayout.jsx
│   │   ├── seller/
│   │   │   └── CarbonInputSection.jsx
│   │   ├── ui/               # shadcn/ui components (60+ components)
│   │   ├── CarbonBadge.jsx   # Carbon impact display component
│   │   ├── ChatButton.jsx    # AI chatbot trigger
│   │   ├── ChatModal.jsx     # Chatbot interface (centered header, 72px logo)
│   │   ├── Footer.jsx        # Global footer
│   │   ├── Header.jsx        # Global navigation header
│   │   ├── NavLink.jsx       # Navigation link component
│   │   ├── PaymentForm.jsx   # Stripe payment form
│   │   ├── ProductCard.jsx   # Product display card
│   │   ├── ProductGrid.jsx   # Product grid layout
│   │   ├── ProtectedRoute.jsx # Route protection by role
│   │   └── StatCard.jsx      # Statistics display card
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── CartContext.jsx   # Shopping cart state
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.jsx    # Mobile device detection
│   │   └── use-toast.ts      # Toast notification hook
│   ├── layouts/              # Page layouts
│   │   ├── PublicLayout.jsx  # Public pages layout
│   │   └── DashboardLayout.jsx # Protected pages layout
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── pages/                # Page components
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrderManagement.jsx
│   │   │   ├── ConfigHub.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── SellerApprovals.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── customer/
│   │   │   ├── AddressBook.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── ProfileDashboard.jsx
│   │   │   ├── SecuritySettingsPage.jsx
│   │   │   └── Wishlist.jsx
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ProductListing.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SearchResults.jsx
│   │   └── seller/
│   │       ├── CreateProduct.jsx
│   │       ├── EditProduct.jsx
│   │       ├── ProductList.jsx
│   │       ├── SellerDashboard.jsx
│   │       ├── SellerOrders.jsx
│   │       └── StoreSettings.jsx
│   ├── services/             # API service layer
│   │   ├── adminService.js   # Admin API calls
│   │   ├── api.js            # Base API configuration
│   │   ├── authService.js    # Authentication API
│   │   ├── cartService.js    # Cart operations
│   │   ├── customerService.js # Customer API
│   │   ├── productService.js # Product management
│   │   └── sellerService.js  # Seller operations
│   ├── App.jsx               # Root component with routing
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Global styles
│   ├── theme.js              # Material-UI theme configuration
│   ├── vite-env.d.ts         # Vite type definitions
│   └── tsconfig files        # TypeScript configurations
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── vite.config.ts            # Vite configuration
├── vite.config.js            # Alternative Vite config
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
├── tsconfig.json             # TypeScript configuration
├── components.json           # shadcn/ui components metadata
├── bun.lockb                 # Bun lock file
└── README.md                 # Original README
```

---

## 📦 Prerequisites

Before getting started, ensure you have:

- **Node.js** (v16.0.0 or higher) or **Bun** (latest version)
- **npm** (v8.0.0+) or **yarn** or **Bun**
- **Git** for version control
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Backend API server running (typically on `http://localhost:5000`)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/EcoBazaarX-Batch-4/ecobazaax-frontend-main.git
cd ecobazaax-frontend-main
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using Bun:
```bash
bun install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory (if needed for backend URLs):

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_KEY=your_stripe_public_key_here
```

---

## 💻 Development Setup

### Start Development Server

```bash
npm run dev
```

This starts the Vite dev server at `http://localhost:5173`

The development server includes:
- Fast HMR (Hot Module Replacement)
- Component tagging for development aids
- Automatic browser refresh on file changes

### Development Features

- **Fast Refresh**: Changes reflect instantly without page reload
- **TypeScript Support**: Type checking during development
- **ESLint Integration**: Code quality checking on save

---

## 🏗 Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Development Build

```bash
npm run build:dev
```

Creates a development-mode build with source maps.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Linting

```bash
npm run lint
```

Checks code quality and style compliance.

---

## 🏛 Project Architecture

### Component Hierarchy

```
App (Root)
├── AuthProvider (Context)
├── CartProvider (Context)
├── ThemeProvider (Material-UI)
├── Routes
│   ├── PublicLayout
│   │   ├── Header
│   │   ├── Page Components (Home, ProductListing, etc.)
│   │   ├── ChatButton & ChatModal
│   │   └── Footer
│   ├── DashboardLayout (Protected)
│   │   ├── Navigation Sidebar
│   │   ├── Protected Page Components
│   │   └── Footer
│   └── AuthPages (Login, Register)
```

### Data Flow

1. **User Actions** → Components
2. **Components** → Services (API calls)
3. **Services** → Backend API
4. **Backend Response** → Context/State Update
5. **State Update** → Component Re-render

### State Management Strategy

- **Global State**: Auth & Cart via React Context
- **Server State**: Queries via React Query
- **Component State**: Local useState for UI state
- **Form State**: React Hook Form for forms

---

## 🛣 Available Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with featured products |
| `/products` | ProductListing | Browse all eco-friendly products |
| `/products/:id` | ProductDetail | View detailed product information |
| `/search` | SearchResults | Search results for products |
| `/leaderboard` | Leaderboard | View user eco-points rankings |
| `/login` | Login | User authentication |
| `/register` | Register | New user registration |

### Customer Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/customer/profile` | ProfileDashboard | View personal profile & stats |
| `/customer/cart` | Cart | Shopping cart management |
| `/customer/checkout` | Checkout | Payment processing |
| `/customer/orders` | OrderHistory | View past orders |
| `/customer/orders/:id` | OrderDetail | View specific order details |
| `/customer/wishlist` | Wishlist | Saved favorite products |
| `/customer/addresses` | AddressBook | Manage delivery addresses |
| `/customer/security` | SecuritySettingsPage | Account security settings |

### Seller Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/seller/dashboard` | SellerDashboard | Sales overview & metrics |
| `/seller/products` | ProductList | Manage seller's products |
| `/seller/products/create` | CreateProduct | Create new product |
| `/seller/products/:id/edit` | EditProduct | Edit existing product |
| `/seller/orders` | SellerOrders | View orders for seller's products |
| `/seller/settings` | StoreSettings | Configure store details |

### Admin Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/dashboard` | AdminDashboard | Platform overview |
| `/admin/users` | UserManagement | Manage user accounts |
| `/admin/sellers` | SellerApprovals | Approve/manage sellers |
| `/admin/orders` | AdminOrderManagement | Monitor all orders |
| `/admin/config` | ConfigHub | Platform configuration |
| `/admin/reports` | Reports | Generate analytics reports |

---

## 🧩 Component Documentation

### Key Components

#### **CarbonBadge.jsx**
Displays carbon impact with visual indicators.
- Props: `carbonFootprint`, `size`
- Uses 72px wide `logo.png` for eco-impact visualization

#### **ChatModal.jsx**
AI Chatbot interface with centered header and 72px logo.
- Features: Real-time messaging, typing indicator, auto-scroll
- Communicates with Python backend at `http://localhost:5000/chat`
- Sends: `message`, `user_id`, `jwt_token`

#### **ProductCard.jsx**
Displays individual product with carbon impact.
- Shows: Product image, name, price, carbon footprint, ratings
- Includes: Add to cart, add to wishlist functionality

#### **ProductGrid.jsx**
Responsive grid layout for displaying multiple products.
- Responsive: Adapts to mobile, tablet, and desktop screens

#### **Header.jsx**
Global navigation header with logo and navigation links.
- Features: Search bar, cart icon, user menu

#### **Footer.jsx**
Global footer with company info and social links.
- Includes: About section, links, social media buttons

#### **PaymentForm.jsx**
Stripe payment processing integration.
- Uses: Stripe Elements for secure payment input

#### **ProtectedRoute.jsx**
Route protection based on user roles.
- Roles: Customer, Seller, Admin
- Redirects unauthenticated users to login

---

## 🔄 Context & State Management

### AuthContext.jsx
Manages user authentication and authorization.

**State:**
```javascript
{
  user: {
    id, email, name, role, ecoPoints, ...
  },
  token: "jwt_token",
  isAuthenticated: boolean,
  loading: boolean
}
```

**Methods:**
- `login(email, password)` - Authenticate user
- `logout()` - Clear session
- `register(userData)` - Create new account

### CartContext.jsx
Manages shopping cart state globally.

**State:**
```javascript
{
  items: [
    { productId, quantity, price, ... }
  ],
  total: number,
  itemCount: number
}
```

**Methods:**
- `addToCart(product)` - Add item to cart
- `removeFromCart(productId)` - Remove item
- `updateQuantity(productId, quantity)` - Modify quantity
- `clearCart()` - Empty cart

---

## 🔌 Services

### API Service (`services/api.js`)
Base Axios configuration for all API calls.

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Available Services

#### **authService.js**
- `login(credentials)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `verifyToken(token)` - Token validation

#### **productService.js**
- `getProducts()` - Fetch all products
- `getProductById(id)` - Get specific product
- `searchProducts(query)` - Search functionality
- `getHomeRecommendations()` - Home page recommendations

#### **cartService.js**
- `addToCart(productId, quantity)` - Add cart item
- `removeFromCart(productId)` - Remove cart item
- `getCart()` - Retrieve cart contents
- `updateCart(items)` - Update cart

#### **customerService.js**
- `getProfile()` - Retrieve user profile
- `updateProfile(data)` - Update profile
- `getOrders()` - Fetch user orders
- `getOrderDetail(orderId)` - Order details

#### **sellerService.js**
- `getSellerDashboard()` - Dashboard data
- `createProduct(data)` - Create product
- `updateProduct(id, data)` - Edit product
- `deleteProduct(id)` - Remove product
- `getSellerOrders()` - Seller's orders

#### **adminService.js**
- `getUsers()` - List all users
- `getOrders()` - All platform orders
- `approveSeller(sellerId)` - Approve seller
- `generateReports()` - Platform analytics

---

## 🎨 Styling & Theming

### Material-UI Theme
Customized MUI theme with eco-friendly color palette.

**Primary Colors:**
- `primary.main`: #2ECC71 (Eco Green)
- `primary.light`: #58D68D
- `primary.dark`: #27AE60

**Typography:**
- Font Family: Inter, Roboto, Helvetica, Arial
- Custom heading styles with varying weights

### Tailwind CSS
Utility classes for rapid UI development. Configured in `tailwind.config.ts`.

### CSS-in-JS
Emotion used for dynamic styling with MUI components.

### PostCSS
CSS preprocessing configured in `postcss.config.js`.

---

## 🧩 UI Components

The project includes **60+ pre-built UI components** from shadcn/ui and Radix UI:

**Common Components:**
- Buttons, Forms, Inputs
- Cards, Dialogs, Modals
- Tables, Tabs, Dropdowns
- Alerts, Toasts, Badges
- Avatars, Skeletons
- Sliders, Progress, Toggles

**Navigation Components:**
- Navigation Menu
- Breadcrumbs
- Pagination
- Sidebar

**Complex Components:**
- Carousel, Chart
- Calendar, Command
- Accordion, Collapsible
- Context Menu, Hover Card

---

## ⚙ Configuration

### Vite Configuration (`vite.config.ts`)
- Development server on port 8080
- Path alias: `@` → `./src`
- Component tagging for development
- React SWC compiler for fast builds

### TypeScript (`tsconfig.json`)
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases configured

### ESLint (`eslint.config.js`)
- Code quality checks
- Style enforcement
- Best practices validation

### Tailwind (`tailwind.config.ts`)
- Custom color palette
- Extended theme configuration

---

## 📝 Common Tasks

### Adding a New Page

1. Create component in `src/pages/{role}/ComponentName.jsx`
2. Add route in `App.jsx`
3. Import component and add Route element
4. Apply layout (PublicLayout or DashboardLayout)

```javascript
// Example
import MyPage from "./pages/public/MyPage";

<Route path="/mypage" element={<MyPage />} />
```

### Creating a Reusable Component

1. Create file in `src/components/ComponentName.jsx`
2. Define props and functionality
3. Export component
4. Import in pages where needed

```javascript
export const MyComponent = ({ prop1, prop2 }) => {
  return <div>{prop1} - {prop2}</div>;
};
```

### Making an API Call

1. Create service method in `src/services/serviceName.js`
2. Use in component with React Query or direct call
3. Handle loading and error states

```javascript
// In service
export const getMyData = async () => {
  const response = await apiClient.get('/endpoint');
  return response.data;
};

// In component
import { getMyData } from '../services/myService';
const { data, loading, error } = useQuery('key', getMyData);
```

### Updating the Theme

1. Modify color palette in `src/App.jsx`
2. Update theme object properties
3. Changes apply globally to all MUI components

### Adding Authentication to Routes

Use `ProtectedRoute` component:

```javascript
<Route
  path="/customer/profile"
  element={
    <ProtectedRoute role="customer">
      <ProfileDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🐛 Troubleshooting

### Common Issues

#### **"Cannot find module" errors**
- Run `npm install` to ensure all dependencies installed
- Check import paths use correct casing
- Verify path alias configuration in `tsconfig.json`

#### **Development server not starting**
- Ensure port 8080 is available
- Check Node.js version compatibility
- Delete `node_modules` and reinstall
- Try `npm cache clean --force`

#### **Hot Module Replacement (HMR) issues**
- Check browser console for errors
- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)

#### **API connection errors**
- Verify backend server is running on port 5000
- Check `VITE_API_URL` environment variable
- Ensure CORS is configured on backend
- Check network tab in browser DevTools

#### **Build failures**
- Review build output for error messages
- Check for TypeScript type errors: `npm run build`
- Ensure all imported files exist
- Try deleting `dist` folder and rebuilding

#### **Styling issues with Tailwind**
- Verify `tailwind.config.ts` is properly configured
- Check class names are spelled correctly
- Ensure PostCSS is processing CSS files
- Clear cache: `npm run dev` restart

### Debug Mode

Enable debug information:
```bash
DEBUG=* npm run dev
```

### Browser DevTools

1. **React DevTools**: Chrome extension for component inspection
2. **Redux DevTools**: For state debugging
3. **Network Tab**: Check API requests and responses
4. **Console**: View errors and logs

---

## 👥 Contributing

### Code Standards

1. **Component Naming**: PascalCase for components
2. **File Naming**: PascalCase for components, kebab-case for utilities
3. **Props**: Define PropTypes or TypeScript interfaces
4. **Comments**: Add JSDoc comments for complex functions

### Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "feat: description"`
3. Push branch: `git push origin feature/feature-name`
4. Create pull request with description

### Commit Message Format

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: fix styling issues
refactor: refactor code
test: add tests
chore: update dependencies
```

### Pull Request Checklist

- [ ] Code follows project standards
- [ ] Components are tested
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Documentation updated
- [ ] No breaking changes

---

## 📄 License

This project is part of the EcoBazaarX platform developed by EcoBazaarX-Batch-4.

---

## 📞 Support

For issues, questions, or contributions, please:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team
4. Review project documentation

---

## 🔄 Version History

- **v0.0.0** - Initial setup with Vite and React
- **Current** - Active development with all features

---

## 🙏 Acknowledgments

- Material-UI for comprehensive component library
- shadcn/ui for beautifully designed components
- Vite for ultra-fast development experience
- React community for excellent ecosystem
- All contributors and team members

---

**Last Updated**: December 2, 2025

**Repository**: https://github.com/EcoBazaarX-Batch-4/ecobazaax-frontend-main

**Main Branch**: feature/chatbot
