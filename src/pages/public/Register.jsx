import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { LocalOffer } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { sellerService } from "../../services/sellerService";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ROLE_CUSTOMER",
    referralCode: "", // <-- 1. Added State
    // Seller specific fields
    storeName: "",
    storeDescription: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.role === "ROLE_SELLER" && !formData.storeName) {
      setError("Store Name is required for seller registration");
      return;
    }

    setLoading(true);

    try {
      // 2. Pass referralCode to the register function
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roles: ["ROLE_CUSTOMER"], 
        referralCode: formData.referralCode || null, // Send to backend
      });

      if (formData.role === "ROLE_SELLER") {
        try {
          await sellerService.applyToBeSeller({
            storeName: formData.storeName,
            businessDetails: formData.storeDescription, 
          });
          alert("Account created! Your seller application has been submitted and is pending approval.");
        } catch (sellerErr) {
          console.error("Seller application failed:", sellerErr);
          alert("Account created, but we couldn't submit your seller application. Please apply from your profile.");
        }
      } else {
        alert("Account created successfully!");
      }

      navigate("/");
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <img
          src="/logo.png"   // ← put your image inside public folder
          alt="Eco Bazaar X"
          style={{
            width: 100,
            objectFit: "contain",
          }}
        />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Join Eco Bazaar X
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account and start shopping sustainably
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          {/* --- 3. New Referral Code Input --- */}
          <TextField
            fullWidth
            label="Referral Code (Optional)"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="e.g. ECO123"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalOffer fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          {/* ---------------------------------- */}
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Account Type</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Account Type"
              onChange={handleChange}
            >
              <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
              <MenuItem value="ROLE_SELLER">Seller</MenuItem>
            </Select>
          </FormControl>

          {formData.role === "ROLE_SELLER" && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Business Details
              </Typography>
              <TextField
                fullWidth
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                required={formData.role === "ROLE_SELLER"}
                sx={{ mb: 2 }}
                size="small"
              />
              <TextField
                fullWidth
                label="Store Description / Business Details"
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                multiline
                rows={2}
                size="small"
              />
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" color="primary" fontWeight={600}>
              Log In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;