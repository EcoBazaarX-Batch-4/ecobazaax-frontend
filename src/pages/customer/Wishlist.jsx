import { useState, useEffect } from "react";
import { Box, Typography, Grid, Skeleton, Alert, Button } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import ProductGrid from "../../components/ProductGrid";
import { customerService } from "../../services/customerService";
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
      const data = await customerService.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (productId) => {
    // We are in the wishlist, so toggling means "Removing"
    try {
      setWishlist(prev => prev.filter(p => p.id !== productId));
      await customerService.removeFromWishlist(productId);
    } catch (err) {
      console.error("Remove failed", err);
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
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {wishlist.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Favorite sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Your wishlist is empty</Typography>
          <Button component={RouterLink} to="/products" variant="contained" sx={{ mt: 2 }}>Browse Products</Button>
        </Box>
      ) : (
        // Pass the toggle handler so ProductCard knows what to do
        <ProductGrid products={wishlist} onWishlistToggle={handleWishlistToggle} />
      )}
    </Box>
  );
};

export default Wishlist;