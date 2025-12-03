import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        py: 6,
        mt: "auto",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <img
            src="/logo.png"
            alt="Eco Bazaar X"
            style={{ width: 52, objectFit: "contain" }}
          />
              <Typography variant="h6" color="primary" fontWeight={700}>
                Eco Bazaar X
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Your trusted marketplace for sustainable and eco-friendly products. Building a greener future together.
            </Typography>
            <Box display="flex" gap={1}>
              <IconButton size="small" sx={{ color: "primary.main" }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: "primary.main" }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: "primary.main" }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: "primary.main" }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" fontWeight={600} mb={2}>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/products" color="text.secondary" underline="hover">
                Shop Products
              </Link>
              <Link href="/leaderboard/global" color="text.secondary" underline="hover">
                Leaderboard
              </Link>
              <Link href="/register" color="text.secondary" underline="hover">
                Become a Seller
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                About Us
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" fontWeight={600} mb={2}>
              Support
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="#" color="text.secondary" underline="hover">
                Help Center
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Contact Us
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Privacy Policy
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Terms of Service
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4} pt={3} borderTop="1px solid" borderColor="divider">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Eco Bazaar X. All rights reserved. Building a sustainable future.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;