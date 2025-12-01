import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, icon, color = "primary" }) => {
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color === "primary" ? "#2ECC71" : "#1976d2"} 0%, ${
          color === "primary" ? "#27AE60" : "#1565c0"
        } 100%)`,
        color: "white",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 2,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;