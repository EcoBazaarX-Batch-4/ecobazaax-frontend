import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminOrderManagement from './pages/admin/AdminOrderManagement'; // <-- Import
import AdminDashboardLayout from "./components/admin/AdmnDashboardlayout";

// Public Pages
import Home from "./pages/public/Home";
import ProductListing from "./pages/public/ProductListing";
import ProductDetail from "./pages/public/ProductDetail";
import SearchResults from "./pages/public/SearchResults";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Leaderboard from "./pages/public/Leaderboard";

// Customer Pages - Lazy loaded
const Cart = lazy(() => import("./pages/customer/Cart"));
const Checkout = lazy(() => import("./pages/customer/Checkout"));
const ProfileDashboard = lazy(() => import("./pages/customer/ProfileDashboard"));
const AddressBook = lazy(() => import("./pages/customer/AddressBook"));
const OrderHistory = lazy(() => import("./pages/customer/OrderHistory"));
const OrderDetail = lazy(() => import("./pages/customer/OrderDetail"));
const Wishlist = lazy(() => import("./pages/customer/Wishlist"));
const SecuritySettingsPage = lazy(() => import("./pages/customer/SecuritySettingsPage"));

// Seller Pages - Lazy loaded
const SellerDashboard = lazy(() => import("./pages/seller/SellerDashboard"));
const ProductList = lazy(() => import("./pages/seller/ProductList"));
const CreateProduct = lazy(() => import("./pages/seller/CreateProduct"));
const EditProduct = lazy(() => import("./pages/seller/EditProduct"));
const SellerOrders = lazy(() => import("./pages/seller/SellerOrders"));
const StoreSettings = lazy(() => import("./pages/seller/StoreSettings"));

// Admin Pages - Lazy loaded
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const SellerApprovals = lazy(() => import("./pages/admin/SellerApprovals"));
const ConfigHub = lazy(() => import("./pages/admin/ConfigHub"));
const Reports = lazy(() => import("./pages/admin/Reports"));
import { Toaster } from "@/components/ui/toaster";

// Protected Route Components
import { ProtectedRoute, SellerProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2ECC71",
      light: "#58D68D",
      dark: "#27AE60",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F4F6F8",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress color="primary" />
  </Box>
);

function App() {
  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Suspense fallback={<LoadingFallback />}>

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductListing />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="products/search" element={<SearchResults />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="leaderboard/global" element={<Leaderboard />} />
              </Route>

              {/* Customer Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <PublicLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Cart />} />
              </Route>
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <PublicLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Checkout />} />
              </Route>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout type="customer" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ProfileDashboard />} />
                <Route path="addresses" element={<AddressBook />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="security" element={<SecuritySettingsPage />} />
              </Route>

              {/* Seller Routes */}
              <Route
                path="/seller"
                element={
                  <SellerProtectedRoute>
                    <DashboardLayout type="seller" />
                  </SellerProtectedRoute>
                }
              >
                <Route path="dashboard" element={<SellerDashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<CreateProduct />} />
                <Route path="products/:id/edit" element={<EditProduct />} />
                <Route path="orders" element={<SellerOrders />} />
                <Route path="settings" element={<StoreSettings />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardLayout type="admin" />
                  </AdminProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="orders" element={<AdminOrderManagement />} />
                <Route path="seller-applications" element={<SellerApprovals />} />
                <Route path="config/*" element={<ConfigHub />} />
                <Route path="reports" element={<Reports />} />

              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

          </Suspense>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
