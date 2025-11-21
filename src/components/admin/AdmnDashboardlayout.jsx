import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar
} from "@mui/material";
import {
  Dashboard, People, Approval, Settings, Assessment, Menu as MenuIcon, LocalShipping
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 260;

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "User Management", icon: <People />, path: "/admin/users" },
    // --- NEW ITEM ---
    { text: "All Orders", icon: <LocalShipping />, path: "/admin/orders" },
    // ----------------
    { text: "Seller Approvals", icon: <Approval />, path: "/admin/seller-applications" },
    { text: "Configuration", icon: <Settings />, path: "/admin/config" },
    { text: "Reports", icon: <Assessment />, path: "/admin/reports" },
  ];

  // ... (rest of component remains exactly the same)
  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" color="primary" fontWeight={700}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname.startsWith(item.path) ? "primary.main" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: "white", color: "text.primary", boxShadow: 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(i => location.pathname.startsWith(i.path))?.text || "Admin"}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">{user?.name}</Typography>
            <Avatar sx={{ bgcolor: "secondary.main" }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }} open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;