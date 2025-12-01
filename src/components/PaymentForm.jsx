import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { useCart } from '../contexts/CartContext';

const PaymentForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { loadCart } = useCart(); // To refresh (empty) cart after success

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!stripe || !elements) return; // Stripe not ready

    setLoading(true);

    try {
      // 1. Create Token
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) throw new Error(stripeError.message);

      // 2. Place Order (Address is already in backend session/cart)
      await cartService.checkout({
        paymentMethodId: paymentMethod.id,
        ecoPointsToRedeem: 0 // Future feature
      });

      // 3. Success
      alert("Order Placed Successfully!");
      await loadCart(); 
      navigate('/profile/orders');

    } catch (err) {
      console.error("Payment failed:", err);
      setError(err.response?.data?.message || err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2, bgcolor: 'white' }}>
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!stripe || loading}
        sx={{ bgcolor: '#2ECC71', '&:hover': { bgcolor: '#27ae60' } }}
      >
        {loading ? <CircularProgress size={24} /> : `Pay ₹${amount?.toFixed(2)}`}
      </Button>
    </Box>
  );
};

export default PaymentForm;