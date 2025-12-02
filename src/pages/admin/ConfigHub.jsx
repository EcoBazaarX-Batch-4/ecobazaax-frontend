import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Tabs, Tab, TextField, Button, 
  List, ListItem, ListItemText, IconButton, FormControl, InputLabel, 
  Select, MenuItem 
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { adminService } from "../../services/adminService";

// ✅ Toast system import
import { toast } from "@/hooks/use-toast";

const ConfigHub = () => {
  const [tab, setTab] = useState("categories");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const configTypes = [
    { key: "categories", label: "Categories" },
    { key: "materials", label: "Materials" },
    { key: "manufacturing", label: "Manufacturing" },
    { key: "packaging", label: "Packaging" },
    { key: "transport-zones", label: "Transport Zones" },
    { key: "taxes", label: "Taxes" },
    { key: "discounts", label: "Discounts" }
  ];

  useEffect(() => {
    loadItems();

    // Reset form defaults
    if (tab === "discounts") setForm({ discountType: "PERCENTAGE" });
    else if (tab === "taxes") setForm({ country: "IN" });
    else if (tab === "transport-zones") setForm({ cost: 50, flatCarbonFootprint: 0.5 });
    else setForm({});
  }, [tab]);

  const loadItems = async () => {
    try {
      const data = await adminService.getConfigItems(tab);
      setItems(data || []);
    } catch (err) {
      toast({
        title: "Load Failed",
        description: "Unable to load configuration items.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      setLoading(true);

      // Simple validation
      if (tab === "discounts" && !form.code) {
        toast({
          title: "Missing Code",
          description: "A discount code is required.",
          variant: "destructive",
        });
        return;
      }

      await adminService.addConfigItem(tab, form);

      toast({
        title: "Item Added",
        description: `New ${tab.replace("-", " ")} item created.`,
      });

      // Reset
      if (tab === "discounts") setForm({ discountType: "PERCENTAGE" });
      else setForm({});

      loadItems();
    } catch (err) {
      toast({
        title: "Failed to Add",
        description: err.response?.data?.message || "Check input values.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // 🟡 Toast-based confirmation (non-blocking)
    toast({
      title: "Confirm Deletion",
      description: "Click again to permanently delete.",
    });

    // Wait for user to click delete again
    setTimeout(async () => {
      try {
        await adminService.deleteConfigItem(tab, id);

        toast({
          title: "Deleted",
          description: "Item removed successfully.",
        });

        loadItems();
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: "Backend could not delete the item.",
          variant: "destructive",
        });
      }
    }, 500);
  };

  // --- DYNAMIC FORM UI ---
  const renderForm = () => {
    switch (tab) {
      case "taxes":
        return (
          <>
            <TextField label="Tax Name" name="name" value={form.name || ""} onChange={handleChange} sx={{ width: 200 }} required />
            <TextField label="Rate (%)" name="rate" type="number" value={form.rate || ""} onChange={handleChange} sx={{ width: 120 }} required />
            <TextField label="Country Code" name="country" value={form.country || "IN"} onChange={handleChange} sx={{ width: 120 }} required />
          </>
        );

      case "discounts":
        return (
          <>
            <TextField label="Code" name="code" value={form.code || ""} onChange={handleChange} sx={{ width: 150 }} required />
            <FormControl sx={{ width: 150 }}>
              <InputLabel>Type</InputLabel>
              <Select name="discountType" value={form.discountType || "PERCENTAGE"} label="Type" onChange={handleChange}>
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Value" name="value" type="number" value={form.value || ""} onChange={handleChange} sx={{ width: 120 }} required />
            <TextField label="Min Spend" name="minPurchaseAmount" type="number" value={form.minPurchaseAmount || ""} onChange={handleChange} sx={{ width: 140 }} />
            <TextField type="datetime-local" label="Valid Until" name="validUntil" value={form.validUntil || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ width: 220 }} required />
          </>
        );

      case "categories":
        return <TextField label="Name" name="name" value={form.name || ""} onChange={handleChange} fullWidth required />;

      case "transport-zones":
        return (
          <>
            <TextField label="Zone Name" name="name" value={form.name || ""} onChange={handleChange} fullWidth required />
            <TextField label="Cost (₹)" name="cost" type="number" value={form.cost || ""} onChange={handleChange} sx={{ width: 140 }} required />
            <TextField label="Carbon (kg)" name="flatCarbonFootprint" type="number" value={form.flatCarbonFootprint || ""} onChange={handleChange} sx={{ width: 140 }} required />
          </>
        );

      default:
        return (
          <>
            <TextField label="Name" name="name" value={form.name || ""} onChange={handleChange} fullWidth required />
            <TextField label="Emission (kg/kg)" name="emissionPerKg" type="number" value={form.emissionPerKg || ""} onChange={handleChange} sx={{ width: 180 }} required />
          </>
        );
    }
  };

  const renderItemSecondary = (item) => {
    if (item.code) return `${item.discountType}: ${item.value} (Min: ${item.minPurchaseAmount || 0})`;
    if (item.rate) return `${item.rate}% (${item.country})`;
    if (item.emissionPerKg) return `${item.emissionPerKg} kg CO₂e`;
    if (item.cost) return `₹${item.cost} | ${item.flatCarbonFootprint} kg`;
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Configuration Hub
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {configTypes.map((t) => (
            <Tab key={t.key} label={t.label} value={t.key} />
          ))}
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
          {renderForm()}
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} disabled={loading}>
            Add
          </Button>
        </Box>

        <List>
          {items.map((item) => (
            <ListItem
              key={item.id}
              divider
              secondaryAction={
                <IconButton edge="end" color="error" onClick={() => handleDelete(item.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={item.name || item.code} secondary={renderItemSecondary(item)} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ConfigHub;
