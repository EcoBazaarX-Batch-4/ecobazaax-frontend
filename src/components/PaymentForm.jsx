import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { useCart } from '../contexts/CartContext';

const PaymentForm = ({ addressId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { loadCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please check your internet connection.");
      return;
    }

    setLoading(true);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) throw new Error(stripeError.message);

      const response = await cartService.checkout({
        paymentMethodId: paymentMethod.id,
        addressId: addressId
      });

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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
      <Typography variant="subtitle2" gutterBottom>Enter Card Details</Typography>
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