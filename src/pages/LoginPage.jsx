import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- 1. Import navigation tools
import { useAuth } from '../contexts/AuthContext'; // <-- 2. Import our auth hook
import { Button, TextField, Container, Typography, Box, Grid } from '@mui/material'; // Import Link

function LoginPage() {
  // --- 3. Get the login function and navigate ---
  const { login } = useAuth();
  const navigate = useNavigate(); // This is the hook for redirecting
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // --- 4. Use the login function from our context ---
      // This now logs in AND fetches the profile
      await login(email, password);
      
      // --- 5. Redirect to the homepage on success ---
      navigate('/'); 
      
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your email and password.');
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
          Sign in
        </Typography>
        
        {error && (
          <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* ... (Your TextField components for email and password are unchanged) ... */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          
          {/* 6. Add links to register/forgot password */}
          <Grid container>
            <Grid>
              {/* <Link to="/forgot-password"> Forgot password? </Link> */}
            </Grid>
            <Grid>
              <Link to="/register">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          
        </Box>
      </Box>
    </Container>
  );
}

// We need to import Link from react-router-dom for this to work
export default LoginPage;