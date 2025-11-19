import { NextRequest, NextResponse } from "next/server";
import type { ThemeTokens } from "@/lib/theme";
import { GoogleGenAI } from "@google/genai";

/**
 * AI Theme Generator API Endpoint
 * 
 * This endpoint accepts a natural language description and returns theme tokens.
 * 
 * For now, this is a smart mock implementation that extracts colors and keywords
 * from the description to generate a cohesive theme. You can replace this with
 * a real AI API call (OpenAI, Anthropic, etc.) later.
 */

// Color keyword mappings for smart theme generation
const COLOR_KEYWORDS: Record<string, string> = {
  // Blues
  blue: "#2563eb",
  "electric blue": "#60a5fa",
  navy: "#1e3a8a",
  teal: "#14b8a6",
  cyan: "#22d3ee",
  sky: "#0ea5e9",
  azure: "#3b82f6",
  
  // Purples
  purple: "#a855f7",
  violet: "#8b5cf6",
  magenta: "#ec4899",
  pink: "#f472b6",
  lavender: "#c084fc",
  
  // Reds
  red: "#ef4444",
  crimson: "#dc2626",
  rose: "#f43f5e",
  coral: "#fb7185",
  
  // Greens
  green: "#22c55e",
  lime: "#84cc16",
  emerald: "#10b981",
  mint: "#6ee7b7",
  sage: "#86efac",
  
  // Yellows/Oranges
  yellow: "#eab308",
  gold: "#f59e0b",
  orange: "#f97316",
  amber: "#f59e0b",
  peach: "#fdba74",
  
  // Earth tones
  brown: "#92400e",
  tan: "#d97706",
  beige: "#fef3c7",
  cream: "#fef3c7",
  sand: "#fcd34d",
  terracotta: "#ea580c",
  
  // Neutrals
  white: "#ffffff",
  black: "#000000",
  gray: "#6b7280",
  silver: "#d1d5db",
  slate: "#475569",
};

const MOOD_PRESETS: Record<string, Partial<ThemeTokens>> = {
  cyberpunk: {
    colors: {
      background: "#0a0e1a",
      surface: "#151925",
      foreground: "#00ffff",
      muted: "#7b8a9f",
      egaCyan: "0,255,255",
      egaMagenta: "255,0,255",
      egaWhite: "255,255,255",
    },
    effects: {
      glowIntensity: "1.2",
      textShadow: "0 0 12px rgba(0,255,255,1), 0 0 24px rgba(255,0,255,0.6)",
    },
  },
  sunset: {
    colors: {
      background: "#1a0f0a",
      surface: "#2a1810",
      foreground: "#ffb380",
      muted: "#cc8866",
      egaCyan: "255,179,128",
      egaMagenta: "255,107,107",
      egaWhite: "255,220,180",
    },
    effects: {
      glowIntensity: "0.6",
      textShadow: "0 0 8px rgba(255,179,128,0.8), 0 0 16px rgba(255,107,107,0.4)",
    },
  },
  forest: {
    colors: {
      background: "#0d1a0d",
      surface: "#162b16",
      foreground: "#a8e6a8",
      muted: "#6b8f6b",
      egaCyan: "168,230,168",
      egaMagenta: "107,143,107",
      egaWhite: "220,255,220",
    },
    effects: {
      glowIntensity: "0.5",
      textShadow: "0 0 6px rgba(168,230,168,0.6), 0 0 12px rgba(107,143,107,0.3)",
    },
  },
  ocean: {
    colors: {
      background: "#0a1628",
      surface: "#0f1e33",
      foreground: "#6fc3df",
      muted: "#4a90a4",
      egaCyan: "111,195,223",
      egaMagenta: "70,130,180",
      egaWhite: "200,220,255",
    },
    effects: {
      glowIntensity: "0.7",
      textShadow: "0 0 10px rgba(111,195,223,0.6), 0 0 20px rgba(70,130,180,0.3)",
    },
  },
  mediterranean: {
    colors: {
      background: "#f8f9fa",
      surface: "#ffffff",
      foreground: "#1a365d",
      muted: "#64748b",
      egaCyan: "59,130,246", // blue
      egaMagenta: "234,179,8", // gold/yellow
      egaWhite: "26,54,93", // dark blue
    },
    effects: {
      glowIntensity: "0.3",
      textShadow: "0 0 8px rgba(59,130,246,0.3), 0 0 16px rgba(234,179,8,0.2)",
      borderRadius: "0.75rem",
    },
    typography: {
      fontFamily: "'Georgia', 'Garamond', serif",
    },
  },
  coastal: {
    colors: {
      background: "#f0f9ff",
      surface: "#ffffff",
      foreground: "#0c4a6e",
      muted: "#64748b",
      egaCyan: "14,165,233", // sky blue
      egaMagenta: "251,191,36", // amber/sand
      egaWhite: "12,74,110", // deep blue
    },
    effects: {
      glowIntensity: "0.4",
      textShadow: "0 0 6px rgba(14,165,233,0.4), 0 0 12px rgba(251,191,36,0.2)",
    },
  },
  summer: {
    colors: {
      background: "#fffbeb",
      surface: "#ffffff",
      foreground: "#92400e",
      muted: "#78716c",
      egaCyan: "249,115,22", // orange
      egaMagenta: "234,179,8", // yellow
      egaWhite: "146,64,14", // brown
    },
    effects: {
      glowIntensity: "0.5",
      textShadow: "0 0 8px rgba(249,115,22,0.5), 0 0 16px rgba(234,179,8,0.3)",
    },
  },
};

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function extractColorsFromDescription(description: string): string[] {
  const lowerDesc = description.toLowerCase();
  const foundColors: string[] = [];

  for (const [keyword, hex] of Object.entries(COLOR_KEYWORDS)) {
    if (lowerDesc.includes(keyword)) {
      foundColors.push(hex);
    }
  }

  return foundColors;
}

