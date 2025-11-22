import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Skeleton,
  Alert,
} from "@mui/material";
import { ArrowForward, Park, LocalShipping, Verified } from "@mui/icons-material";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/ProductGrid";

const Home = () => {
  const navigate = useNavigate();
  // Store the full recommendations object
  const [data, setData] = useState({
    topSellers: [],
    newArrivals: [],
    lowestCarbon: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await productService.getHomeRecommendations();
      setData({
        topSellers: response.topSellers || [],
        newArrivals: response.newArrivals || [],
        lowestCarbon: response.topLowestCarbon || [] // Map backend field
      });
    } catch (err) {
      setError("Failed to load recommendations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title, products, bgColor = "transparent") => (
    <Box sx={{ bgcolor: bgColor, py: 8 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          <Button
            endIcon={<ArrowForward />}
            onClick={() => navigate("/products")}
            sx={{ textTransform: "none" }}
          >
            View All
          </Button>
        </Box>
        <ProductGrid products={products} />
      </Container>
    </Box>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" fontWeight={700} gutterBottom>
                Shop Sustainably
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                Discover products that make a difference. Every purchase builds a greener future.
              </Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/products")}
                  sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/leaderboard/global")}
                  sx={{ borderColor: "white", color: "white", "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
                >
                  Leaderboard
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {error && <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>}

      {loading ? (
        <Container sx={{ py: 8 }}><Skeleton variant="rectangular" height={400} /></Container>
      ) : (
        <>
          {/* 1. New Arrivals */}
          {renderSection("Fresh Arrivals", data.newArrivals)}
          
          {/* 2. Top Sellers (with background) */}
          {renderSection("Best Sellers", data.topSellers, "#f9fafb")}
          
          {/* 3. Lowest Carbon */}
          {renderSection("Lowest Carbon Footprint", data.lowestCarbon)}
        </>
      )}
    </Box>
  );
};

export default Home;