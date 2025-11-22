import { createTheme } from "@mui/material/styles";

// --- 1. Color Palette (Eco-Modern) ---
const palette = {
  primary: {
    main: "#2ECC71", // Vibrant Emerald
    light: "#58D68D", // Soft Green
    dark: "#27AE60",  // Deep Forest
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#34495E", // Trustworthy Charcoal
    light: "#5D6D7E",
    dark: "#2C3E50",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F8FAFC", // Cool Gray 50 (Not harsh white)
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1E293B", // Slate 800 (Softer than pure black)
    secondary: "#64748B", // Slate 500
  },
  success: { main: "#10B981" },
  warning: { main: "#F59E0B" },
  error:   { main: "#EF4444" },
};

// --- 2. Typography (Clean & Readable) ---
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700, fontSize: "2.25rem", letterSpacing: "-0.02em", color: palette.text.primary },
  h2: { fontWeight: 700, fontSize: "1.875rem", letterSpacing: "-0.01em", color: palette.text.primary },
  h3: { fontWeight: 600, fontSize: "1.5rem", color: palette.text.primary },
  h4: { fontWeight: 600, fontSize: "1.25rem", color: palette.text.primary },
  h5: { fontWeight: 600, fontSize: "1.125rem" },
  h6: { fontWeight: 600, fontSize: "1rem" },
  button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.01em" }, // No ALL-CAPS buttons
  body1: { fontSize: "1rem", lineHeight: 1.6, color: palette.text.primary },
  body2: { fontSize: "0.875rem", lineHeight: 1.5, color: palette.text.secondary },
};

// --- 3. Component Overrides (The "Premium" Feel) ---
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "10px", // Friendly rounded buttons
        padding: "10px 24px",
        boxShadow: "none", // Flat default
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)", // Subtle lift effect
          boxShadow: "0 4px 12px rgba(46, 204, 113, 0.25)", // Glow on hover
        },
      },
      containedPrimary: {
        "&:hover": {
          backgroundColor: palette.primary.dark,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "16px", // Modern card radius
        boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)", // Subtle Tailwind-like shadow
        border: "1px solid rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)", // Lift whole card
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)", // Deep shadow
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none", // Remove generic Material overlay
      },
      rounded: {
        borderRadius: "16px",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: "8px", // Rounded rect instead of pill
        fontWeight: 600,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          "& fieldset": { borderColor: "#E2E8F0" },
          "&:hover fieldset": { borderColor: palette.primary.main },
          "&.Mui-focused fieldset": { borderWidth: "2px" },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 0 rgba(0,0,0,0.05)", // Subtle border-bottom instead of shadow
        backgroundColor: "#FFFFFF",
      },
    },
  },
};

const theme = createTheme({
  palette,
  typography,
  shape: { borderRadius: 12 },
  components,
});

export default theme;