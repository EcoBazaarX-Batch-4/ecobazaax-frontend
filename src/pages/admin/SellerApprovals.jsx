import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Skeleton, Alert
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { adminService } from "../../services/adminService";

// ✅ Import toast
import { toast } from "@/hooks/use-toast";

const SellerApprovals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await adminService.getSellerApplications();

      // handles array / object both
      if (Array.isArray(data)) setApplications(data);
      else setApplications(data.applications || []);

    } catch (err) {
      setError("Failed to load seller applications");

      toast({
        title: "Load Failed",
        description: "Could not fetch seller applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") {
        await adminService.approveSellerApplication(id);

        toast({
          title: "Seller Approved",
          description: `Application #${id} has been approved.`,
        });

      } else {
        await adminService.rejectSellerApplication(id);

        toast({
          title: "Seller Rejected",
          description: `Application #${id} has been rejected.`,
          variant: "destructive",
        });
      }

      loadApplications();

    } catch (err) {
      toast({
        title: "Action Failed",
        description: `Could not ${action} this application.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Seller Applications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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

            {/* Loading Skeleton */}
            {loading
              ? [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))

              : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography py={4} color="text.secondary">
                        No pending applications
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) :

              applications.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell fontWeight={600}>{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.storeName}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.sellerStatus}
                      color="warning"
                      size="small"
                    />
                  </TableCell>

                  {/* APPROVE / REJECT */}
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleAction(app.id, "approve")}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleAction(app.id, "reject")}
                    >
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
