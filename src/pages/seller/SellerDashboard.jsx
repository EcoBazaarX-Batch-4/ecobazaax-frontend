import { useState, useEffect } from "react";
import { Grid, Box, Typography, Skeleton, Alert, Paper } from "@mui/material";
import { Inventory, TrendingUp, ShoppingCart, AttachMoney } from "@mui/icons-material";
import { sellerService } from "../../services/sellerService";
import StatCard from "../../components/StatCard";

const SellerDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [insightsData, performanceData] = await Promise.all([
        sellerService.getSellerInsights(),
        sellerService.getProductPerformance(),
      ]);
      
      setInsights(insightsData);
      // FIX: Backend returns { topSelling: [], lowestStock: [], ... }
      setTopSelling(performanceData.topSelling || []); 
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>Seller Dashboard</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}><Skeleton variant="rectangular" height={120} /></Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Seller Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Products" value={insights?.totalProducts || 0} icon={<Inventory sx={{ fontSize: 32 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {/* FIX: Use totalRevenue and Rupee symbol */}
          <StatCard title="Total Revenue" value={`₹${insights?.totalRevenue?.toFixed(2) || "0.00"}`} icon={<AttachMoney sx={{ fontSize: 32 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value={insights?.totalOrders || 0} icon={<ShoppingCart sx={{ fontSize: 32 }} />} color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {/* FIX: Use averageProductCarbon */}
          <StatCard title="Avg Carbon" value={`${insights?.averageProductCarbon?.toFixed(2) || 0} kg`} icon={<TrendingUp sx={{ fontSize: 32 }} />} color="secondary" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Top Performing Products</Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {topSelling.length === 0 ? (
            <Typography color="text.secondary">No sales data available yet</Typography>
          ) : (
            topSelling.slice(0, 5).map((product, index) => (
              <Box key={product.id || index} display="flex" justifyContent="space-between" alignItems="center" p={2} sx={{ bgcolor: "background.default", borderRadius: 1 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box component="img" src={product.imageUrl || "https://via.placeholder.com/60"} alt={product.name} sx={{ width: 60, height: 60, objectFit: "contain", borderRadius: 1, border: "1px solid #eee" }} />
                  <Box>
                    <Typography fontWeight={600}>{product.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Stock: {product.stockQuantity}</Typography>
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary">₹{product.price?.toFixed(2)}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SellerDashboard;