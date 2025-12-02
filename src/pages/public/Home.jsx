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
import { ArrowForward } from "@mui/icons-material";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/ProductGrid";

const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    topSellers: [],
    newArrivals: [],
    lowestCarbon: [],
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
        lowestCarbon: response.topLowestCarbon || [],
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
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
      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          color: "white",
          py: { xs: 8, md: 12 },
          minHeight: { xs: "60vh", md: "75vh" }, // ✅ FIXED HEIGHT
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* BACKGROUND IMAGE */}
        <Box
          component="img"
          src="https://thumbs.dreamstime.com/b/green-shopping-cart-filled-eco-friendly-products-surrounded-lush-tropical-foliage-background-363406854.jpg"
          alt="Eco-friendly shopping"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.45)",
            zIndex: 0,
          }}
        />

        {/* HERO CONTENT */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight={700} sx={{ mb: 1 }}>
                Shop Sustainably
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Discover products that make a difference. Every purchase builds
                a greener future.
              </Typography>

              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/products")}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  Shop Now
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/leaderboard/global")}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Leaderboard
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ERROR */}
      {error && (
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      )}

      {/* PRODUCT SECTIONS */}
      {loading ? (
        <Container sx={{ py: 8 }}>
          <Skeleton variant="rectangular" height={400} />
        </Container>
      ) : (
        <>
          {renderSection("Fresh Arrivals", data.newArrivals)}
          {renderSection("Best Sellers", data.topSellers, "#f9fafb")}
          {renderSection("Lowest Carbon Footprint", data.lowestCarbon)}
        </>
      )}
    </Box>
  );
};

export default Home;
