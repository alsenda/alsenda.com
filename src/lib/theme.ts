/**
 * AI Theme Shaper - Theme Type Definitions and Default Theme
 */

export type ThemeTokens = {
  colors: {
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    egaCyan: string; // RGB values like "34,211,238"
    egaMagenta: string;
    egaWhite: string;
  };
  effects?: {
    borderRadius?: string;
    shadowColor?: string;
    shadowBlur?: string;
    glowIntensity?: string;
    textShadow?: string;
  };
  typography?: {
    fontFamily?: string;
    headingWeight?: string;
    bodyWeight?: string;
  };
  backgroundArt?: {
    gradientColors?: string[];
    particleOpacity?: string;
    scanlineOpacity?: string;
  };
};

export type GenerationStage = 
  | "idle"
  | "analyzing"
  | "designing"
  | "generating"
  | "applying"
  | "done"
  | "error";

/**
 * Default CRT/EGA retro theme - extracted from current globals.css
 */
export const DEFAULT_THEME: ThemeTokens = {
  colors: {
    background: "#222326",
    surface: "#2b2b2d",
    foreground: "#e6e6e6",
    muted: "#9aa0a6",
    egaCyan: "34,211,238",
    egaMagenta: "244,114,182",
    egaWhite: "255,255,255",
  },
  effects: {
    borderRadius: "0.5rem",
    shadowColor: "rgba(0,0,0,0.6)",
    shadowBlur: "20px",
    glowIntensity: "0.8",
    textShadow: "0 0 10px rgba(34,211,238,0.8), 0 0 24px rgba(244,114,182,0.35)",
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    headingWeight: "600",
    bodyWeight: "400",
  },
  backgroundArt: {
    gradientColors: ["rgba(34,211,238,0.07)", "rgba(244,114,182,0.06)", "rgba(255,255,255,0.02)"],
    particleOpacity: "0.45",
    scanlineOpacity: "0.95",
  },
};

/**
 * Local storage key for persisted theme
 */
export const THEME_STORAGE_KEY = "alsenda-custom-theme";
