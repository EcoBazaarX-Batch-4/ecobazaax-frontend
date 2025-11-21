import { useState, useEffect } from "react";
import { Box, Typography, Grid, Skeleton, Alert, Button } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import ProductGrid from "../../components/ProductGrid";
import { customerService } from "../../services/customerService"; // Use service
import { Link as RouterLink } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      // FIX: Real API call
      const data = await customerService.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (productId) => {
    try {
        // Optimization: Remove locally first for speed
        setWishlist(prev => prev.filter(p => p.id !== productId));
        await customerService.removeFromWishlist(productId);
    } catch(err) {
        loadWishlist(); // Revert if failed
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>My Wishlist</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (<Grid item xs={12} sm={6} md={4} lg={3} key={item}><Skeleton variant="rectangular" height={200} /></Grid>))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>My Wishlist</Typography>

      {wishlist.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Favorite sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Your wishlist is empty</Typography>
          <Button component={RouterLink} to="/products" variant="contained" sx={{ mt: 2 }}>Browse Products</Button>
        </Box>
      ) : (
        <ProductGrid products={wishlist} onWishlistToggle={handleWishlistToggle} />
      )}
    </Box>
  );
};

export default Wishlist;