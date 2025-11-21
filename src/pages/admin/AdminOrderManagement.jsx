import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Chip, Select, MenuItem, FormControl, Pagination
} from '@mui/material';

const orderStatuses = ['PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
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
      const response = await adminService.getAllOrders(page - 1, PAGE_SIZE);
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Optimistic update or wait for refresh? Let's wait to be safe.
    if (!window.confirm(`Mark Order #${orderId} as ${newStatus}?`)) return;
    
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
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
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Global Order Management</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
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
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>{order.user?.name || "Guest"}</Typography>
                            <Typography variant="caption" color="text.secondary">{order.user?.email}</Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="right">₹{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'} // Lock final states
                        >
                          {orderStatuses.map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
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
    </Container>
  );
}

export default AdminOrderManagement;