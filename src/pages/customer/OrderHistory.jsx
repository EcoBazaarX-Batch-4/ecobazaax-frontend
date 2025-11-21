import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Skeleton,
  Alert,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { customerService } from "../../services/customerService";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await customerService.getOrders();
      // FIX: Backend returns paginated 'content' array, not 'orders'
      // We check data.content first. If data itself is an array, use it.
      setOrders(data.content || (Array.isArray(data) ? data : []) || []);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "success";
      case "SHIPPED":
        return "info";
      case "PROCESSING":
      case "PAID": // Add PAID as a valid status
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Order History
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
              <TableCell>
                <Typography fontWeight={700}>Order ID</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={700}>Date</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={700}>Items</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={700}>Total</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontWeight={700}>Status</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontWeight={700}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" py={4}>
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>#{order.id}</Typography>
                  </TableCell>
                  <TableCell>
                    {/* FIX: Backend sends 'orderDate', not 'createdAt' */}
                    {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* FIX: Check for orderItems array */}
                    {order.orderItems ? order.orderItems.length : 0} items
                  </TableCell>
                  <TableCell align="right">
                    {/* FIX: Backend sends 'totalAmount', not 'total' */}
                    <Typography fontWeight={600}>
                      ₹{(order.totalAmount || order.total || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/profile/orders/${order.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderHistory;