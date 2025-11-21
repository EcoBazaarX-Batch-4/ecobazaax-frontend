import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Alert,
  CircularProgress
} from "@mui/material";
import { useCart } from "../../contexts/CartContext";
import { customerService } from "../../services/customerService";
import { cartService } from "../../services/cartService";

// --- Stripe Imports ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from "../../components/PaymentForm";

// REPLACE WITH YOUR PUBLISHABLE KEY
const stripePromise = loadStripe('pk_test_51SQMabEshzwQ9WRN8LjqkViMVoBPBulhjrJNqLgMqSdMTr5wYgaSYk2sVdEDUTia7Toxu3K9ZeZRfq8m1InThAeY007wtqXTQq'); // Ensure this key is correct

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useCart(); 
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // New State for Shipping Logic
  const [shippingQuote, setShippingQuote] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingConfirmed, setShippingConfirmed] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await customerService.getAddresses();
      // Safety filter: remove nulls/undefined
      const list = (data.addresses || data || []).filter(a => a);
      setAddresses(list);
      
      if (list.length > 0) {
        const defaultAddr = list.find(a => a.isDefault) || list[0];
        // Auto-select and calculate shipping
        handleAddressSelect(defaultAddr.id);
      }
    } catch (err) {
      console.error("Failed to load addresses");
    }
  };

  // 1. Handle Address Selection & Fetch Shipping
  const handleAddressSelect = async (addressId) => {
    setSelectedAddress(addressId);
    setShippingConfirmed(false);
    setCalculatingShipping(true);

    try {
      // A. Get Options (Visual only)
      const options = await cartService.getShippingOptions(addressId);
      if (options && options.length > 0) {
        setShippingQuote(options[0]);
        
        // B. Lock it in on the Backend (Updates Cart Totals)
        const updatedCart = await cartService.selectShipping(addressId);
        setCart(updatedCart); 
        setShippingConfirmed(true);
      }
    } catch (err) {
      console.error("Failed to calculate shipping:", err);
      // Don't block the UI, but warn the user
    } finally {
      setCalculatingShipping(false);
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

      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>
          
          {/* Step 1: Address Selection */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>1. Delivery Address</Typography>
            {addresses.length === 0 ? (
              <Alert severity="warning">
                No saved addresses. <Button onClick={() => navigate("/profile/addresses")}>Add One</Button>
              </Alert>
            ) : (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup value={selectedAddress} onChange={(e) => handleAddressSelect(e.target.value)}>
                  {addresses.map((addr) => (
                    addr ? (
                    <FormControlLabel
                      key={addr.id}
                      value={addr.id}
                      control={<Radio />}
                      label={`${addr.label || 'Address'}: ${addr.street}, ${addr.city}`}
                    />
                    ) : null
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {calculatingShipping && <Box mt={2}><CircularProgress size={20} /> Calculating shipping...</Box>}
            
            {!calculatingShipping && shippingQuote && (
               <Alert severity="success" sx={{ mt: 2 }}>
                 <strong>Shipping:</strong> {shippingQuote.name} — ₹{shippingQuote.cost} 
                 <br/>
                 <small>Carbon Footprint: {shippingQuote.carbonFootprint} kg CO₂e</small>
               </Alert>
            )}
          </Paper>

          {/* Step 2: Payment Method */}
          <Paper sx={{ p: 3, opacity: shippingConfirmed ? 1 : 0.5, pointerEvents: shippingConfirmed ? 'auto' : 'none' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>2. Payment Method</Typography>
            
            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="card" control={<Radio />} label="Card (Stripe)" />
                <FormControlLabel value="upi" control={<Radio />} label="UPI" disabled />
                <FormControlLabel value="cod" control={<Radio />} label="COD" disabled />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'card' && shippingConfirmed ? (
               <Elements stripe={stripePromise}>
                  <PaymentForm addressId={selectedAddress} amount={cart.grandTotal} />
               </Elements>
            ) : (
               !shippingConfirmed && <Typography color="text.secondary">Please select an address to unlock payment.</Typography>
            )}
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 2 }} />
            {cart.items.map((item) => (
              <Box key={item.cartItemId} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">{item.productName} x {item.quantity}</Typography>
                <Typography variant="body2" fontWeight={600}>₹{item.subtotal.toFixed(2)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>₹{cart.productsTotalAmount?.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight={600}>
                {cart.shippingCost > 0 ? `₹${cart.shippingCost}` : (shippingConfirmed ? "Free" : "---")}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                ₹{cart.grandTotal?.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;