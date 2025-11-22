import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/ProductGrid";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("featured");

  // TRANSLATOR: Convert UI sort to Backend sort string
  const getBackendSort = (uiSort) => {
    switch (uiSort) {
      case "price_low": return "price,asc";
      case "price_high": return "price,desc";
      case "rating": return "averageRating,desc"; // Assuming 'averageRating' field
      case "carbon": return "cradleToWarehouseFootprint,asc";
      case "featured": 
      default: return "id,desc";
    }
  };

  useEffect(() => {
    loadProducts();
    window.scrollTo(0, 0);
  }, [page, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // 1. Translate sort
      const backendSort = getBackendSort(sortBy);
      
      // 2. Call API (Page is 0-indexed)
      const data = await productService.getProducts({ 
        page: page - 1, 
        sort: backendSort 
      });
      
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          All Products
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price_low">Price: Low to High</MenuItem>
            <MenuItem value="price_high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="carbon">Lowest Carbon Impact</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : (
        <>
          <ProductGrid products={products} />
          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default ProductListing;