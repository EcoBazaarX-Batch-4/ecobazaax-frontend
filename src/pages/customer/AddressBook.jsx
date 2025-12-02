import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Alert, FormControlLabel, Checkbox
} from "@mui/material";
import { customerService } from "../../services/customerService";

// ✅ Toast import
import { toast } from "@/hooks/use-toast";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

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
      toast({
        title: "Load Failed",
        description: "Unable to fetch your saved addresses.",
        variant: "destructive",
      });
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
      setFormData({
        label: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false
      });
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

        toast({
          title: "Address Updated",
          description: `${formData.label} address was updated successfully.`,
        });

      } else {
        await customerService.addAddress(formData);

        toast({
          title: "Address Added",
          description: "Your new address has been saved.",
        });
      }

      loadAddresses();
      handleCloseDialog();

    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Please check your fields or try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    // 🟡 Toast confirmation
    toast({
      title: "Confirm Deletion",
      description: "Tap delete again to remove this address.",
    });

    // Soft confirmation (second click)
    setTimeout(async () => {
      try {
        await customerService.deleteAddress(id);

        toast({
          title: "Address Deleted",
          description: "The selected address has been removed.",
        });

        loadAddresses();

      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Unable to delete this address.",
          variant: "destructive",
        });
      }
    }, 500);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Address Book</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>

        {/* ADDRESS CARDS */}
        {addresses.map((address) => (
          <Grid item xs={12} sm={6} md={4} key={address.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #ddd",
                position: "relative",
              }}
            >
              {/* PINK LEFT STRIP */}
              {address.isDefault && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "4px",
                    backgroundColor: "#f36",
                    borderRadius: "2px 0 0 2px",
                  }}
                />
              )}

              {/* LABEL */}
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid #f36",
                    backgroundColor: address.isDefault ? "#f36" : "transparent",
                  }}
                />
                <Typography fontWeight={700}>{address.label}</Typography>
              </Box>

              {/* ADDRESS TEXT */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-line" }}
              >
                {address.street}
                {"\n"}
                {address.city}
                {"\n"}
                {address.state} - {address.postalCode}
              </Typography>

              {/* ACTION BUTTONS */}
              <Box
                mt={3}
                pt={2}
                sx={{
                  borderTop: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="text"
                  color="error"
                  sx={{ fontWeight: 600 }}
                  onClick={() => handleDelete(address.id)}
                >
                  REMOVE
                </Button>

                <Button
                  variant="text"
                  sx={{ fontWeight: 600, color: "#25a55f" }}
                  onClick={() => handleOpenDialog(address)}
                >
                  EDIT
                </Button>
              </Box>

            </Paper>
          </Grid>
        ))}

        {/* ADD NEW ADDRESS CARD */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              p: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              borderRadius: 2,
              border: "1px dashed #ccc",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#fafafa" }
            }}
            onClick={() => handleOpenDialog(null)}
          >
            <Box>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "2px solid #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                  fontSize: 20
                }}
              >
                +
              </Box>
              <Typography mt={2} fontWeight={600}>
                Add new address
              </Typography>
            </Box>
          </Paper>
        </Grid>

      </Grid>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Label" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} fullWidth required />
            <TextField label="Street Address" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} fullWidth required />
            <TextField label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} fullWidth required />
            <Box display="flex" gap={2}>
              <TextField label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} fullWidth required />
              <TextField label="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} fullWidth required />
            </Box>
            <FormControlLabel
              control={<Checkbox checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />}
              label="Set as Default Address"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AddressBook;
