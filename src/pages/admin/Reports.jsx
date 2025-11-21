import { useState } from "react";
import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import { Download } from "@mui/icons-material";
import { adminService } from "../../services/adminService";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await adminService.exportSales();
      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'admin_sales_report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError("Failed to download report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Reports</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>System-Wide Data Export</Typography>
        <Typography color="text.secondary" mb={3}>Download a complete CSV report of all sales, carbon data, and seller performance.</Typography>
        <Button variant="contained" size="large" startIcon={<Download />} onClick={handleDownload} disabled={loading}>
          {loading ? "Generating..." : "Download Global Report"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Reports;