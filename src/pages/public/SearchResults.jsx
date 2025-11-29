import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, CircularProgress, Alert, Button } from "@mui/material";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/ProductGrid";
import { ArrowForward } from "@mui/icons-material";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false); // New state to track if we are showing random items

  useEffect(() => {
    if (query) {
      loadSearchResults();
    }
  }, [query]);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      setIsFallback(false); // Reset fallback state
      setError(null);

      // 1. Try to search
      const searchData = await productService.searchProducts(query);
      const searchResults = searchData.content || searchData.products || [];

      if (searchResults.length > 0) {
        // Case A: Found results
        setProducts(searchResults);
      } else {
        // Case B: No results -> Fetch 5 "Random" (Page 0) products
        // We use the general getProducts endpoint to fetch recommendations
        const fallbackData = await productService.getProducts({ page: 0, size: 5, sort: "id,desc" });
        setProducts(fallbackData.content || []);
        setIsFallback(true); // Enable fallback mode
      }

    } catch (err) {
      setError("Failed to search products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {isFallback ? "No matches found" : `Results for "${query}"`}
      </Typography>

      {/* Logic for displaying counts or fallback message */}
      {!loading && !error && (
        <Box mb={4}>
          {isFallback ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              We couldn't find any products matching <strong>"{query}"</strong>. 
              However, you might be interested in these popular eco-friendly items:
            </Alert>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {products.length} products found
            </Typography>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
         <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : (
        <>
          {/* Display Products (Either Search Results or Fallback) */}
          <ProductGrid products={products} />

          {/* If Fallback, show a button to browse all */}
          {isFallback && products.length > 0 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <Button 
                variant="outlined" 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/products')}
                size="large"
              >
                Browse Full Catalog
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchResults;