import React from 'react';
import { Box, Typography, Grid, IconButton, Select, MenuItem, TextField, FormControl, InputLabel, Paper, Divider, Button } from '@mui/material';
import { Delete, AddCircle } from '@mui/icons-material';

function CarbonInputSection({ staticData, formData, setFormData }) {
  const handleArrayChange = (groupName, index, field, value) => {
    const newArray = [...formData[groupName]];
    const numericValue = (field === 'weightKg') ? parseFloat(value) : value;
    newArray[index] = { ...newArray[index], [field]: numericValue };
    setFormData(prev => ({ ...prev, [groupName]: newArray }));
  };

  const handleAddRow = (groupName, defaultObject) => {
    setFormData(prev => ({ ...prev, [groupName]: [...prev[groupName], defaultObject] }));
  };

  const handleRemoveRow = (groupName, index) => {
    const newArray = formData[groupName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [groupName]: newArray }));
  };

  const DynamicRow = ({ data, groupName, labelKey, idKey, index, options }) => (
    <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size="small" required>
          <InputLabel>{labelKey}</InputLabel>
          <Select value={data[idKey] || ''} label={labelKey} onChange={(e) => handleArrayChange(groupName, index, idKey, e.target.value)}>
            {options?.map((opt) => (
              <MenuItem key={opt.id} value={opt.id}>{opt.name} ({opt.emissionPerKg} kg/kg)</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField fullWidth label="Weight (kg)" type="number" value={data.weightKg || ''} onChange={(e) => handleArrayChange(groupName, index, 'weightKg', e.target.value)} required size="small" inputProps={{ step: "0.001", min: "0.001" }} />
      </Grid>
      <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
        <IconButton color="error" onClick={() => handleRemoveRow(groupName, index)}><Delete /></IconButton>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      {['materials', 'manufacturing', 'packaging'].map((group) => (
        <Box key={group} mb={3}>
          <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>{group}</Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            {formData[group].map((item, index) => (
              <DynamicRow key={index} data={item} groupName={group} index={index} 
                labelKey={group === 'materials' ? 'Material' : group === 'manufacturing' ? 'Process' : 'Packaging'}
                idKey={group === 'materials' ? 'materialId' : group === 'manufacturing' ? 'processId' : 'packagingMaterialId'}
                options={staticData?.[group] || []}
              />
            ))}
            <Button startIcon={<AddCircle />} onClick={() => handleAddRow(group, group === 'materials' ? { materialId: '', weightKg: 0 } : group === 'manufacturing' ? { processId: '', weightKg: 0 } : { packagingMaterialId: '', weightKg: 0 })}>
              Add {group} item
            </Button>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

export default CarbonInputSection;