import type { ThemeTokens } from "@/lib/theme";

export type ThemeGenerationResult = {
  theme: ThemeTokens;
  metadata: {
    usedAI: boolean;
    method: string;
    message?: string;
    aiError?: string; // If AI generation failed, this contains the error
    aiResponse?: string; // If AI was used, this contains the raw AI response
  };
};

// Track the current request to prevent duplicates
let currentRequest: AbortController | null = null;

export async function generateTheme(description: string): Promise<ThemeGenerationResult> {
  // Cancel any existing request
  if (currentRequest) {
    currentRequest.abort();
  }

  // Create new abort controller for this request
  currentRequest = new AbortController();
  const signal = currentRequest.signal;

  try {
    const res = await fetch("/api/theme-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
      signal, // Add abort signal
    });
    
    if (!res.ok) {
      throw new Error(`Failed to generate theme: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();

    // Support both API shapes:
    // - Legacy/Tests: top-level ThemeTokens with optional metadata
    // - New: { theme: ThemeTokens, metadata }
    let theme: ThemeTokens | undefined;
    let metadata: ThemeGenerationResult["metadata"] = {
      usedAI: false,
      method: "",
      message: undefined,
      aiError: undefined,
      aiResponse: undefined,
    };

    if (data?.theme?.colors?.background) {
      theme = data.theme as ThemeTokens;
      if (data.metadata) metadata = { ...metadata, ...data.metadata };
    } else if (data?.colors?.background) {
      theme = data as ThemeTokens;
      if (data.metadata) metadata = { ...metadata, ...data.metadata };
    }

    if (!theme) {
      throw new Error("Invalid theme data received from API");
    }

    return { theme, metadata } as ThemeGenerationResult;
  } finally {
    // Clean up the current request reference
    if (currentRequest && currentRequest.signal === signal) {
      currentRequest = null;
    }
  }
}
