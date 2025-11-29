import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, IconButton, Alert, FormControlLabel, Checkbox
} from "@mui/material";
import { Add, Edit, Delete, LocationOn, Home } from "@mui/icons-material";
import { customerService } from "../../services/customerService";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // FIX: Match Backend DTO (label, postalCode, etc.)
  const [formData, setFormData] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await customerService.getAddresses();
      setAddresses(data.addresses || data || []);
    } catch (err) {
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        label: address.label || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "India",
        isDefault: address.isDefault || false
      });
    } else {
      setEditingAddress(null);
      setFormData({ label: "", street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSave = async () => {
    try {
      if (editingAddress) {
        await customerService.updateAddress(editingAddress.id, formData);
      } else {
        await customerService.addAddress(formData);
      }
      loadAddresses();
      handleCloseDialog();
    } catch (err) {
      alert("Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await customerService.deleteAddress(id);
        loadAddresses();
      } catch (err) {
        alert("Failed to delete address");
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Address Book</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add New Address</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {addresses.map((address) => (
          <Grid item xs={12} md={6} key={address.id}>
            <Paper sx={{ p: 3, border: address.isDefault ? "2px solid #2ECC71" : "1px solid #eee" }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box display="flex" gap={1}>
                  <Home color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {address.label} {address.isDefault && <Typography component="span" variant="caption" color="primary">(Default)</Typography>}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{address.country}</Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleOpenDialog(address)}><Edit /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(address.id)}><Delete /></IconButton>
                </Box>
              </Box>
              <Typography variant="body2">
                {address.street}<br />
                {address.city}, {address.state} - {address.postalCode}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Label (e.g. Home, Work)" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} fullWidth required />
            <TextField label="Street Address" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} fullWidth required />
            <TextField label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} fullWidth required />
            <Box display="flex" gap={2}>
              <TextField label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} fullWidth required />
              <TextField label="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} fullWidth required />
            </Box>
            <FormControlLabel control={<Checkbox checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />} label="Set as Default Address" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressBook;