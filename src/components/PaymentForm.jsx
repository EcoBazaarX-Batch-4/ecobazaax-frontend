import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { useCart } from '../contexts/CartContext';

// ✅ toast import
import { toast } from "@/hooks/use-toast";

const PaymentForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { loadCart } = useCart(); // refresh cart after payment success

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // 1. Create Stripe Payment Method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (stripeError) throw new Error(stripeError.message);

      // 2. Backend Checkout
      await cartService.checkout({
        paymentMethodId: paymentMethod.id,
        ecoPointsToRedeem: 0, // reserved for future eco-points feature
      });

      // 3. Success toast
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for shopping eco-friendly 🌿",
      });

      // Clear cart after success
      await loadCart();

      // Go to orders page
      navigate("/profile/orders");

    } catch (err) {
      console.error("Payment failed:", err);

      // ❌ Error toast
      toast({
        title: "Payment Failed",
        description: err.response?.data?.message || err.message || "Something went wrong.",
        variant: "destructive",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box
        sx={{
          p: 2,
          border: "1px solid #ccc",
          borderRadius: 1,
          mb: 2,
          bgcolor: "white",
        }}
      >
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!stripe || loading}
        sx={{ bgcolor: "#2ECC71", "&:hover": { bgcolor: "#27ae60" } }}
      >
        {loading ? <CircularProgress size={24} /> : `Pay ₹${amount?.toFixed(2)}`}
      </Button>
    </Box>
  );
};

export default PaymentForm;
