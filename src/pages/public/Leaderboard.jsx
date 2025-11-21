import { useState, useEffect } from "react";
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
  Avatar,
  Chip,
  Skeleton,
  Alert,
} from "@mui/material";
import { EmojiEvents, Park, Public } from "@mui/icons-material";
import { productService } from "../../services/productService"; // FIX: Use public service

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      // Endpoint: GET /api/v1/leaderboard/global
      const data = await productService.getLeaderboard();
      // Handle potential response structures (list vs object wrapper)
      setLeaderboard(data.users || data || []);
    } catch (err) {
      setError("Failed to load leaderboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Map Backend Rank Level to UI Titles ---
  // Logic matches Backend CheckoutService: 0-4 (Sprout)... 75+ (Planet-Savior)
  const getRankTitle = (level) => {
    switch (level) {
      case 0: return { label: "Sprout", color: "default" };
      case 1: return { label: "Sapling", color: "info" };
      case 2: return { label: "Guardian", color: "success" };
      case 3: return { label: "Eco-Hero", color: "primary" };
      case 4: return { label: "Earth-Warden", color: "secondary" };
      case 5: return { label: "Planet-Savior", color: "warning" }; // Gold
      default: return { label: "Sprout", color: "default" };
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return "#FFD700"; // Gold
    if (rank === 2) return "#C0C0C0"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return "text.secondary";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box textAlign="center" mb={6}>
        <EmojiEvents sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Global Eco Leaderboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Top eco-warriors making a difference
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.paper" }}>
              <TableCell><Typography fontWeight={700}>Rank</Typography></TableCell>
              <TableCell><Typography fontWeight={700}>User</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={700}>Eco Status</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>Eco Points</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>Carbon Saved</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={30} /></TableCell>
                  <TableCell><Skeleton width={200} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                </TableRow>
              ))
            ) : (
              leaderboard.map((user, index) => {
                const rankInfo = getRankTitle(user.rankLevel || 0);
                
                return (
                <TableRow key={user.id} hover>
                  {/* Rank Column */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {index < 3 && <EmojiEvents sx={{ color: getMedalColor(index + 1) }} />}
                      <Typography fontWeight={index < 3 ? 700 : 400} fontSize={index < 3 ? "1.2rem" : "1rem"}>
                        #{index + 1}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* User Column */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{user.name}</Typography>
                        {/* Removed user.location as it doesn't exist in backend */}
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Public sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            Global Citizen
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Status Column (New) */}
                  <TableCell align="center">
                    <Chip 
                      label={rankInfo.label} 
                      color={rankInfo.color} 
                      size="small" 
                      variant={index < 3 ? "filled" : "outlined"}
                    />
                  </TableCell>

                  {/* Points Column */}
                  <TableCell align="right">
                    <Chip
                      label={`${user.ecoPoints || 0} pts`}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600, borderColor: 'primary.main', color: 'primary.main' }}
                    />
                  </TableCell>

                  {/* Carbon Column */}
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                      <Park sx={{ color: "success.main", fontSize: 20 }} />
                      {/* FIX: Use lifetimeTotalCarbon */}
                      <Typography fontWeight={600}>
                        {(user.lifetimeTotalCarbon || 0).toFixed(1)} kg
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )})
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Leaderboard;