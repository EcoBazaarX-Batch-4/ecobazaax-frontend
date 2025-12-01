import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Box, Typography, Paper, TextField, Button, Grid, Alert, 
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { sellerService } from "../../services/sellerService";
import { productService } from "../../services/productService";
import { adminService } from "../../services/adminService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [staticData, setStaticData] = useState({ categories: [], zones: [] });
  
  // Use V2 field names
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "", // FIX: Matched to backend
    imageUrl: "",
    categoryId: "",
    transportZoneId: "",
    // Carbon fields can be added here if we enable full re-calculation editing later
  });
  
  const [loading, setLoading] = useState(true); // Initial load
  const [saving, setSaving] = useState(false);  // Save process
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // 1. Fetch Dropdowns (Categories & Zones)
        const [catRes, zoneRes] = await Promise.all([
          adminService.getCategories().catch(() => ({ data: [] })), 
          adminService.getTransportZones().catch(() => ({ data: [] }))
        ]);

        // 2. Fetch Product Data
        const product = await productService.getProductById(id);
        
        // 3. Populate State
        setStaticData({
            categories: catRes.data || catRes || [],
            zones: zoneRes.data || zoneRes || []
        });

        setFormData({
          name: product.name || "",
          description: product.description || "", 
          price: product.price || "",
          stockQuantity: product.stockQuantity || "", // FIX: Read correct field
          imageUrl: product.imageUrl || "",
          categoryId: product.categoryId || "",       // FIX: Read correct field
          transportZoneId: product.transportZoneId || "", // FIX: Read correct field
        });

      } catch (err) {
        console.error(err);
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
       ...prev,
       [name]: (name === 'price' || name === 'stockQuantity') ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Send updated data
      await sellerService.updateProduct(id, {
        ...formData,
        // Ensure numbers are sent as numbers
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });
      navigate("/seller/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/seller/products")} sx={{ mb: 3 }}>Back</Button>
      <Typography variant="h4" fontWeight={700} gutterBottom>Edit Product</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required /></Grid>
            
            <Grid item xs={12} md={6}>
               <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select name="categoryId" value={formData.categoryId} label="Category" onChange={handleChange}>
                    {staticData.categories.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                  </Select>
               </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
               <FormControl fullWidth required>
                  <InputLabel>Transport Zone</InputLabel>
                  <Select name="transportZoneId" value={formData.transportZoneId} label="Transport Zone" onChange={handleChange}>
                    {staticData.zones.map((zone) => <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>)}
                  </Select>
               </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Price" name="price" value={formData.price} onChange={handleChange} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Stock" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Description" name="description" value={formData.description} onChange={handleChange} required /></Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end">
             <Button type="submit" variant="contained" size="large" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProduct;