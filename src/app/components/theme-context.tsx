import { createContext, useContext, type ReactNode } from "react";
import { useXp } from "./xp-context";

/* ─── Color Palettes ─── */
export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgSubtle: string;
  bgAccent: string;
  borderDefault: string;
  borderAccent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;
  ringStroke: string;
  ringBg: string;
  shieldActive: string;
  shieldBg: string;
  shieldBorder: string;
  shieldText: string;
  backdrop: string;
  // Legendary exclusive
  goldAccent: string;
  goldGlow: string;
}

const STANDARD_THEME: ThemeColors = {
  bg: "#f7f6f3",
  bgCard: "#ffffff",
  bgSubtle: "#f0eeeb",
  bgAccent: "#faf9f7",
  borderDefault: "#ece9e3",
  borderAccent: "#e0ddd7",
  textPrimary: "#2a2a28",
  textSecondary: "#4a4a47",
  textMuted: "#a8a5a0",
  textFaint: "#c8c5be",
  ringStroke: "#b8b5ad",
  ringBg: "#e8e6e1",
  shieldActive: "#8a9a75",
  shieldBg: "#eef0eb",
  shieldBorder: "#d4dbc9",
  shieldText: "#6a7a5a",
  backdrop: "rgba(42, 42, 40, 0.15)",
  goldAccent: "#b8b5ad",
  goldGlow: "transparent",
};

const LEGENDARY_THEME: ThemeColors = {
  bg: "#0e0e0d",
  bgCard: "#1a1a18",
  bgSubtle: "#141413",
  bgAccent: "#1e1e1c",
  borderDefault: "#2a2a27",
  borderAccent: "#3a3530",
  textPrimary: "#f0ece4",
  textSecondary: "#c8c2b8",
  textMuted: "#8a857c",
  textFaint: "#5a5750",
  ringStroke: "#c9a84c",
  ringBg: "#2a2520",
  shieldActive: "#c9a84c",
  shieldBg: "#1e1b14",
  shieldBorder: "#3a3420",
  shieldText: "#c9a84c",
  backdrop: "rgba(0, 0, 0, 0.5)",
  goldAccent: "#c9a84c",
  goldGlow: "0 0 30px rgba(201, 168, 76, 0.12)",
};

interface ThemeContextType {
  colors: ThemeColors;
  isLegendary: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: STANDARD_THEME,
  isLegendary: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isLegendary } = useXp();
  const colors = isLegendary ? LEGENDARY_THEME : STANDARD_THEME;

  return (
    <ThemeContext.Provider value={{ colors, isLegendary }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
