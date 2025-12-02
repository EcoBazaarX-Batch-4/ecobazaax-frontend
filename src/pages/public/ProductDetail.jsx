import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Skeleton,
  Divider,
  Rating,
  TextField,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { ShoppingCart, ArrowBack, FavoriteBorder, Favorite } from "@mui/icons-material";

import { productService } from "../../services/productService";
import { customerService } from "../../services/customerService";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

import ProductGrid from "../../components/ProductGrid";

// ✅ Correct toast import
import { toast } from "@/hooks/use-toast";

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

  // Cleaner showToast wrapper
  const showToast = (msg, type = "success") => {
    toast({
      title: msg,
      variant: type === "error" ? "destructive" : "default",
    });
  };

  useEffect(() => {
    loadProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);

      const [productData, relatedData, reviewData] = await Promise.all([
        productService.getProductById(id),
        productService.getRelatedProducts(id),
        productService.getProductReviews(id),
      ]);

      setProduct(productData);
      setRelatedProducts(relatedData.products || relatedData || []);
      setReviews(reviewData.content || reviewData.reviews || []);

      if (productData.inWishlist) setInWishlist(true);

      // tracking (ignore failure)
      productService.trackView(id).catch(() => {});
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Add to Cart
  // -------------------------
  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate("/login");

    if (!hasRole("ROLE_CUSTOMER")) {
      showToast("Only customers can shop. Please login with a customer account.", "error");
      return;
    }

    try {
      await addToCart({ productId: Number(id), quantity: Number(quantity) });
      showToast("Added to cart successfully!", "success");
    } catch (err) {
      showToast("Failed to add product!", "error");
    }
  };

  // -------------------------
  // Wishlist
  // -------------------------
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      await customerService.addToWishlist(id);
      setInWishlist(true);
      showToast("Added to Wishlist!", "success");
    } catch (err) {
      showToast("Could not add to wishlist.", "error");
    }
  };

  // -------------------------
  // Review Submission
  // -------------------------
  const handleSubmitReview = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      await productService.addReview(id, {
        rating: reviewRating,
        comment: reviewText,
      });

      setReviewText("");
      setReviewRating(5);
      loadProductData();

      showToast("Review submitted!", "success");
    } catch (err) {
      showToast("Failed to submit review.", "error");
    }
  };

  // -------------------------
  // Loading State
  // -------------------------
  if (loading)
    return (
      <Container sx={{ py: 6 }}>
        <Skeleton height={500} />
      </Container>
    );

  if (error || !product)
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="error">{error || "Product Not Found"}</Typography>
      </Container>
    );

  const carbonValue = product.cradleToWarehouseFootprint || product.carbonFootprint;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* BACK BUTTON */}
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 4 }}>
        Back to Shopping
      </Button>

      <Grid container spacing={6}>
        {/* LEFT IMAGE */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              bgcolor: "#f9fafb",
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              height: { xs: 300, md: 500 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}
          >
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </Box>
        </Grid>

        {/* RIGHT DETAILS */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Typography variant="overline" color="text.secondary">
              {product.category || "Eco Product"}
            </Typography>

            <Typography variant="h3" fontWeight={700}>
              {product.name}
            </Typography>

            {/* PRICE + RATINGS */}
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                ₹{product.price}
              </Typography>

              {product.rating > 0 && (
                <Box display="flex" alignItems="center" bgcolor="#FFF8E1" px={1} py={0.5} borderRadius={1}>
                  <Rating value={product.rating} readOnly precision={0.5} size="small" />
                  <Typography ml={1}>({reviews.length})</Typography>
                </Box>
              )}
            </Box>

            {/* CARBON FOOTPRINT */}
            {carbonValue && (
              <Box mt={2}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: "#e8f5e9",
                    border: "1px solid #c8e6c9",
                  }}
                >
                  <img src="/logo.png" width="40" style={{ marginRight: 8 }} />
                  Eco Impact: {carbonValue} kg CO₂e
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* DESCRIPTION */}
            <Typography color="text.secondary">{product.description}</Typography>

            <Box flexGrow={1} />

            {/* ADD TO CART + WISHLIST */}
            <Box display="flex" gap={2} alignItems="center" mt={3}>
              <TextField
                type="number"
                label="Qty"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                sx={{ width: 80 }}
              />

              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stockQuantity < 1}
                sx={{ flexGrow: 1, height: 56, fontSize: "1.1rem" }}
              >
                Add to Cart
              </Button>

              <IconButton onClick={handleAddToWishlist} sx={{ height: 56, width: 56 }}>
                {inWishlist ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* REVIEWS */}
      <Box mt={6}>
        <Typography variant="h5" fontWeight={700}>
          Customer Reviews
        </Typography>

        {/* WRITE REVIEW */}
        {isAuthenticated && (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography fontWeight={600}>Write a Review</Typography>

            <Box mt={1}>
              <Rating value={reviewRating} onChange={(e, v) => setReviewRating(v)} />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmitReview}>
              Submit
            </Button>
          </Paper>
        )}

        {/* REVIEW LIST */}
        <Grid container spacing={2} mt={2}>
          {reviews.map((review, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" gap={2}>
                  <Avatar>{review.userName?.charAt(0)}</Avatar>
                  <Box>
                    <Typography fontWeight={700}>{review.userName}</Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                </Box>
                <Typography mt={1}>{review.comment}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <Box mt={8}>
          <Typography variant="h4">You Might Also Like</Typography>
          <ProductGrid products={relatedProducts} />
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;
