import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Box, Typography, Paper, Button, Grid, Radio, RadioGroup, 
  FormControlLabel, FormControl, Divider, Alert, CircularProgress
} from "@mui/material";
import { useCart } from "../../contexts/CartContext";
import { customerService } from "../../services/customerService";
import { cartService } from "../../services/cartService";

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from "../../components/PaymentForm";

// Use your actual PK here
const stripePromise = loadStripe('pk_test_51SQMabEshzwQ9WRN8LjqkViMVoBPBulhjrJNqLgMqSdMTr5wYgaSYk2sVdEDUTia7Toxu3K9ZeZRfq8m1InThAeY007wtqXTQq');

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart, getCartTotal } = useCart(); // Need setCart to update totals
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingConfirmed, setShippingConfirmed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await customerService.getAddresses();
      const list = data.addresses || data || [];
      setAddresses(list);
      // If default exists, select it
      const defaultAddr = list.find(a => a.isDefault) || list[0];
      if (defaultAddr) {
        handleAddressSelect(defaultAddr.id);
      }
    } catch (err) {
      console.error("Failed to load addresses");
    }
  };

  // FIX: Select shipping immediately when address changes
  const handleAddressSelect = async (addressId) => {
    setSelectedAddress(addressId);
    setShippingConfirmed(false); // Reset status while loading
    try {
      // 1. Send address to backend to recalculate totals (shipping cost, tax)
      const updatedCart = await cartService.selectShipping(addressId);
      setCart(updatedCart); // Update global cart context
      setShippingConfirmed(true);
    } catch (err) {
      setError("Failed to calculate shipping for this address.");
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="info">Your cart is empty</Alert>
        <Button onClick={() => navigate("/products")} sx={{ mt: 2 }}>Go Shopping</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Checkout</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* LEFT: Address & Payment */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>1. Shipping Address</Typography>
            {addresses.length === 0 ? (
              <Alert severity="warning">
                No addresses found. <Button onClick={() => navigate("/profile/addresses")}>Add New</Button>
              </Alert>
            ) : (
              <RadioGroup value={selectedAddress} onChange={(e) => handleAddressSelect(e.target.value)}>
                {addresses.map((addr) => (
                  <FormControlLabel
                    key={addr.id}
                    value={addr.id}
                    control={<Radio />}
                    label={`${addr.label}: ${addr.street}, ${addr.city}`}
                  />
                ))}
              </RadioGroup>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>2. Payment</Typography>
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="card" control={<Radio />} label="Card (Stripe)" />
                <FormControlLabel value="cod" control={<Radio />} label="COD" disabled />
              </RadioGroup>
            </FormControl>
            
            {/* FIX: Only show payment form if address is locked in */}
            {paymentMethod === 'card' && shippingConfirmed ? (
               <Elements stripe={stripePromise}>
                  <PaymentForm amount={cart.grandTotal} />
               </Elements>
            ) : (
               <Typography color="text.secondary">Please select a shipping address to proceed.</Typography>
            )}
          </Paper>
        </Grid>

        {/* RIGHT: Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 2 }} />
            {cart.items.map((item) => (
              <Box key={item.cartItemId || item.id} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">{item.productName} x {item.quantity}</Typography>
                <Typography variant="body2" fontWeight={600}>₹{item.subtotal.toFixed(2)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>₹{cart.productsTotalAmount.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight={600}>
                {cart.shippingCost > 0 ? `₹${cart.shippingCost}` : (shippingConfirmed ? "Free" : "--")}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                ₹{cart.grandTotal.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;