import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * A reusable component that displays a single product.
 * It receives a 'product' object as a "prop" (property).
 */
function ProductCard({ product }) {
  if (!product) {
    return null; // Don't render if no product is passed
  }

  return (
    // We wrap the card in a <RouterLink> so clicking it navigates to the product's page
    <RouterLink 
      to={`/product/${product.id}`} 
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <CardMedia
          component="img"
          height="140"
          image={product.imageUrl} // Use the product's image
          alt={product.name}
        />
        <CardContent sx={{ flexGrow: 1 }}> {/* flexGrow ensures content fills space */}
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            noWrap // Prevents long names from wrapping to 2+ lines
          >
            {product.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" noWrap>
            By {product.sellerStoreName}
          </Typography>
          
          <Typography variant="h5" color="text.primary" sx={{ mt: 1 }}>
            ₹{product.price}
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold' }}>
              {product.cradleToWarehouseFootprint} kg CO2e
            </Typography>
            <Typography variant="body2" sx={{ color: 'blue' }}>
              + {product.ecoPoints} points
            </Typography>
          </Box>
          
        </CardContent>
      </Card>
    </RouterLink>
  );
}

export default ProductCard;