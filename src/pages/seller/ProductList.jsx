import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { sellerService } from "../../services/sellerService";
import { toast } from "@/hooks/use-toast"; // ✅ Toast

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await sellerService.getSellerProducts();
      setProducts(data.content || []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Open confirmation popup
  const openConfirmDialog = (id) => {
    setSelectedProductId(id);
    setConfirmOpen(true);
  };

  // 🔥 Close popup
  const closeConfirmDialog = () => {
    setConfirmOpen(false);
    setSelectedProductId(null);
  };

  // 🔥 Confirm delete action
  const handleConfirmDelete = async () => {
    try {
      await sellerService.deleteProduct(selectedProductId);
      closeConfirmDialog();
      loadProducts();

      toast({
        title: "Product Archived",
        description: "The product has been successfully archived.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to archive product.",
        variant: "destructive",
      });
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          My Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/seller/products/new")}
        >
          Add Product
        </Button>
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
                <TableRow key={index}>
                  <TableCell colSpan={5}><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary" py={4}>
                    No products found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        component="img"
                        src={product.imageUrl || "https://via.placeholder.com/60"}
                        alt={product.name}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                          borderRadius: 1,
                          border: "1px solid #eee",
                        }}
                      />
                      <Typography fontWeight={600}>{product.name}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Typography fontWeight={600}>₹{product.price}</Typography>
                  </TableCell>

                  <TableCell align="center">{product.stockQuantity || 0}</TableCell>

                  <TableCell align="center">
                    <Chip
                      label={product.isArchived ? "Archived" : "Active"}
                      color={product.isArchived ? "default" : "success"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/product/${product.id}`)}
                      title="View"
                    >
                      <Visibility />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openConfirmDialog(product.id)} // 🔥 replaced confirm()
                      title="Archive"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* -------------------------------------------------- */}
      {/* 🔥 GLOBAL CONFIRMATION DIALOG */}
      {/* -------------------------------------------------- */}
      <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>Archive Product?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to archive this product?  
            It will no longer appear in your active listings.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
