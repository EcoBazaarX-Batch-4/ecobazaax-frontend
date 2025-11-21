import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  IconButton,
  Chip
} from "@mui/material";
import { Favorite, FavoriteBorder, Park } from "@mui/icons-material";

const ProductCard = ({ product, onWishlistToggle }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const carbonValue = product.cradleToWarehouseFootprint || product.carbonFootprint;

  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": { boxShadow: 5, transform: "scale(1.02)" },
        overflow: "hidden"
      }}
      onClick={handleClick}
    >
      {/* IMAGE */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#fff",
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
            objectFit: "contain"
          }}
        />

        {/* Carbon Footprint Badge */}
        {carbonValue && (
          <Chip
            icon={<Park style={{ color: "white" }} />}
            label={`${carbonValue} kg CO₂e`}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "#2ECC71",
              color: "white",
              fontWeight: 600
            }}
          />
        )}

        {/* Wishlist Icon */}
        {onWishlistToggle && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(product.id);
            }}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "white",
              "&:hover": { bgcolor: "white" }
            }}
          >
            {product.inWishlist ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        )}
      </Box>

      {/* DETAILS */}
      <CardContent sx={{ p: 2 }}>
        {/* NAME */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            lineHeight: "1.2",
            height: 40,
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {product.name}
        </Typography>

        {/* RATING */}
        {product.rating && (
          <Box display="flex" alignItems="center" mt={0.5}>
            <Rating
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary" ml={0.5}>
              ({product.rating.toFixed(1)})
            </Typography>
          </Box>
        )}

        {/* PRICE */}
        <Typography
          variant="h6"
          color="primary"
          fontWeight={700}
          mt={1}
        >
          ₹{product.price}
        </Typography>

        {/* FREE DELIVERY Like Amazon */}
        <Typography variant="body2" color="success.main" fontWeight={600}>
          FREE Delivery
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
