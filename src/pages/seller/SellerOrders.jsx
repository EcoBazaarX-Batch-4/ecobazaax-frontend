import { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton, Alert, Button } from "@mui/material";
import { sellerService } from "../../services/sellerService";
import { LocalShipping } from "@mui/icons-material";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await sellerService.getSellerOrders();
        // FIX: Backend uses 'content'
        setOrders(data.content || []);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED": return "success";
      case "SHIPPED": return "info";
      case "CANCELLED": return "error";
      default: return "warning";
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Orders</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight={700}>ID</Typography></TableCell>
              <TableCell><Typography fontWeight={700}>Customer</Typography></TableCell>
              <TableCell><Typography fontWeight={700}>Date</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>Total</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={700}>Status</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={700}>Info</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? [...Array(3)].map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton /></TableCell></TableRow>) : 
             orders.length === 0 ? <TableRow><TableCell colSpan={6} align="center">No orders found</TableCell></TableRow> :
             orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>#{order.id}</TableCell>
                {/* FIX: Access nested user object safely */}
                <TableCell>{order.user?.name || "User " + order.user?.id}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">₹{order.totalAmount.toFixed(2)}</TableCell>
                <TableCell align="center"><Chip label={order.status} color={getStatusColor(order.status)} size="small" /></TableCell>
                <TableCell align="center"><Button variant="outlined" size="small" disabled startIcon={<LocalShipping />}>Admin Managed</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default SellerOrders;