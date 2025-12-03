import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Grid, Divider, Chip, Button,
  Skeleton, Alert, Stepper, Step, StepLabel
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
  const getActiveStep = (status) =>
    getStatusSteps().indexOf(status?.toUpperCase());

  if (loading)
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );

  if (error || !order)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Order not found"}</Alert>
      </Box>
    );

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/profile/orders")}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

{/* =====================
    ORDER HEADER + STATUS TRACKER (COMBINED)
======================== */}
<Paper sx={{ p: 3, mb: 3 }}>
  {/* Top Row: Order ID + Status */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={3}
  >
    <Typography variant="h5" fontWeight={700}>
      Order #{order.id}
    </Typography>

    <Chip
      label={order.status}
      color="success"
      sx={{ fontWeight: 700, fontSize: "1rem", px: 2 }}
    />
  </Box>

  {/* Stepper */}
  <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
    {getStatusSteps().map((label) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
</Paper>

      {/* ===========================
          ORDER SUMMARY SECTION
      ============================== */}
      <Paper sx={{ p: 4, mb: 3 }}>
  <Typography variant="h6" fontWeight={700} gutterBottom>
    Order Summary
  </Typography>

  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mt={2}
    flexWrap="wrap"
  >
    {/* LEFT — Order Date */}
    <Box sx={{ minWidth: "200px" }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Order Date
      </Typography>
      <Typography variant="h5" fontWeight={700} color="info.main">
        {order.orderDate
          ? new Date(order.orderDate).toLocaleDateString()
          : "N/A"}
      </Typography>
    </Box>

    {/* CENTER — Total Amount */}
    <Box sx={{ textAlign: "center", minWidth: "200px" }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Total Amount
      </Typography>
      <Typography variant="h5" fontWeight={700} color="primary.main">
        ₹{order.totalAmount?.toFixed(2)}
      </Typography>
    </Box>

    {/* RIGHT — Total Carbon */}
    <Box sx={{ textAlign: "right", minWidth: "200px" }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Total Carbon
      </Typography>
      <Typography variant="h5" fontWeight={700} color="success.main">
        {order.totalCarbonFootprint?.toFixed(2)} kg
      </Typography>
    </Box>
  </Box>
</Paper>

      {/* ===========================
          SHIPPING ADDRESS SECTION
      ============================== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Delivery Info
        </Typography>
        <Typography variant="body1">
          {order.shippingAddress ||
            "Address details not available for this order."}
        </Typography>
      </Paper>

      {/* =====================
          ORDER ITEMS SECTION
      ======================== */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Order Items
        </Typography>
        <Divider sx={{ my: 2 }} />

        {order.orderItems?.map((item, index) => (
          <Box key={index} mb={2}>
            <Box display="flex" gap={2} mb={1} alignItems="center">
              <Box
                component="img"
                src={
                  item.imageUrl ||
                  "https://via.placeholder.com/80?text=Product"
                }
                alt={item.productName}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid #eee",
                }}
              />

              <Box flexGrow={1}>
                <Typography fontWeight={600}>
                  {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
              </Box>

              <Typography fontWeight={600}>
                ₹{(item.pricePerItem * item.quantity).toFixed(2)}
              </Typography>
            </Box>

            {index < order.orderItems.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default OrderDetail;
