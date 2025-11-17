import { NextRequest, NextResponse } from "next/server";
import type { ThemeTokens } from "@/lib/theme";

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
  
  // Purples
  purple: "#a855f7",
  violet: "#8b5cf6",
  magenta: "#ec4899",
  pink: "#f472b6",
  
  // Reds
  red: "#ef4444",
  crimson: "#dc2626",
  rose: "#f43f5e",
  
  // Greens
  green: "#22c55e",
  lime: "#84cc16",
  emerald: "#10b981",
  
  // Yellows/Oranges
  yellow: "#eab308",
  gold: "#f59e0b",
  orange: "#f97316",
  amber: "#f59e0b",
  
  // Neutrals
  white: "#ffffff",
  black: "#000000",
  gray: "#6b7280",
  silver: "#d1d5db",
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
  
  // Determine if it's a dark or light theme
  const isDark = !lowerDesc.includes("light") && !lowerDesc.includes("bright");
  
  // Generate theme based on extracted colors
  if (colors.length >= 2) {
    const [primary, secondary] = colors;
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
        egaWhite: isDark ? "255,255,255" : "0,0,0",
      },
      effects: {
        borderRadius: "0.5rem",
        shadowColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.1)",
        shadowBlur: "20px",
        glowIntensity: isDark ? "0.8" : "0.4",
        textShadow: `0 0 10px rgba(${hexToRgb(primary)},0.8), 0 0 24px rgba(${hexToRgb(secondary)},0.35)`,
      },
      typography: {
        fontFamily: "Arial, Helvetica, sans-serif",
        headingWeight: "600",
        bodyWeight: "400",
      },
      backgroundArt: {
        gradientColors: [
          `rgba(${hexToRgb(primary)},0.07)`,
          `rgba(${hexToRgb(secondary)},0.06)`,
          isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)",
        ],
        particleOpacity: isDark ? "0.45" : "0.25",
        scanlineOpacity: isDark ? "0.95" : "0.35",
      },
    };
  }

  // Default to a variation of the current theme if no colors found
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
    const { description } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required and must be a string" },
        { status: 400 }
      );
    }

    // Try AI-backed generation first if OPENAI_API_KEY is present
    let theme: ThemeTokens | null = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        theme = await generateWithOpenAI(description);
      } catch (e) {
        console.error("OpenAI generation failed, falling back to heuristic:", e);
      }
    }

    // Fallback to heuristic generator
    if (!theme) {
      theme = generateThemeFromDescription(description);
    }

    return NextResponse.json(theme, { status: 200 });
  } catch (error) {
    console.error("Theme generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate theme" },
      { status: 500 }
    );
  }
}

function isValidThemeTokens(obj: any): obj is ThemeTokens {
  if (!obj || typeof obj !== 'object') return false;
  if (!obj.colors) return false;
  const c = obj.colors;
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

async function generateWithOpenAI(description: string): Promise<ThemeTokens | null> {
  const apiKey = process.env.OPENAI_API_KEY as string;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const system = `You are a UI theme generator. Output ONLY a JSON object that matches this TypeScript type, no prose:\n\n{
  "colors": {
    "background": string,            // hex color like "#0a0e1a"
    "surface": string,               // hex color
    "foreground": string,            // hex color
    "muted": string,                 // hex color
    "egaCyan": string,               // rgb tuple string like "34,211,238"
    "egaMagenta": string,            // rgb tuple string
    "egaWhite": string               // rgb tuple string
  },
  "effects"?: {
    "borderRadius"?: string,
    "shadowColor"?: string,
    "shadowBlur"?: string,
    "glowIntensity"?: string,
    "textShadow"?: string
  },
  "typography"?: {
    "fontFamily"?: string,
    "headingWeight"?: string,
    "bodyWeight"?: string
  },
  "backgroundArt"?: {
    "gradientColors"?: string[],     // CSS color strings like rgba(...)
    "particleOpacity"?: string,      // 0..1 as string
    "scanlineOpacity"?: string       // 0..1 as string
  }
}\n\nRules:\n- Base on a CRT/EGA retro aesthetic unless user explicitly asks otherwise.\n- Keep contrasts accessible.\n- Use hex for solid colors and rgb tuple strings for ega* fields.\n- Keep output strictly valid JSON.`;

  const user = `Theme description: ${description}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) return null;
  let parsed: any = null;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    return null;
  }
  if (isValidThemeTokens(parsed)) return parsed;
  return null;
}
