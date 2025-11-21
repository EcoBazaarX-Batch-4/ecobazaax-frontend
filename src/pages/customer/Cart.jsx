import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Divider,
  Alert,
} from "@mui/material";
import { Delete, Add, Remove, ShoppingCart } from "@mui/icons-material";
import { useCart } from "../../contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateCartItem, removeFromCart, getCartTotal } = useCart();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {}
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {}
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography>Loading cart...</Typography>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box textAlign="center">
          <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button variant="contained" onClick={() => navigate("/products")} sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Shopping Cart
      </Typography>

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
                          sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
                        />
                        <Typography fontWeight={600}>
                          {item.productName}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="right">₹{item.price}</TableCell>

                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.cartItemId || item.id, item.quantity - 1)
                          }
                        >
                          <Remove />
                        </IconButton>

                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.cartItemId || item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          inputProps={{ min: 1, style: { textAlign: "center" } }}
                          sx={{ width: 60 }}
                        />

                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.cartItemId || item.id, item.quantity + 1)
                          }
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      ₹{(item.subtotal || item.price * item.quantity).toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.cartItemId || item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ width: { xs: "100%", md: 350 } }}>
          <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Order Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>
                ₹{cart.productsTotalAmount?.toFixed(2) || getCartTotal().toFixed(2)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight={600}>
                {cart.shippingCost > 0 ? `₹${cart.shippingCost}` : "Free"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                ₹{cart.grandTotal?.toFixed(2) || getCartTotal().toFixed(2)}
              </Typography>
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
