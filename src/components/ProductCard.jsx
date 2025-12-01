import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder, Park } from "@mui/icons-material";

const ProductCard = ({ product, onWishlistToggle }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Carbon Value Calculation
  const carbonValue = product.cradleToWarehouseFootprint || product.carbonFootprint;

  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": { 
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", 
          transform: "translateY(-4px)" 
        },
        overflow: "hidden",
        border: "1px solid #f0f0f0" // Subtle border for definition
      }}
      onClick={handleClick}
    >
      {/* IMAGE SECTION */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#f9fafb", // Very light gray background for image area
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2
        }}
      >
        <CardMedia
          component="img"
          image={product.imageUrl || "https://via.placeholder.com/400x300?text=Product"}
          alt={product.name}
          sx={{
            maxHeight: "100%",
            width: "auto",
            objectFit: "contain",
            mixBlendMode: "multiply" // Helps remove white backgrounds on images visually
          }}
        />

        {/* Wishlist Icon (Kept on image as standard) */}
        {onWishlistToggle && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(product.id);
            }}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "#fff" }
            }}
          >
            {product.inWishlist ? <Favorite fontSize="small" color="error" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
        )}
      </Box>

      {/* DETAILS SECTION */}
      <CardContent sx={{ p: 2 }}>
        {/* NAME */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            lineHeight: "1.3",
            height: 42, // Fixed height keeps grid aligned
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 1
          }}
        >
          {product.name}
        </Typography>

        {/* PRICE */}
        <Typography
          variant="h6"
          color="text.primary" // Standard black/dark gray is cleaner than primary blue sometimes
          fontWeight={700}
          sx={{ fontSize: '1.1rem' }}
        >
          ₹{product.price}
        </Typography>

        {/* PROFESSIONAL CARBON TAG (Below Price) */}
        {carbonValue && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mt: 1.5,
              px: 1,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: "#e8f5e9", // Light Green background
              color: "#2e7d32",   // Dark Green text (Professional contrast)
              fontSize: "0.75rem",
              fontWeight: 600,
              border: "1px solid #c8e6c9"
            }}
          >
            <Park sx={{ fontSize: 14, mr: 0.5 }} />
            {carbonValue} kg CO₂e
          </Box>
        )}

        {/* Fallback if no carbon data (Optional: Maintain spacing or show nothing) */}
        {!carbonValue && <Box sx={{ height: 28, mt: 1.5 }} />} 

      </CardContent>
    </Card>
  );
};

export default ProductCard;