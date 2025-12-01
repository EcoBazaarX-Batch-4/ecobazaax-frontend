import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Button, TextField, Divider, Alert, InputAdornment, Chip
} from "@mui/material";
import { Delete, Add, Remove, ShoppingCart, LocalOffer } from "@mui/icons-material";
import { useCart } from "../../contexts/CartContext";
import { cartService } from "../../services/cartService"; 

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateCartItem, removeFromCart, getCartTotal, applyDiscount } = useCart();
  
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]); 

  useEffect(() => {
    const loadCoupons = async () => {
        try {
            const coupons = await cartService.getAvailableDiscounts();
            setAvailableCoupons(coupons);
        } catch (e) { /* ignore */ }
    };
    loadCoupons();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try { await updateCartItem(itemId, newQuantity); } catch (err) { }
  };

  const handleRemoveItem = async (itemId) => {
    try { await removeFromCart(itemId); } catch (err) { }
  };

  const handleApplyDiscount = async (codeToApply) => {
    const code = codeToApply || promoCode;
    if (!code) return;
    setPromoMessage(null);
    const result = await applyDiscount(code);
    if (result.success) {
        setPromoMessage({ type: 'success', text: 'Discount applied!' });
    } else {
        setPromoMessage({ type: 'error', text: result.message });
    }
  };

  if (loading) return <Container maxWidth="lg" sx={{ py: 6 }}><Typography>Loading cart...</Typography></Container>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box textAlign="center">
          <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
          <Button variant="contained" onClick={() => navigate("/products")} sx={{ mt: 2 }}>Continue Shopping</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Shopping Cart</Typography>

      <Box display="flex" gap={3} flexDirection={{ xs: "column", md: "row" }}>
        <Box flexGrow={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.cartItemId || item.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          component="img"
                          src={item.imageUrl || "https://via.placeholder.com/80"}
                          alt={item.productName}
                          sx={{ width: 80, height: 80, objectFit: "contain", borderRadius: 1, border: "1px solid #eee", p: 1 }}
                        />
                        <Box>
                            <Typography fontWeight={600}>{item.productName}</Typography>
                            <Typography variant="caption" color="success.main">
                                {item.itemCarbonFootprint} kg CO₂e
                            </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">₹{item.price}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.cartItemId || item.id, item.quantity - 1)}><Remove /></IconButton>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.cartItemId || item.id, parseInt(e.target.value) || 1)}
                          inputProps={{ min: 1, style: { textAlign: "center" } }}
                          sx={{ width: 60 }}
                        />
                        <IconButton size="small" onClick={() => handleQuantityChange(item.cartItemId || item.id, item.quantity + 1)}><Add /></IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">₹{item.subtotal?.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleRemoveItem(item.cartItemId || item.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {availableCoupons.length > 0 && (
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>Available Coupons</Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                    {availableCoupons.map((coupon) => (
                        <Chip 
                            key={coupon.code}
                            icon={<LocalOffer />}
                            label={`${coupon.code} (${coupon.amountSaved}% OFF)`} 
                            clickable
                            color="secondary"
                            variant="outlined"
                            onClick={() => {
                                setPromoCode(coupon.code);
                                handleApplyDiscount(coupon.code);
                            }}
                        />
                    ))}
                </Box>
            </Paper>
          )}
        </Box>

        <Box sx={{ width: { xs: "100%", md: 350 } }}>
          <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>₹{cart.productsTotalAmount?.toFixed(2) || getCartTotal().toFixed(2)}</Typography>
            </Box>

            {/* --- FIX: Added Tax Row --- */}
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">18% Tax (GST)</Typography>
              <Typography fontWeight={600}>
                  {cart.taxAmount > 0 ? `₹${cart.taxAmount.toFixed(2)}` : "Calculated at Checkout"}
              </Typography>
            </Box>
      

            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight={600}>{cart.shippingCost > 0 ? `₹${cart.shippingCost}` : "Calculated at Checkout"}</Typography>
            </Box>

            
            {cart.appliedDiscount && (
                <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: 'success.main' }}>
                  <Typography>Discount ({cart.appliedDiscount.code})</Typography>
                  <Typography fontWeight={600}>-₹{cart.appliedDiscount.amountSaved?.toFixed(2)}</Typography>
                </Box>
            )}
            
            {/* ------------------------- */}
            
            <Divider sx={{ my: 2 }} />

            <Box mb={2}>
                <TextField 
                    fullWidth placeholder="Promo Code" size="small"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    InputProps={{
                        endAdornment: (<InputAdornment position="end"><Button onClick={() => handleApplyDiscount()}>Apply</Button></InputAdornment>),
                        startAdornment: (<InputAdornment position="start"><LocalOffer fontSize="small" /></InputAdornment>)
                    }}
                />
                {promoMessage && (
                    <Typography variant="caption" color={promoMessage.type === 'error' ? 'error' : 'success.main'} sx={{ mt: 0.5, display: 'block' }}>
                        {promoMessage.text}
                    </Typography>
                )}
            </Box>

            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                ₹{cart.grandTotal?.toFixed(2) || getCartTotal().toFixed(2)}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Total Carbon</Typography>
              <Typography fontWeight={600} color="success.main">{cart.productsTotalCarbon?.toFixed(2)} kg</Typography>
            </Box>
            <Button variant="contained" fullWidth size="large" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart;