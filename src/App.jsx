import React from 'react';
import { Routes, Route, Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import { Box, Container, Badge, IconButton, Typography, AppBar, Toolbar, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';

// --- Import all our pages from their files ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetailPage';
// We'll add AddressBookPage, CartPage, etc. here as we build them

// --- Import our reusable components ---
import Footer from './components/Footer'; 
// Note: We are defining Header (Navbar) inside App.jsx for now

// --- Main App Component (Defines Routes) ---
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          {/* We will add /profile/addresses, /cart, /checkout here */}
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

// --- Layout Component ---
function Layout() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh', // Full viewport height
    }}>
      <Header /> {/* Our Smart Navbar */}
      
      <Container component="main" sx={{ 
        flexGrow: 1, // Allows this main area to grow
        py: 3 // Padding top and bottom
      }}>
        <Outlet /> {/* Renders the current page */}
      </Container>
      
      <Footer /> {/* Our Footer */}
    </Box>
  );
}

// --- Smart Navbar Component (renamed to Header) ---
function Header() {
  const { isAuthenticated, user, logout, loading: authLoading, roles } = useAuth();
  const { cartItemCount, loading: isCartLoading } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCustomer = roles.includes('ROLE_CUSTOMER');

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        {/* Logo and Title */}
        <IconButton
          component={RouterLink} // Use RouterLink for navigation
          to="/"
          edge="start"
          color="inherit"
          aria-label="home"
          sx={{ mr: 1, color: '#2ECC71' }} // Our Eco-Green color
        >
          <StorefrontIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          Eco Bazar X
        </Typography>

        {/* Right-side links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {authLoading ? (
            <Typography variant="body2">Loading...</Typography>
          ) : isAuthenticated ? (
            // --- User is Logged In ---
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Hello, {user.name}!
              </Typography>
              
              {/* Role-based Links */}
              {roles.includes('ROLE_ADMIN') && (
                <Button component={RouterLink} to="/admin/dashboard" color="inherit">Admin</Button>
              )}
              {roles.includes('ROLE_SELLER') && (
                <Button component={RouterLink} to="/seller/dashboard" color="inherit">Seller</Button>
              )}
              <Button component={RouterLink} to="/profile" color="inherit">Profile</Button>
              
              {/* Show Cart icon *only* for Customers */}
              {isCustomer && (
                <IconButton component={RouterLink} to="/cart" color="inherit">
                  <Badge badgeContent={isCartLoading ? '...' : cartItemCount} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}
              
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            // --- User is Logged Out ---
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/register" variant="contained" sx={{ 
                backgroundColor: '#2ECC71', // Eco-Green
                '&:hover': { backgroundColor: '#27ae60' } 
              }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// --- Protected Route Component ---
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // If we are still checking for a token, show a loading message
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the page they asked for
  return <Outlet />;
}

// --- Re-usable RouterLink (from MUI docs) ---
// This ensures MUI links work with React Router
const RouterLink = React.forwardRef(function RouterLink(props, ref) {
  return <Link ref={ref} {...props} />;
});

export default App;