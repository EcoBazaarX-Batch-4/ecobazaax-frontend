import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Container, Typography, Box, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Chip, Select, MenuItem, FormControl, Pagination
} from '@mui/material';

// ✅ Import toast
import { toast } from "@/hooks/use-toast";

const orderStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAGE_SIZE = 10;

function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllOrders({ page: page - 1, size: PAGE_SIZE });
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load orders.');
      toast({
        title: "Failed to load orders",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    // ❌ Remove confirm popup → replace it with a cleaner toast confirmation
    toast({
      title: `Updating Order #${orderId}`,
      description: `Setting status to ${newStatus}...`,
    });

    try {
      await adminService.updateOrderStatus(orderId, newStatus);

      // success toast
      toast({
        title: "Status Updated",
        description: `Order #${orderId} marked as ${newStatus}`,
      });

      fetchOrders(); // Refresh list
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err.response?.data?.message || "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'success';
      case 'SHIPPED': return 'info';
      case 'CANCELLED': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Global Order Management
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell fontWeight="bold">ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Current Status</TableCell>
                  <TableCell align="center">Update Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>

                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>

                    {/* CUSTOMER INFO */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customerEmail}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      ₹{order.totalAmount?.toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      <Chip 
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>

                    {/* UPDATE STATUS */}
                    <TableCell align="center">
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          disabled={
                            order.status === 'DELIVERED' ||
                            order.status === 'CANCELLED'
                          }
                        >
                          {orderStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, v) => setPage(v)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default AdminOrderManagement;
