import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "pink",
  fontFamily: "'Nunito', 'Quicksand', sans-serif",
  headings: {
    fontWeight: "800",
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.15" },
      h2: { fontSize: "1.75rem", lineHeight: "1.25" },
      h3: { fontSize: "1.375rem", lineHeight: "1.3" },
      h4: { fontSize: "1.125rem", lineHeight: "1.35" },
    },
  },
  radius: { xs: "6px", sm: "8px", md: "12px", lg: "16px", xl: "24px" },
  defaultRadius: "md",
  shadows: {
    xs: "0 1px 2px rgb(0 0 0 / 4%)",
    sm: "0 2px 8px rgb(0 0 0 / 6%)",
    md: "0 4px 16px rgb(0 0 0 / 6%)",
    lg: "0 8px 32px rgb(0 0 0 / 8%)",
    xl: "0 16px 48px rgb(0 0 0 / 10%)",
  },
  other: {
    transitionDuration: "0.25s",
    featureColors: { studyNook: "pink", virtualLobby: "grape", survivalGuide: "teal" },
  },
});
