import { useState, useEffect } from "react";
import { Grid, Box, Typography, Skeleton, Alert } from "@mui/material";
import { People, Store, ShoppingCart, TrendingUp } from "@mui/icons-material";
import { adminService } from "../../services/adminService";
import StatCard from "../../components/StatCard";
import AdminLeaderboardList from "../../components/admin/AdminLeaderboardList";

const AdminDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [leaderboards, setLeaderboards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stats, boards] = await Promise.all([
        adminService.getAdminInsights(),
        adminService.getLeaderboards()
      ]);
      setInsights(stats);
      setLeaderboards(boards);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box p={3}><Skeleton variant="rectangular" height={200} /></Box>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Admin Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={insights?.totalUsers || 0} icon={<People sx={{ fontSize: 32 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Sellers" value={insights?.totalSellers || 0} icon={<Store sx={{ fontSize: 32 }} />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value={insights?.totalOrders || 0} icon={<ShoppingCart sx={{ fontSize: 32 }} />} color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue" value={`₹${insights?.totalRevenue?.toFixed(2) || 0}`} icon={<TrendingUp sx={{ fontSize: 32 }} />} color="success" />
        </Grid>
      </Grid>

      <AdminLeaderboardList data={leaderboards} />
    </Box>
  );
};

export default AdminDashboard;