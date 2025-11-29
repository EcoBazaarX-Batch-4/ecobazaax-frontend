import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  ShoppingCart,
  Person,
  LocationOn,
  Receipt,
  Favorite,
  Inventory,
  AddBox,
  Settings,
  People,
  ApprovalOutlined,
  Assessment,
  Build,
  Logout,
  Security,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import ChatButton from "../components/ChatButton";

const drawerWidth = 260;

const DashboardLayout = ({ type }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getMenuItems = () => {
    if (type === "customer") {
      return [
        { text: "Dashboard", icon: <Dashboard />, path: "/profile" },
        { text: "Orders", icon: <Receipt />, path: "/profile/orders" },
        { text: "Addresses", icon: <LocationOn />, path: "/profile/addresses" },
        { text: "Wishlist", icon: <Favorite />, path: "/profile/wishlist" },
        { text: "Security", icon: <Security />, path: "/profile/security" },
      ];
    } else if (type === "seller") {
      return [
        { text: "Dashboard", icon: <Dashboard />, path: "/seller/dashboard" },
        { text: "Products", icon: <Inventory />, path: "/seller/products" },
        { text: "Add Product", icon: <AddBox />, path: "/seller/products/new" },
        { text: "Orders", icon: <ShoppingCart />, path: "/seller/orders" },
        { text: "Settings", icon: <Settings />, path: "/seller/settings" },
      ];
    } else if (type === "admin") {
      return [
        { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
        { text: "Users", icon: <People />, path: "/admin/users" },
        { text: "Seller Applications", icon: <ApprovalOutlined />, path: "/admin/seller-applications" },
        { text: "Configuration", icon: <Build />, path: "/admin/config" },
        { text: "Reports", icon: <Assessment />, path: "/admin/reports" },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="primary" fontWeight={700}>
          Eco Bazaar X
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: "primary.main" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="text.primary" sx={{ flexGrow: 1 }}>
            {type === "customer" && "My Account"}
            {type === "seller" && "Seller Portal"}
            {type === "admin" && "Admin Panel"}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar sx={{ bgcolor: "primary.main" }}>{user?.email?.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
  
 
  {/* Go to Products Page */}
  <MenuItem onClick={() => navigate("/products")}>
    <ListItemIcon>
      <ShoppingCart fontSize="small" />
    </ListItemIcon>
    Products
  </MenuItem>
 {/* Logout */}
  <MenuItem onClick={handleLogout}>
    <ListItemIcon>
      <Logout fontSize="small" />
    </ListItemIcon>
    Logout
  </MenuItem>

</Menu>

        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
      <ChatButton />
    </Box>
  );
};

export default DashboardLayout;
