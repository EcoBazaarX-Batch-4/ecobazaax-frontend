import { useState, useEffect } from "react";
import {
  Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Skeleton, Alert,
} from "@mui/material";
import { EmojiEvents, Park } from "@mui/icons-material";
import { productService } from "../../services/productService";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await productService.getLeaderboard();
      setLeaderboard(data.users || data || []);
    } catch (err) {
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  // Map Backend Rank Level (0-5) to Titles
  const getRankTitle = (level) => {
    switch (level) {
      case 0: return { label: "Sprout", color: "default" };
      case 1: return { label: "Sapling", color: "info" };
      case 2: return { label: "Guardian", color: "success" };
      case 3: return { label: "Eco-Hero", color: "primary" };
      case 4: return { label: "Earth-Warden", color: "secondary" };
      case 5: return { label: "Planet-Savior", color: "warning" };
      default: return { label: "Sprout", color: "default" };
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "text.secondary";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box textAlign="center" mb={6}>
        <EmojiEvents sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>Global Eco Leaderboard</Typography>
        <Typography variant="h6" color="text.secondary">Top eco-warriors making a difference</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.paper" }}>
              <TableCell><Typography fontWeight={700}>Rank</Typography></TableCell>
              <TableCell><Typography fontWeight={700}>User</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight={700}>Status</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>Avg. Carbon</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (<TableRow key={i}><TableCell colSpan={4}><Skeleton /></TableCell></TableRow>))
            ) : (
              leaderboard.map((user, index) => {
                const rankInfo = getRankTitle(user.rankLevel || 0);
                return (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {index < 3 && <EmojiEvents sx={{ color: getMedalColor(index + 1) }} />}
                        <Typography fontWeight={700}>#{user.rank || index + 1}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        {/* FIX: Use 'userName' from backend DTO */}
                        <Avatar sx={{ bgcolor: "primary.main" }}>{user.userName?.charAt(0).toUpperCase()}</Avatar>
                        <Box>
                          <Typography fontWeight={600}>{user.userName}</Typography>
                          <Typography variant="caption" color="text.secondary">{rankInfo.label}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={rankInfo.label} color={rankInfo.color} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                        <Park sx={{ color: "success.main", fontSize: 20 }} />
                        {/* FIX: Use 'averageCarbonFootprint' */}
                        <Typography fontWeight={600}>
                          {user.averageCarbonFootprint?.toFixed(2)} kg
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Leaderboard;