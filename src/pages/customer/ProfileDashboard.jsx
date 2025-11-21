import { useState, useEffect } from "react";
import { 
  Grid, Box, Typography, Paper, Skeleton, Alert, Chip, Divider, Button 
} from "@mui/material";
import { 
  Receipt, Park, TrendingUp, LocalShipping, 
  Store, HourglassEmpty, CheckCircle, Cancel,
  AccountBalanceWallet, ContentCopy
} from "@mui/icons-material";
import { customerService } from "../../services/customerService";
import { sellerService } from "../../services/sellerService";
import { useAuth } from "../../contexts/AuthContext"; // <-- Import AuthContext
import StatCard from "../../components/StatCard";

const ProfileDashboard = () => {
  const { user } = useAuth(); // Get logged-in user details
  const [insights, setInsights] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [sellerStatus, setSellerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [insightsData, pointsData] = await Promise.all([
        customerService.getProfileInsights(),
        customerService.getEcoPointsHistory(),
      ]);
      
      setInsights(insightsData);
      // FIX: Backend returns paginated list in 'content', not 'history'
      setRecentActivity(pointsData.content || []);

      try {
        const status = await sellerService.getApplicationStatus();
        setSellerStatus(status);
      } catch (e) {
        // Ignore if no application exists
      }

    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      alert("Referral code copied!");
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>My Dashboard</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Calculate Wallet Value (Example: 1 Point = ₹0.10)
  const walletValue = (user?.ecoPoints || 0) * 0.10;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* --- NEW: Profile & Wallet Section --- */}
      <Grid container spacing={3} mb={4}>
        {/* User Info Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" fontWeight={600}>Welcome, {user?.name}!</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Typography variant="subtitle2" fontWeight={600}>Referral Code:</Typography>
                <Chip 
                  label={user?.referralCode || "N/A"} 
                  variant="outlined" 
                  size="small" 
                  onDelete={copyReferral}
                  deleteIcon={<ContentCopy />}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Wallet Card */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AccountBalanceWallet sx={{ color: 'white' }} />
              <Typography variant="subtitle1" fontWeight={500}>Eco Wallet</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              {user?.ecoPoints || 0} Pts
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              ≈ ₹{walletValue.toFixed(2)} Value
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Seller Status Banner (Preserved) */}
      {sellerStatus && sellerStatus !== "NOT_APPLICABLE" && (
        <Paper 
          sx={{ 
            p: 3, mb: 4, borderLeft: 6, 
            borderColor: sellerStatus === 'APPROVED' ? 'success.main' : sellerStatus === 'REJECTED' ? 'error.main' : 'warning.main' 
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap={2} alignItems="center">
              <Store color="action" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>Seller Application</Typography>
                <Typography variant="body2" color="text.secondary">
                  {sellerStatus === "PENDING" && "Application under review."}
                  {sellerStatus === "APPROVED" && "You are a verified seller!"}
                  {sellerStatus === "REJECTED" && "Application not approved."}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={sellerStatus} 
              color={sellerStatus === 'APPROVED' ? 'success' : sellerStatus === 'REJECTED' ? 'error' : 'warning'}
            />
          </Box>
        </Paper>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={insights?.totalOrders || 0}
            icon={<Receipt sx={{ fontSize: 32 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {/* FIX: Use backend key 'currentEcoPoints' or fallback to user context */}
          <StatCard
            title="Eco Points"
            value={insights?.currentEcoPoints || user?.ecoPoints || 0}
            icon={<Park sx={{ fontSize: 32 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {/* FIX: Use backend key 'lifetimeTotalCarbon' */}
          <StatCard
            title="Carbon Saved"
            value={`${insights?.lifetimeTotalCarbon?.toFixed(2) || 0} kg`}
            icon={<TrendingUp sx={{ fontSize: 32 }} />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={insights?.activeOrderCount || 0} // Check exact backend key (often activeOrderCount or activeOrders)
            icon={<LocalShipping sx={{ fontSize: 32 }} />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Recent Activity Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Recent Eco Points Activity
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {recentActivity.length === 0 ? (
            <Typography color="text.secondary">No activity yet</Typography>
          ) : (
            recentActivity.slice(0, 5).map((point, index) => (
              <Box
                key={point.id || index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                sx={{ bgcolor: "background.default", borderRadius: 1 }}
              >
                <Box>
                  <Typography fontWeight={600}>{point.reason || point.description}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(point.transactionDate || point.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  // Use pointsChanged or points property depending on backend DTO
                  color={(point.pointsChanged || point.points) > 0 ? "success.main" : "error.main"}
                >
                  {(point.pointsChanged || point.points) > 0 ? "+" : ""}
                  {point.pointsChanged || point.points}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileDashboard;