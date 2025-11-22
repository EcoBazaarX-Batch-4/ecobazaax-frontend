import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Skeleton,
  Alert,
  Divider,
  Rating,
  TextField,
  Paper,
  Avatar,
  IconButton
} from "@mui/material";
import { ShoppingCart, ArrowBack, FavoriteBorder, Favorite, Park } from "@mui/icons-material";
import { productService } from "../../services/productService";
import { customerService } from "../../services/customerService"; // Ensure this is imported
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import ProductGrid from "../../components/ProductGrid";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, hasRole } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    loadProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const [productData, relatedData, reviewsData] = await Promise.all([
        productService.getProductById(id),
        productService.getRelatedProducts(id),
        productService.getProductReviews(id),
      ]);
      
      setProduct(productData);
      setRelatedProducts(relatedData.products || relatedData || []);
      setReviews(reviewsData.content || reviewsData.reviews || []);
      
      // Check wishlist status if available in response or separate call
      if (productData.inWishlist) {
        setInWishlist(true);
      }

      productService.trackView(id).catch(e => console.warn("Tracking failed", e));
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!hasRole("ROLE_CUSTOMER")) {
      alert("Only customers can shop. Please login with a customer account.");
      return;
    }

    try {
      await addToCart({ productId: parseInt(id), quantity: parseInt(quantity) });
      alert("Added to cart successfully!");
    } catch (err) {
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) return navigate("/login");
    try {
      await customerService.addToWishlist(id);
      setInWishlist(true);
      alert("Added to Wishlist!");
    } catch (err) {
      alert("Could not add to wishlist.");
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await productService.addReview(id, { rating: reviewRating, comment: reviewText });
      setReviewText("");
      setReviewRating(5);
      loadProductData(); // Reload to see new review
    } catch (err) {
      alert("Failed to submit review.");
    }
  };

  if (loading) return <Container sx={{ py: 6 }}><Skeleton height={500} /></Container>;
  if (error || !product) return <Container sx={{ py: 6 }}><Alert severity="error">{error || "Product not found"}</Alert></Container>;

  // Calculate Carbon Value
  const carbonValue = product.cradleToWarehouseFootprint || product.carbonFootprint;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4, color: "text.secondary", "&:hover": { color: "primary.main" } }}
      >
        Back to Shopping
      </Button>

      <Grid container spacing={6}>
        
        {/* --- LEFT: IMAGE SECTION (Styled like ProductCard) --- */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              bgcolor: "#f9fafb", // Matches Card
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              overflow: "hidden",
              height: { xs: "300px", md: "500px" }, // Taller for detail view
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 4
            }}
          >
            <Box
              component="img"
              src={product.imageUrl || "https://via.placeholder.com/600x600?text=Product"}
              alt={product.name}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                mixBlendMode: "multiply" // Premium blending effect
              }}
            />
          </Box>
        </Grid>

        {/* --- RIGHT: DETAILS SECTION --- */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            
            {/* Category / Brand (Optional) */}
            <Typography variant="overline" color="text.secondary" letterSpacing={1} mb={1}>
              {product.category || "Sustainable Goods"}
            </Typography>

            {/* Name */}
            <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: "#1a1a1a", lineHeight: 1.2 }}>
              {product.name}
            </Typography>

            {/* Price & Rating Row */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Typography variant="h4" color="primary.main" fontWeight={700}>
                ₹{product.price}
              </Typography>
              {product.rating > 0 && (
                <Box display="flex" alignItems="center" bgcolor="#FFF8E1" px={1} py={0.5} borderRadius={1}>
                  <Rating value={product.rating} readOnly precision={0.5} size="small" />
                  <Typography variant="body2" fontWeight={600} ml={1} color="#F57F17">
                    ({product.numReviews || reviews.length} reviews)
                  </Typography>
                </Box>
              )}
            </Box>

            {/* PROFESSIONAL CARBON TAG (Matches ProductCard) */}
            {carbonValue && (
              <Box mb={3}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "8px",
                    bgcolor: "#e8f5e9", // Light Green
                    color: "#2e7d32",   // Dark Green text
                    border: "1px solid #c8e6c9",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  <Park sx={{ fontSize: 18, mr: 1 }} />
                  Eco-Impact: {carbonValue} kg CO₂e
                </Box>
                <Typography variant="caption" display="block" mt={1} color="text.secondary">
                  *This product has a significantly lower carbon footprint than market average.
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}>
              {product.description}
            </Typography>

            <Box flexGrow={1} />

            {/* Action Area */}
            <Box display="flex" gap={2} alignItems="center" mt={4}>
              <TextField
                type="number"
                label="Qty"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                sx={{ width: 80 }}
                size="medium"
              />
              
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stockQuantity < 1}
                sx={{ 
                  flexGrow: 1, 
                  height: 56, 
                  fontSize: "1.1rem",
                  borderRadius: 2,
                  textTransform: "none"
                }}
              >
                {product.stockQuantity < 1 ? "Out of Stock" : "Add to Cart"}
              </Button>

              <IconButton 
                onClick={handleAddToWishlist} 
                sx={{ 
                  height: 56, 
                  width: 56, 
                  border: "1px solid #e0e0e0", 
                  borderRadius: 2,
                  color: inWishlist ? "error.main" : "text.secondary"
                }}
              >
                {inWishlist ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* --- REVIEWS SECTION --- */}
      <Box mt={8}>
        <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>
          Customer Reviews
        </Typography>
        
        {isAuthenticated && (
          <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: "#FAFAFA", borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>Write a Review</Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
               <Typography component="legend">Your Rating:</Typography>
               <Rating value={reviewRating} onChange={(e, value) => setReviewRating(value)} />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts about this sustainable product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ mb: 2, bgcolor: "white" }}
            />
            <Button variant="contained" onClick={handleSubmitReview} disabled={!reviewText}>
              Submit Review
            </Button>
          </Paper>
        )}

        <Grid container spacing={3}>
          {reviews.length === 0 ? (
             <Grid item xs={12}><Typography color="text.secondary">No reviews yet. Be the first!</Typography></Grid>
          ) : (
            reviews.map((review, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 3 }}>
                  <Box display="flex" gap={2} mb={1}>
                    <Avatar sx={{ bgcolor: "primary.light" }}>{review.userName?.charAt(0).toUpperCase()}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{review.userName}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {review.comment}
                  </Typography>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* --- RELATED PRODUCTS --- */}
      {relatedProducts.length > 0 && (
        <Box mt={8} mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom mb={4}>
            You Might Also Like
          </Typography>
          <ProductGrid products={relatedProducts} />
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;