import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

const ProductCard = ({ product, onWishlistToggle }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product?.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const carbonValue =
    product?.cradleToWarehouseFootprint || product?.carbonFootprint;

  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        transition: "0.2s ease",
        border: "1px solid #e5e7eb",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-4px)",
        },
      }}
      onClick={handleClick}
    >
      {/* IMAGE */}
      <Box sx={{ position: "relative", height: 180, bgcolor: "#f9fafb" }}>
        <CardMedia
          component="img"
          image={
            product?.imageUrl ||
            "https://via.placeholder.com/400x300?text=Product"
          }
          alt={product?.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: 1.5,
          }}
        />

        {/* Carbon Badge */}
        {carbonValue && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              px: 1.5,
              py: 0.5,
              borderRadius: "16px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              border: "1px solid #c8e6c9",
            }}
          >
            {carbonValue} kg CO₂e
          </Box>
        )}
      </Box>

      {/* CONTENT */}
      <CardContent sx={{ p: 2 }}>
        {/* NAME */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            height: 40,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product?.name}
        </Typography>

        {/* PRICE + WISHLIST */}
        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            ₹{product?.price}
          </Typography>

          {onWishlistToggle && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onWishlistToggle(product.id);
              }}
              size="small"
            >
              {product?.inWishlist ? (
                <Favorite fontSize="small" color="error" />
              ) : (
                <FavoriteBorder fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
