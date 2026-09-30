import { createTheme } from "@mui/material/styles";

/* Dashboard palette: charcoal surfaces, lime primary, violet secondary */
export const palette = {
  bg: "#0f0f10",
  surface: "#1b1b1d",
  surface2: "#242427",
  line: "rgba(255,255,255,0.07)",
  lime: "#d4f36b",
  limeDark: "#b7d94f",
  violet: "#8f7cf5",
  violetDark: "#6a58d6",
  text: "#f4f4f5",
  textDim: "#9a9aa1",
  teal: "#7ee2c5",
  amber: "#f6c56b",
  rose: "#f3899c",
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: palette.lime, dark: palette.limeDark, contrastText: "#111111" },
    secondary: { main: palette.violet, dark: palette.violetDark, contrastText: "#ffffff" },
    success: { main: palette.teal },
    warning: { main: palette.amber },
    error: { main: palette.rose },
    background: { default: palette.bg, paper: palette.surface },
    text: { primary: palette.text, secondary: palette.textDim },
    divider: palette.line,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: `1px solid ${palette.line}` },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20 },
        sizeLarge: { paddingBlock: 12, paddingInline: 28, fontSize: 15 },
        outlined: {
          borderColor: palette.line,
          backgroundColor: palette.surface2,
          color: palette.text,
          "&:hover": { borderColor: "rgba(255,255,255,0.18)", backgroundColor: "#2c2c30" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: `1px solid ${palette.line}`,
          backgroundColor: palette.surface2,
          "&:hover": { backgroundColor: "#2c2c30" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 24, backgroundColor: palette.surface },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: 999, backgroundColor: palette.surface2 },
        bar: { borderRadius: 999 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: palette.surface2, border: `1px solid ${palette.line}`, fontSize: 12 },
      },
    },
  },
});
