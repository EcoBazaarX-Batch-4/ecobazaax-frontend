import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Paper, TextField, Button, Grid, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { sellerService } from "../../services/sellerService";
import { adminService } from "../../services/adminService";
import CarbonInputSection from "../../components/seller/CarbonInputSection";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [staticData, setStaticData] = useState({ categories: [], materials: [], manufacturing: [], packaging: [], zones: [] });
  const [loadingStatic, setLoadingStatic] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stockQuantity: "", imageUrl: "", categoryId: "", transportZoneId: 1,
    materials: [], manufacturing: [], packaging: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // FIX: Fetch ALL config data needed
        const [cat, mat, mfg, pkg, zone] = await Promise.all([
          adminService.getCategories(), 
          adminService.getMaterials(),
          adminService.getManufacturingProcesses(), 
          adminService.getPackagingMaterials(),
          adminService.getTransportZones() // Added
        ]);
        
        setStaticData({ 
            categories: cat || [], 
            materials: mat || [], 
            manufacturing: mfg || [], 
            packaging: pkg || [],
            zones: zone || [] // Added
        });
      } catch (err) {
        console.error("Config load failed", err);
        setError("Failed to load configuration data. Please refresh.");
      } finally {
        setLoadingStatic(false);
      }
    };
    loadConfig();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Basic Validation
      if (!formData.name || !formData.price || !formData.stockQuantity) throw new Error("Please fill required fields");
      if (formData.materials.length === 0) throw new Error("Add at least one material for carbon calc.");

      await sellerService.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });
      navigate("/seller/products");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (loadingStatic) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/seller/products")} sx={{ mb: 3 }}>Back</Button>
      <Typography variant="h4" fontWeight={700} gutterBottom>Add New Product</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select name="categoryId" value={formData.categoryId} label="Category" onChange={handleChange}>
                  {staticData.categories.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="number" label="Price (₹)" name="price" value={formData.price} onChange={handleChange} required inputProps={{ min: 0, step: "0.01" }} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="number" label="Stock" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required inputProps={{ min: 0 }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleChange} required /></Grid>
          </Grid>
          
          <Box mt={4}>
            <Typography variant="h6" gutterBottom color="primary">Eco-Impact Calculation (Required)</Typography>
            <CarbonInputSection staticData={staticData} formData={formData} setFormData={setFormData} />
          </Box>

          <Box mt={4} display="flex" justifyContent="flex-end">
             <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
             </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProduct;