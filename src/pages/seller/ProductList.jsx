import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Skeleton, Alert
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { sellerService } from "../../services/sellerService";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await sellerService.getSellerProducts();
      // FIX: Backend returns paginated list in 'content'
      setProducts(data.content || []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to archive this product?")) {
      try {
        await sellerService.deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>My Products</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/seller/products/new")}>Add Product</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight={700}>Product</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>Price</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={700}>Stock</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={700}>Status</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={700}>Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}><TableCell colSpan={5}><Skeleton /></TableCell></TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center"><Typography color="text.secondary" py={4}>No products found.</Typography></TableCell></TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box component="img" src={product.imageUrl || "https://via.placeholder.com/60"} alt={product.name} sx={{ width: 50, height: 50, objectFit: "contain", borderRadius: 1, border: "1px solid #eee" }} />
                      <Typography fontWeight={600}>{product.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right"><Typography fontWeight={600}>₹{product.price}</Typography></TableCell>
                  {/* FIX: Use stockQuantity */}
                  <TableCell align="center">{product.stockQuantity || 0}</TableCell>
                  <TableCell align="center">
                    {/* FIX: Use isArchived logic */}
                    <Chip label={product.isArchived ? "Archived" : "Active"} color={product.isArchived ? "default" : "success"} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => navigate(`/product/${product.id}`)} title="View"><Visibility /></IconButton>
                    <IconButton size="small" onClick={() => navigate(`/seller/products/${product.id}/edit`)} title="Edit"><Edit /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(product.id)} title="Archive"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;