function detectMood(description: string): string | null {
  const lowerDesc = description.toLowerCase();
  for (const mood of Object.keys(MOOD_PRESETS)) {
    if (lowerDesc.includes(mood)) {
      return mood;
    }
  }
  return null;
}

function generateThemeFromDescription(description: string): ThemeTokens {
  const lowerDesc = description.toLowerCase();
  
  // Check for mood presets first
  const mood = detectMood(lowerDesc);
  if (mood && MOOD_PRESETS[mood]) {
    return {
      ...MOOD_PRESETS[mood],
      colors: MOOD_PRESETS[mood].colors!,
    } as ThemeTokens;
  }

  // Extract colors from description
  const colors = extractColorsFromDescription(lowerDesc);
  
  // Determine if it's a dark or light theme - be more explicit about detecting light
  const hasLightKeyword = lowerDesc.includes("light") || 
                          lowerDesc.includes("bright") || 
                          lowerDesc.includes("airy") ||
                          lowerDesc.includes("clean") ||
                          lowerDesc.includes("white");
  const hasDarkKeyword = lowerDesc.includes("dark") || 
                         lowerDesc.includes("night") || 
                         lowerDesc.includes("black");
  
  // Default to dark unless light is explicitly mentioned
  const isDark = hasDarkKeyword ? true : !hasLightKeyword;
  
  // Generate theme based on extracted colors
  if (colors.length >= 1) {
    const primary = colors[0];
    const secondary = colors[1] || colors[0]; // Use same color twice if only one found
    const background = isDark ? "#0a0e1a" : "#f5f7fa";
    const surface = isDark ? "#151925" : "#ffffff";
    const foreground = isDark ? "#e6e6e6" : "#1e2430";
    
    return {
      colors: {
        background,
        surface,
        foreground,
        muted: isDark ? "#9aa0a6" : "#5d6b7a",
        egaCyan: hexToRgb(primary),
        egaMagenta: hexToRgb(secondary),
        egaWhite: isDark ? "255,255,255" : "30,36,48", // Use dark color for "white" in light themes
      },
      effects: {
        borderRadius: "0.5rem",
        shadowColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.1)",
        shadowBlur: "20px",
        glowIntensity: isDark ? "0.8" : "0.4",
        textShadow: `0 0 10px rgba(${hexToRgb(primary)},${isDark ? "0.8" : "0.4"}), 0 0 24px rgba(${hexToRgb(secondary)},${isDark ? "0.35" : "0.2"})`,
      },
      typography: {
        fontFamily: "Arial, Helvetica, sans-serif",
        headingWeight: "600",
        bodyWeight: "400",
      },
      backgroundArt: {
        gradientColors: [
          `rgba(${hexToRgb(primary)},${isDark ? "0.07" : "0.05"})`,
          `rgba(${hexToRgb(secondary)},${isDark ? "0.06" : "0.04"})`,
          isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)",
        ],
        particleOpacity: isDark ? "0.45" : "0.25",
        scanlineOpacity: isDark ? "0.95" : "0.35",
      },
    };
  }

  // If no colors found but light theme requested, return a light default
  if (!isDark) {
    return {
      colors: {
        background: "#f5f7fa",
        surface: "#ffffff",
        foreground: "#1e2430",
        muted: "#5d6b7a",
        egaCyan: "37,99,235", // blue
        egaMagenta: "168,85,247", // purple
        egaWhite: "30,36,48", // dark for light theme
      },
      effects: {
        borderRadius: "0.5rem",
        shadowColor: "rgba(0,0,0,0.1)",
        shadowBlur: "20px",
        glowIntensity: "0.4",
        textShadow: "0 0 8px rgba(37,99,235,0.4), 0 0 16px rgba(168,85,247,0.2)",
      },
      typography: {
        fontFamily: "Arial, Helvetica, sans-serif",
        headingWeight: "600",
        bodyWeight: "400",
      },
      backgroundArt: {
        gradientColors: ["rgba(37,99,235,0.05)", "rgba(168,85,247,0.04)", "rgba(0,0,0,0.05)"],
        particleOpacity: "0.25",
        scanlineOpacity: "0.35",
      },
    };
  }

  // Default dark variation if nothing else matches
  return {
    colors: {
      background: "#1a1a2e",
      surface: "#16213e",
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, useAI } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required and must be a string" },
        { status: 400 }
      );
    }

  let theme: ThemeTokens | null = null;
  let usedAI = false;
  const userDisabledAI = useAI === false; // explicit user toggle
    let method = "";
    let message = "";
    let aiError: string | null = null;
    let aiResponse: string | null = null; // Store AI's raw response

  // Priority 1: Try Google AI if API key is present and mock is not explicitly enabled
  // In test mode we always force the heuristic path to keep tests fast and offline.
  const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST_WORKER_ID;
  const useMockAI = isTest || process.env.USE_MOCK_AI === 'true';
  const shouldAttemptAI = !userDisabledAI && !useMockAI;
    
    if (process.env.GOOGLEAI_API_KEY && shouldAttemptAI) {
      console.log("Attempting Google AI generation...");
      try {
        const result = await generateWithGoogleAI(description);
        if (result) {
          theme = result.theme;
          aiResponse = result.rawResponse;
          usedAI = true;
          method = "Google Gemini";
          message = "Theme generated using Google AI based on your description";
          console.log("Google AI generation succeeded");
        } else {
          // API call succeeded but returned invalid theme
          aiError = "AI returned invalid theme format";
          console.warn("Google AI returned invalid theme format");
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error';
        console.error("Google AI generation failed:", errorMsg);
        aiError = `Google AI error: ${errorMsg}`;
      }
    } else if (userDisabledAI) {
      aiError = "AI generation disabled by user";
      console.log("Skipping AI generation: user toggled AI off");
    } else if (useMockAI) {
      aiError = "AI generation disabled (USE_MOCK_AI=true in .env)";
      console.log("Skipping AI generation: USE_MOCK_AI is enabled or running under test mode");
    } else if (!process.env.GOOGLEAI_API_KEY) {
      aiError = "No AI API key configured (GOOGLEAI_API_KEY not set)";
      console.log("Skipping AI generation: No API key configured");
    }

    // Priority 2: Use enhanced heuristic generator (smart mock)
    if (!theme) {
      console.log("Using smart fallback generator");
      theme = generateThemeFromDescription(description);
      usedAI = false;
      
      // Determine which method was used
      const lowerDesc = description.toLowerCase();
      const mood = detectMood(lowerDesc);
      
      // Build status prefix
      const statusPrefix = aiError ? `[${aiError}] ` : "";
      
      if (mood) {
        method = `Preset: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`;
        message = `${statusPrefix}Detected "${mood}" mood from your description`;
      } else {
        const colors = extractColorsFromDescription(lowerDesc);
        if (colors.length > 0) {
          method = `Smart Color Analysis (${colors.length} color${colors.length > 1 ? 's' : ''})`;
          message = `${statusPrefix}Extracted ${colors.length} color${colors.length > 1 ? 's' : ''} from your description`;
        } else {
          method = "Default Theme (Fallback)";
          message = `${statusPrefix}No specific colors or moods detected in description`;
        }
      }
      
      console.log(`Fallback method: ${method}`);
      console.log(`Message: ${message}`);
    }

    // For backward compatibility with tests and older clients, return theme tokens at the top level
    // and include metadata as an additional field. Clients that expect { theme, metadata } can
    // still work by checking for the presence of top-level colors vs nested theme.
    return NextResponse.json(
      {
        ...theme,
        metadata: {
          usedAI,
          method,
          message,
          aiError: aiError || undefined, // Include AI error details if present
          aiResponse: aiResponse || undefined, // Include AI raw response if present
          userDisabledAI: userDisabledAI || undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Theme generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate theme", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function isValidThemeTokens(obj: unknown): obj is ThemeTokens {
  if (!obj || typeof obj !== 'object') return false;
  if (!('colors' in obj)) return false;
  const c = (obj as { colors: { background?: unknown; surface?: unknown; foreground?: unknown; muted?: unknown; egaCyan?: unknown; egaMagenta?: unknown; egaWhite?: unknown } }).colors;
  return (
    typeof c.background === 'string' &&
    typeof c.surface === 'string' &&
    typeof c.foreground === 'string' &&
    typeof c.muted === 'string' &&
    typeof c.egaCyan === 'string' &&
    typeof c.egaMagenta === 'string' &&
    typeof c.egaWhite === 'string'
  );
}

/**
 * Generate theme using Google Gemini via @google/genai
 */
async function generateWithGoogleAI(
  description: string
): Promise<{ theme: ThemeTokens; rawResponse: string } | null> {
  const apiKey = process.env.GOOGLEAI_API_KEY as string | undefined;
  if (!apiKey) throw new Error("GOOGLEAI_API_KEY is not set");

  const genAI = new GoogleGenAI({ apiKey });

  const prompt = `You are a UI theme generator. Based on this description, generate a website theme with appropriate colors.

Description: "${description}"

egaCyan, egaMagenta, and egaWhite are the three default colors of the website; ignore the variable names and generate these colors based on the description above and using r,g,b.
The rest of the colors are standard hex color codes.
Output ONLY valid JSON matching this structure (no markdown, no prose):
{
  "colors": {
    "background": "#hex",
    "surface": "#hex",
    "foreground": "#hex",
    "muted": "#hex",
    "egaCyan": "r,g,b",
    "egaMagenta": "r,g,b",
    "egaWhite": "r,g,b"
  },
  "effects": {
    "glowIntensity": "0.5"
  }
}

Rules:
- background must contrast well with the ega colors.
- Use complementary colors for accents.
- Ensure good contrast (WCAG AA).
- NEVER output markdown or text outside JSON.`;


  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  
  const text = result.text;
  if (!text) return null;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  const raw = jsonMatch[0];
  try {
    const parsed = JSON.parse(raw);
    if (parsed.colors && !isValidThemeTokens(parsed)) {
      const theme: ThemeTokens = {
        colors: {
          background: parsed.colors.background || "#1a1a2e",
          surface: parsed.colors.surface || "#16213e",
          foreground: parsed.colors.foreground || "#e6e6e6",
          muted: parsed.colors.muted || "#9aa0a6",
          egaCyan: parsed.colors.egaCyan || "34,211,238",
          egaMagenta: parsed.colors.egaMagenta || "244,114,182",
          egaWhite: parsed.colors.egaWhite || "255,255,255",
        },
        effects: {
          borderRadius: parsed.effects?.borderRadius || "0.5rem",
          shadowColor: parsed.effects?.shadowColor || "rgba(0,0,0,0.6)",
          shadowBlur: parsed.effects?.shadowBlur || "20px",
          glowIntensity: parsed.effects?.glowIntensity || "0.8",
          textShadow:
            parsed.effects?.textShadow ||
            "0 0 10px rgba(34,211,238,0.8), 0 0 24px rgba(244,114,182,0.35)",
        },
        typography: {
          fontFamily:
            parsed.typography?.fontFamily ||
            "Arial, Helvetica, sans-serif",
          headingWeight: parsed.typography?.headingWeight || "600",
          bodyWeight: parsed.typography?.bodyWeight || "400",
        },
        backgroundArt: {
          gradientColors:
            parsed.backgroundArt?.gradientColors || [
              "rgba(34,211,238,0.07)",
              "rgba(244,114,182,0.06)",
              "rgba(255,255,255,0.02)",
            ],
          particleOpacity:
            parsed.backgroundArt?.particleOpacity || "0.45",
          scanlineOpacity:
            parsed.backgroundArt?.scanlineOpacity || "0.95",
        },
      };
      return { theme, rawResponse: text };
    }
    if (isValidThemeTokens(parsed)) {
      return { theme: parsed, rawResponse: text };
    }
    return null;
  } catch {
    return null;
  }
}
