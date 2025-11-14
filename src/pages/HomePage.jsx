import React, { useState, useEffect } from 'react';
import { getHomepageRecommendations } from '../services/productService'; // 1. Import our API
import ProductCard from '../components/ProductCard'; // 2. Import our component
import { Container, Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';

function HomePage() {
  // 3. Create "state" to store our data
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 4. "useEffect" runs once when the component first loads
  useEffect(() => {
    // This is an async function to fetch the data
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await getHomepageRecommendations();
        setRecommendations(response.data); // Save the data in our state
        console.log("Fetched recommendations:", response.data);
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchRecommendations();
  }, []); // The empty array [] means "run this only once"

  // 5. Helper function to render a list of products
  const renderProductList = (title, products) => {
    if (!products || products.length === 0) {
      return null; // Don't show the section if the list is empty
    }
    
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>{title}</Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // 6. Handle loading and error states
  if (loading) {
    // Show a loading spinner
    return <Container><CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} /></Container>;
  }

  if (error) {
    // Show an error message
    return <Container><Alert severity="error">{error}</Alert></Container>;
  }

  // 7. Render the full page with all our data
  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
        Welcome to Eco Bazar X
      </Typography>
      
      {/* Render each recommendation list */}
      {recommendations && (
        <>
          {renderProductList("Top Sellers", recommendations.topSellers)}
          {renderProductList("New Arrivals", recommendations.newArrivals)}
          {renderProductList("Top Rated", recommendations.topRated)}
          {renderProductList("Lowest Carbon", recommendations.topLowestCarbon)}
          {renderProductList("Top Eco Rewards", recommendations.topEcoRewards)}
        </>
      )}
    </Container>
  );
}

export default HomePage;