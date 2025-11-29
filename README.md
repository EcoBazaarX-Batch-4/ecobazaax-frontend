# EcoBazzar X - Project Structure

## Overview
EcoBazzar X is a complete full-stack e-commerce platform for sustainable products built with React + Vite (JavaScript only).

## Technology Stack
- **Frontend**: React 18, Vite, JavaScript (ES6+)
- **UI Framework**: Material-UI (MUI) v5/v6
- **State Management**: React Context API (AuthContext, CartContext)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Backend API**: http://localhost:8080 (separate backend service)

## Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── StatCard.jsx
│   ├── CarbonBadge.jsx
│   └── ProtectedRoute.jsx
│
├── contexts/            # Global state management
│   ├── AuthContext.jsx  # Authentication & user state
│   └── CartContext.jsx  # Shopping cart state
│
├── layouts/             # Page layouts
│   ├── PublicLayout.jsx      # Header + Footer layout
│   └── DashboardLayout.jsx   # Sidebar dashboard layout
│
├── pages/               # All application pages
│   ├── public/          # Public pages (no auth required)
│   │   ├── Home.jsx
│   │   ├── ProductListing.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── SearchResults.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Leaderboard.jsx
│   │
│   ├── customer/        # Customer portal (ROLE_CUSTOMER)
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── ProfileDashboard.jsx
│   │   ├── AddressBook.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── OrderDetail.jsx
│   │   └── Wishlist.jsx
│   │
│   ├── seller/          # Seller portal (ROLE_SELLER)
│   │   ├── SellerDashboard.jsx
│   │   ├── ProductList.jsx
│   │   ├── CreateProduct.jsx
│   │   ├── EditProduct.jsx
│   │   ├── SellerOrders.jsx
│   │   └── StoreSettings.jsx
│   │
│   └── admin/           # Admin portal (ROLE_ADMIN)
│       ├── AdminDashboard.jsx
│       ├── UserManagement.jsx
│       ├── SellerApprovals.jsx
│       ├── ConfigHub.jsx
│       └── Reports.jsx
│
├── services/            # API service layer
│   ├── api.js           # Axios instance with interceptors
│   ├── authService.js   # Authentication endpoints
│   ├── productService.js # Product endpoints
│   ├── cartService.js   # Cart endpoints
│   ├── customerService.js # Customer endpoints
│   ├── sellerService.js # Seller endpoints
│   └── adminService.js  # Admin endpoints
│
├── App.jsx             # Main app with routes & theme
├── main.jsx            # React entry point
└── index.css           # Global styles

```

## Backend API Endpoints

### Public Endpoints
- `GET /api/v1/recommendations/homepage` - Homepage recommendations
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/search` - Search products
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/{id}/related` - Related products
- `GET /api/v1/products/{id}/reviews` - Product reviews
- `POST /api/v1/products/{id}/reviews` - Add review
- `POST /api/v1/tracking/view/{id}` - Track product view
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Customer Endpoints (ROLE_CUSTOMER)
- `GET /api/v1/profile/me` - Get user profile
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/add` - Add to cart
- `PUT /api/v1/cart/update/{id}` - Update cart item
- `DELETE /api/v1/cart/remove/{id}` - Remove from cart
- `POST /api/v1/checkout` - Checkout
- `GET /api/v1/profile/addresses` - Get addresses
- `POST /api/v1/profile/addresses` - Add address
- `PUT /api/v1/profile/addresses/{id}` - Update address
- `DELETE /api/v1/profile/addresses/{id}` - Delete address
- `GET /api/v1/profile/orders` - Get orders
- `GET /api/v1/profile/orders/{id}` - Get order details
- `GET /api/v1/insights/profile` - Customer insights
- `GET /api/v1/profile/eco-points-history` - Eco points history

### Seller Endpoints (ROLE_SELLER)
- `GET /api/v1/seller/products` - Get seller products
- `POST /api/v1/seller/products` - Create product
- `PUT /api/v1/seller/products/{id}` - Update product
- `DELETE /api/v1/seller/products/{id}` - Delete product
- `GET /api/v1/insights/seller` - Seller insights
- `GET /api/v1/insights/seller/product-performance` - Product performance
- `GET /api/v1/seller/orders` - Get seller orders

### Admin Endpoints (ROLE_ADMIN)
- `GET /api/v1/insights/admin` - Admin insights
- `GET /api/v1/insights/admin/leaderboards` - Global leaderboards
- `GET /api/v1/admin/users` - Get all users
- `PUT /api/v1/admin/users/{id}` - Update user
- `DELETE /api/v1/admin/users/{id}` - Delete user
- `GET /api/v1/admin/seller-applications` - Get seller applications
- `POST /api/v1/admin/seller-applications/{id}/approve` - Approve seller
- `POST /api/v1/admin/seller-applications/{id}/reject` - Reject seller
- `GET /api/v1/admin/config/{key}` - Get config value
- `PUT /api/v1/admin/config/{key}` - Update config
- `GET /api/v1/admin/reports/{type}` - Generate reports

## Key Features

### Authentication System
- JWT-based authentication
- Role-based access control (Customer, Seller, Admin)
- Protected routes with role verification
- Automatic token refresh on API calls

### Cart System
- Real-time cart synchronization
- Persistent cart across sessions
- Quantity management
- Cart summary with totals

### Design System
- Material-UI theming
- Primary color: #2ECC71 (Eco Green)
- Secondary color: #1976d2 (Blue)
- Responsive design for all screen sizes
- Clean, modern aesthetic

### Performance
- React.lazy() for code splitting
- Lazy loading for seller and admin portals
- Optimized re-renders with Context API
- Axios interceptors for efficient API calls

## Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on: http://localhost:5173

3. **Ensure backend is running**:
   Backend should be running on: http://localhost:8080

## Environment Setup

Make sure your backend API is running on `http://localhost:8080` before starting the frontend. The frontend is configured to connect to this endpoint in `src/services/api.js`.

## User Roles

1. **Customer** (ROLE_CUSTOMER):
   - Browse and search products
   - Add to cart and checkout
   - Manage addresses
   - View order history
   - Earn and track eco-points

2. **Seller** (ROLE_SELLER):
   - Manage product inventory
   - View sales analytics
   - Process orders
   - Configure store settings

3. **Admin** (ROLE_ADMIN):
   - Manage all users
   - Approve seller applications
   - Configure platform settings
   - View comprehensive reports
   - Monitor platform health

# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
