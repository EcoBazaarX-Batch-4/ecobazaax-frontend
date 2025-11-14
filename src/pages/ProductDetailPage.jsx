import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom'; // 1. Import useParams
import { getProductById } from '../services/productService'; // 2. Import our API
import { Container, Typography, Box, Grid, Button, CircularProgress, Alert } from '@mui/material';

function ProductDetailPage() {
  // 3. Get the 'id' parameter from the URL
  const { id } = useParams(); 

  // 4. Create state to hold our one product
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 5. useEffect runs when the 'id' parameter changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
        console.log("Fetched product:", response.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError('Product not found. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // The dependency array [id] means "re-run this if the id in the URL changes"

  // 6. Handle loading and error states
  if (loading) {
    return <Container><CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} /></Container>;
  }
  if (error) {
    return <Container><Alert severity="error">{error}</Alert></Container>;
  }
  if (!product) {
    return <Container><Typography>Product not found.</Typography></Container>;
  }

  // 7. Render the full page with MUI Grid for layout
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        
        {/* Column 1: Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: 3,
            }}
            src={product.imageUrl}
            alt={product.name}
          />
        </Grid>
        
        {/* Column 2: Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Sold by: {product.sellerStoreName}
          </Typography>
          
          <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
            ₹{product.price}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>

          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" color="green" gutterBottom>
              Eco Footprint
            </Typography>
            <Typography variant="body1">
              **{product.cradleToWarehouseFootprint} kg CO2e**
            </Typography>
            <Typography variant="body1" color="blue">
              + **{product.ecoPoints}** Eco Points
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={product.stockQuantity === 0}
          >
            {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
          {/* We'll make this button work in the next step */}

        </Grid>
      </Grid>
      
      {/* We'll add the Product Reviews section here later */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Reviews
        </Typography>
        {/* Review list will go here */}
      </Box>

    </Container>
  );
}

export default ProductDetailPage;