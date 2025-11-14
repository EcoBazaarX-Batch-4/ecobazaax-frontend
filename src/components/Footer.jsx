import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#333', // A dark footer
        color: 'white',
        py: 4, // Padding top and bottom
        mt: 'auto' // Pushes footer to bottom
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" gutterBottom>
          Eco Bazar X
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 2 }}>
          Shop sustainably. Live beautifully.
        </Typography>
        <Box>
          <Link href="/about" color="inherit" sx={{ mr: 2 }}>About Us</Link>
          <Link href="/privacy" color="inherit" sx={{ mr: 2 }}>Privacy Policy</Link>
          <Link href="/terms" color="inherit">Terms of Service</Link>
        </Box>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" sx={{ pt: 2 }}>
          © {new Date().getFullYear()} Eco Bazar X. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;