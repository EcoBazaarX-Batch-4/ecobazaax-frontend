import { Chip } from "@mui/material";
import { Park } from "@mui/icons-material";

const CarbonBadge = ({ carbonFootprint, size = "medium" }) => {
  const getCarbonLevel = (value) => {
    if (value < 5) return { label: "Low Impact", color: "success" };
    if (value < 15) return { label: "Medium Impact", color: "warning" };
    return { label: "High Impact", color: "error" };
  };

  const { label, color } = getCarbonLevel(carbonFootprint);

  return (
    <Chip
      icon={<Park />}
      label={`${carbonFootprint}kg CO₂ - ${label}`}
      color={color}
      size={size}
      sx={{ fontWeight: 600 }}
    />
  );
};

export default CarbonBadge;
