import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; // <-- 1. IMPORT THE CART HOOK
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Badge 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';

function Header() {
  // Get all the data we need from our global contexts
  const { isAuthenticated, user, logout, loading: authLoading, roles } = useAuth();
  const { cartItemCount, loading: isCartLoading } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if the user is a customer to decide if we show the cart
  const isCustomer = roles.includes('ROLE_CUSTOMER');

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        {/* Logo and Title */}
        <IconButton
          component={RouterLink}
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

export default Header;