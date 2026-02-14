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
    egaYellow?: string; // Optional RGB values like "255,243,166"
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
 * Default Neo-Brutalist theme.
 * This is applied by ThemeProvider on mount, so it should match the intended
 * site-wide default look to avoid a flash of another style during hydration.
 */
export const DEFAULT_THEME: ThemeTokens = {
  colors: {
    background: "#d9f0ff", // powder blue
    surface: "#ffffff", // paper
    foreground: "#111111", // ink
    muted: "#334155", // slate-ish
    egaCyan: "0,163,255", // bold cyan accent
    egaMagenta: "255,0,153", // hot magenta accent
    egaWhite: "0,0,0", // map 'white' utility classes to ink in light neo theme
    egaYellow: "255,243,166", // warm brutalist yellow
  },
  effects: {
    borderRadius: "0px",
    shadowColor: "#111111",
    shadowBlur: "0px",
    glowIntensity: "0",
    textShadow: "none",
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    headingWeight: "800",
    bodyWeight: "500",
  },
  backgroundArt: {
    gradientColors: [],
    particleOpacity: "0",
    scanlineOpacity: "0",
  },
};

/**
 * Local storage key for persisted theme
 */
export const THEME_STORAGE_KEY = "alsenda-custom-theme";
