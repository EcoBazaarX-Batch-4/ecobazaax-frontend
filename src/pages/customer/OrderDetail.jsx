import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  Skeleton,
  Alert,
  Stepper,
  Step,
  StepLabel,
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

  const getStatusSteps = () => {
    return ["Order Placed", "Processing", "Shipped", "Delivered"];
  };

  const getActiveStep = (status) => {
    const steps = ["placed", "processing", "shipped", "delivered"];
    return steps.indexOf(status?.toLowerCase());
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box>
        <Alert severity="error">{error || "Order not found"}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/profile/orders")} sx={{ mb: 3 }}>
        Back to Orders
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700}>
            Order #{order.id}
          </Typography>
          <Chip label={order.status} color="primary" />
        </Box>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Order Date
            </Typography>
            <Typography fontWeight={600}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography fontWeight={600} color="primary" variant="h6">
              ₹{order.total?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Payment Method
            </Typography>
            <Typography fontWeight={600}>{order.paymentMethod || "N/A"}</Typography>
          </Grid>
        </Grid>

        <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
          {getStatusSteps().map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Delivery Address
        </Typography>
        <Typography variant="body1">
          {order.address?.name}
          <br />
          {order.address?.street}
          <br />
          {order.address?.city}, {order.address?.state} {order.address?.zip}
          <br />
          Phone: {order.address?.phone}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Order Items
        </Typography>
        <Divider sx={{ my: 2 }} />
        {order.items?.map((item, index) => (
          <Box key={index} mb={2}>
            <Box display="flex" gap={2} mb={1}>
              <Box
                component="img"
                src={item.product.imageUrl || "https://via.placeholder.com/80"}
                alt={item.product.name}
                sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
              />
              <Box flexGrow={1}>
                <Typography fontWeight={600}>{item.product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
              </Box>
              <Typography fontWeight={600}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
            {index < order.items.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default OrderDetail;
