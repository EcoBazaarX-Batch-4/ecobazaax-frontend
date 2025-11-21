import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/ProductGrid";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      loadSearchResults();
    }
  }, [query]);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      // Service now handles the param mapping correctly
      const data = await productService.searchProducts(query);
      setProducts(data.content || data.products || []);
    } catch (err) {
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Results for "{query}"
      </Typography>
      
      {loading ? (
         <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : products.length === 0 ? (
        <Alert severity="info">No products found.</Alert>
      ) : (
        <ProductGrid products={products} />
      )}
    </Container>
  );
};

export default SearchResults;