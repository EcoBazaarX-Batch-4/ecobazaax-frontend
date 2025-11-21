import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Skeleton, Alert
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { adminService } from "../../services/adminService";

const SellerApprovals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      // FIX: Backend returns a List directly
      const data = await adminService.getSellerApplications();
      setApplications(data || []);
    } catch (err) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await adminService.approveSellerApplication(id);
      else await adminService.rejectSellerApplication(id);
      loadApplications();
    } catch (err) {
      alert(`Failed to ${action} application`);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Seller Applications</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Store Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? [...Array(3)].map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton /></TableCell></TableRow>) :
             applications.length === 0 ? <TableRow><TableCell colSpan={5} align="center">No pending applications</TableCell></TableRow> :
             applications.map((app) => (
              <TableRow key={app.id} hover>
                <TableCell fontWeight={600}>{app.name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.storeName}</TableCell>
                <TableCell><Chip label={app.sellerStatus} color="warning" size="small" /></TableCell>
                <TableCell align="center">
                  <Button size="small" variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => handleAction(app.id, 'approve')} sx={{ mr: 1 }}>
                    Approve
                  </Button>
                  <Button size="small" variant="outlined" color="error" startIcon={<Cancel />} onClick={() => handleAction(app.id, 'reject')}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SellerApprovals;