import { createTheme } from "@mui/material/styles";

// ----------------------------------------------
// 1. Modern Eco-Friendly Color Palette
// ----------------------------------------------
const palette = {
  primary: {
    main: "#2ECC71",
    dark: "#27AE60",
    light: "#58D68D",
    contrastText: "#fff",
  },
  secondary: {
    main: "#2C3E50",
    light: "#5D6D7E",
    dark: "#1C2833",
    contrastText: "#fff",
  },
  background: {
    default: "#F5F7FA",   // Softer than pure white
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1E293B",   // Slate 800
    secondary: "#64748B", // Slate 500
  },
  success: { main: "#10B981" },
  warning: { main: "#F59E0B" },
  error: { main: "#EF4444" },
};

// ----------------------------------------------
// 2. Modern Typography (Inter + smooth weights)
// ----------------------------------------------
const typography = {
  fontFamily:
    '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',

  h1: {
    fontWeight: 800,
    fontSize: "2.8rem",
    letterSpacing: "-0.03em",
    color: palette.text.primary,
  },
  h2: {
    fontWeight: 700,
    fontSize: "2.2rem",
    letterSpacing: "-0.02em",
    color: palette.text.primary,
  },
  h3: {
    fontWeight: 700,
    fontSize: "1.6rem",
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.3rem",
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.15rem",
  },
  h6: {
    fontWeight: 600,
    fontSize: "1rem",
  },

  body1: {
    fontSize: "1rem",
    lineHeight: 1.65,
    color: palette.text.primary,
  },
  body2: {
    fontSize: "0.9rem",
    lineHeight: 1.55,
    color: palette.text.secondary,
  },

  button: {
    fontWeight: 600,
    textTransform: "none",
  },
};

// ----------------------------------------------
// 3. Component Overrides (Premium UI Feel)
// ----------------------------------------------
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "12px",
        padding: "10px 26px",
        transition: "0.25s ease",
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 14px rgba(46,204,113,0.25)",
        },
      },
      containedPrimary: {
        "&:hover": {
          backgroundColor: palette.primary.dark,
        },
      },
      outlined: {
        borderWidth: "2px",
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "20px",
        padding: "6px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow:
          "0px 4px 10px rgba(0,0,0,0.03), 0px 1px 3px rgba(0,0,0,0.06)",
        transition: "0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)",
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: "18px",
        backgroundImage: "none",
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
        backgroundColor: "#FFFFFF",
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          "& fieldset": { borderColor: "#E2E8F0" },
          "&:hover fieldset": { borderColor: palette.primary.main },
          "&.Mui-focused fieldset": {
            borderWidth: "2px",
            borderColor: palette.primary.main,
          },
        },
      },
    },
  },
};

// ----------------------------------------------
// 4. Create Theme
// ----------------------------------------------
const theme = createTheme({
  palette,
  typography,
  shape: { borderRadius: 12 },
  components,
});

export default theme;
