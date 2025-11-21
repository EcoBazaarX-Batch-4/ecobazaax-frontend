import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Skeleton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { sellerService } from "../../services/sellerService";
import { productService } from "../../services/productService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
    carbonFootprint: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        stock: data.stock?.toString() || "",
        category: data.category || "",
        imageUrl: data.imageUrl || "",
        carbonFootprint: data.carbonFootprint?.toString() || "",
      });
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await sellerService.updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        carbonFootprint: parseFloat(formData.carbonFootprint) || null,
      });
      navigate("/seller/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={500} />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/seller/products")} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Edit Product
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Price ($)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: "0" }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock Quantity"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                inputProps={{ min: "0" }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Carbon Footprint (kg CO₂)"
                name="carbonFootprint"
                value={formData.carbonFootprint}
                onChange={handleChange}
                inputProps={{ step: "0.1", min: "0" }}
                helperText="Optional: Environmental impact"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                helperText="Enter a URL for the product image"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate("/seller/products")}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProduct;
