import { useState, useEffect } from "react";
import { Box, Typography, Paper, Tabs, Tab, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { adminService } from "../../services/adminService";

const ConfigHub = () => {
  const [tab, setTab] = useState("categories");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [value, setValue] = useState(""); // For materials (emission factor)

  const configTypes = [
    { key: "categories", label: "Categories" },
    { key: "materials", label: "Materials" },
    { key: "manufacturing-processes", label: "Manufacturing" },
    { key: "packaging-materials", label: "Packaging" },
    { key: "transport-zones", label: "Transport Zones" }
  ];

  useEffect(() => {
    loadItems();
  }, [tab]);

  const loadItems = async () => {
    try {
      const data = await adminService.getConfigItems(tab);
      setItems(data || []);
    } catch (err) {
      console.error("Load failed", err);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = { name: newItem };
      // Add value/emission if needed (simple logic for now)
      if (tab !== "categories" && value) payload.emissionPerKg = parseFloat(value);
      
      await adminService.addConfigItem(tab, payload);
      setNewItem("");
      setValue("");
      loadItems();
    } catch (err) {
      alert("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await adminService.deleteConfigItem(tab, id);
      loadItems();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>System Configuration</Typography>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable">
          {configTypes.map(t => <Tab key={t.key} label={t.label} value={t.key} />)}
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" gap={2} mb={3}>
          <TextField label="Name" value={newItem} onChange={(e) => setNewItem(e.target.value)} fullWidth />
          {tab !== "categories" && (
             <TextField label="Emission/Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} sx={{ width: 200 }} />
          )}
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} disabled={!newItem}>Add</Button>
        </Box>

        <List>
          {items.map(item => (
            <ListItem key={item.id} divider secondaryAction={
              <IconButton edge="end" color="error" onClick={() => handleDelete(item.id)}><Delete /></IconButton>
            }>
              <ListItemText 
                primary={item.name} 
                secondary={item.emissionPerKg ? `${item.emissionPerKg} kg CO2e` : null} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ConfigHub;