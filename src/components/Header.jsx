import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  InputBase,
  alpha,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import {
  ShoppingCart,
  Search as SearchIcon,
  Person,
  Dashboard,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const { getCartItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (hasRole("ROLE_ADMIN")) return "/admin/dashboard";
    if (hasRole("ROLE_SELLER")) return "/seller/dashboard";
    return "/profile";
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white", boxShadow: 1 }}>
      <Toolbar>
        {/* Logo + Title */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {/* Replaced Spa Icon with Image */}
          <img
            src="/logo.png"
            alt="Eco Bazaar X"
            style={{ width: 52, objectFit: "contain" }}
          />

          <Typography
            variant="h6"
            component="div"
            color="primary"
            fontWeight={700}
            sx={{ flexGrow: 0 }}
          >
            Eco Bazaar X
          </Typography>
        </Box>

        {/* Search Bar */}
       <Box
  component="form"
  onSubmit={handleSearch}
  sx={{
    position: "relative",
    borderRadius: 3,
    backgroundColor: alpha("#2ECC71", 0.08),
    "&:hover": { backgroundColor: alpha("#2ECC71", 0.12) },
    ml: 40,
    flexGrow: 1,
    maxWidth: 600,
    display: { xs: "none", md: "flex" },
    px: 2,
  }}
>
  <InputBase
    placeholder="Search eco-friendly products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    startAdornment={
      <SearchIcon
        sx={{
          mr: 1.5,
          color: "text.secondary",
          fontSize: 24,
        }}
      />
    }
    sx={{
      width: "100%",
      py: 1.2,
      "& .MuiInputBase-input": {
        padding: 0,
      },
    }}
  />
</Box>


        <Box sx={{ flexGrow: 1 }} />

        {/* Right Side Buttons */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/products"
            sx={{ color: "text.primary", textTransform: "none" }}
          >
            Products
          </Button>

          {/* Cart for Customer Only */}
          {isAuthenticated && hasRole("ROLE_CUSTOMER") && (
            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={getCartItemCount()} color="primary">
                <ShoppingCart sx={{ color: "text.primary" }} />
              </Badge>
            </IconButton>
          )}

          {/* Profile / Login */}
          {isAuthenticated ? (
            <>
              <IconButton onClick={handleProfileMenuOpen}>
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate(getDashboardPath());
                    handleProfileMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Person />}
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/register")}
                sx={{ textTransform: "none" }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
