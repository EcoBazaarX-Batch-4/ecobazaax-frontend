import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Grid, Divider, Chip, Button, Skeleton, Alert, Stepper, Step, StepLabel
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { customerService } from "../../services/customerService";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await customerService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => ["PENDING", "PAID", "SHIPPED", "DELIVERED"];
  const getActiveStep = (status) => getStatusSteps().indexOf(status?.toUpperCase());

  if (loading) return <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={400} /></Box>;
  if (error || !order) return <Box sx={{ p: 3 }}><Alert severity="error">{error || "Order not found"}</Alert></Box>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/profile/orders")} sx={{ mb: 3 }}>
        Back to Orders
      </Button>

      {/* Order Summary Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700}>Order #{order.id}</Typography>
          <Chip label={order.status} color="primary" />
        </Box>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">Order Date</Typography>
            <Typography fontWeight={600}>
                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">Total Amount</Typography>
            <Typography fontWeight={600} color="primary" variant="h6">
                ₹{order.totalAmount?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
             <Typography variant="body2" color="text.secondary">Total Carbon</Typography>
             <Typography fontWeight={600} color="success.main">
                 {order.totalCarbonFootprint?.toFixed(2)} kg
             </Typography>
          </Grid>
        </Grid>

        <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
          {getStatusSteps().map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
      </Paper>

      {/* Shipping Address (Safe Render) */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Delivery Info</Typography>
        <Typography variant="body1">
          {/* FIX: Display the address string directly, or show fallback */}
          {order.shippingAddress || "Address details not available for this order."}
        </Typography>
      </Paper>

      {/* Order Items */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Order Items</Typography>
        <Divider sx={{ my: 2 }} />
        
        {/* FIX: Iterate orderItems and use flat fields */}
        {order.orderItems?.map((item, index) => (
          <Box key={index} mb={2}>
            <Box display="flex" gap={2} mb={1} alignItems="center">
              {/* FIX: Use item.imageUrl populated by backend */}
              <Box
                component="img"
                src={item.imageUrl || "https://via.placeholder.com/80?text=Product"}
                alt={item.productName}
                sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1, border: '1px solid #eee' }}
              />
              <Box flexGrow={1}>
                <Typography fontWeight={600}>{item.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
              </Box>
              <Typography fontWeight={600}>
                  ₹{(item.pricePerItem * item.quantity).toFixed(2)}
              </Typography>
            </Box>
            {index < order.orderItems.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default OrderDetail;