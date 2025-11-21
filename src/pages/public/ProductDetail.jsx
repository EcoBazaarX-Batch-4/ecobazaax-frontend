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
  Chip
} from "@mui/material";
import { ShoppingCart, ArrowBack, FavoriteBorder } from "@mui/icons-material";
import { productService } from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import CarbonBadge from "../../components/CarbonBadge";
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
      if (isAuthenticated) {
        setInWishlist(data.inWishlist);
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
      loadProductData();
    } catch (err) {
      alert("Failed to submit review.");
    }
  };

  if (loading)
    return (
      <Container sx={{ py: 6 }}>
        <Skeleton height={400} />
      </Container>
    );
  if (error || !product)
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{error || "Product not found"}</Alert>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Grid container spacing={4}>
        
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: { xs: "260px", sm: "320px", md: "380px" }, 
              width: "100%",
            }}
          >
            <img
              src={product.imageUrl || "https://via.placeholder.com/600x400?text=No+Image"}
              alt={product.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
            ₹{product.price}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>

          {product.cradleToWarehouseFootprint && (
            <Box mb={3}>
              <CarbonBadge carbonFootprint={product.cradleToWarehouseFootprint} />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box display="flex" gap={2} alignItems="center" mb={3}>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              fullWidth
              disabled={product.stockQuantity < 1}
            >
              {product.stockQuantity < 1 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button variant="outlined" size="large" onClick={handleAddToWishlist} sx={{ minWidth: "50px" }}>
              {inWishlist ? <FavoriteBorder color="error" /> : <FavoriteBorder />}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box mt={8}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Customer Reviews
        </Typography>
        {isAuthenticated && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Write a Review
            </Typography>
            <Rating value={reviewRating} onChange={(e, value) => setReviewRating(value)} size="large" />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ mb: 2, mt: 2 }}
            />
            <Button variant="contained" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </Paper>
        )}
        <Box display="flex" flexDirection="column" gap={3}>
          {reviews.map((review, index) => (
            <Paper key={index} sx={{ p: 3 }}>
              <Box display="flex" gap={2} mb={2}>
                <Avatar>{review.userName?.charAt(0).toUpperCase()}</Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {review.userName}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography variant="body1">{review.comment}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {relatedProducts.length > 0 && (
        <Box mt={8}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Related Products
          </Typography>
          <ProductGrid products={relatedProducts} />
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;
