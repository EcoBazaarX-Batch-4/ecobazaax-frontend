import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- 1. Import
import { useAuth } from '../contexts/AuthContext'; // <-- 2. Import
import { Button, TextField, Container, Typography, Box, Grid } from '@mui/material';

function RegisterPage() {
  // --- 3. Get the register function and navigate ---
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // --- 4. Use the register function from our context ---
      // This now registers, logs in, AND fetches the profile
      await register(name, email, password);
      
      // --- 5. Redirect to the homepage on success ---
      navigate('/'); 
      
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        
        {error && (
          <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* ... (Your TextField components for name, email, password are unchanged) ... */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid>
              <Link to="/login">
                {"Already have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
          
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;