"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type ThemeTokens, type GenerationStage } from "@/lib/theme";

type ThemeContextType = {
  currentTheme: ThemeTokens;
  generationStage: GenerationStage;
  isCustomTheme: boolean;
  applyTheme: (theme: ThemeTokens) => void;
  resetTheme: () => void;
  setGenerationStage: (stage: GenerationStage) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeTokens>(DEFAULT_THEME);
  const [generationStage, setGenerationStage] = useState<GenerationStage>("idle");
  const [isCustomTheme, setIsCustomTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  /**
   * Apply theme tokens to the document root CSS variables
   */
  const applyThemeToDom = useCallback((theme: ThemeTokens) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // Don't override the preset theme attribute - let ThemeToggle manage it
    // Only set to 'ega' if we're applying a custom AI theme
    // This allows preset themes (tron, crt-green, light) to work alongside custom themes

    // Apply color variables
    root.style.setProperty("--background", theme.colors.background);
    root.style.setProperty("--surface", theme.colors.surface);
    root.style.setProperty("--foreground", theme.colors.foreground);
    root.style.setProperty("--muted", theme.colors.muted);
    root.style.setProperty("--ega-cyan", theme.colors.egaCyan);
    root.style.setProperty("--ega-magenta", theme.colors.egaMagenta);
    root.style.setProperty("--ega-white", theme.colors.egaWhite);

    // Apply effects if provided
    if (theme.effects) {
      if (theme.effects.borderRadius) {
        root.style.setProperty("--theme-border-radius", theme.effects.borderRadius);
      }
      if (theme.effects.shadowColor) {
        root.style.setProperty("--theme-shadow-color", theme.effects.shadowColor);
      }
      if (theme.effects.shadowBlur) {
        root.style.setProperty("--theme-shadow-blur", theme.effects.shadowBlur);
      }
      if (theme.effects.glowIntensity) {
        root.style.setProperty("--theme-glow-intensity", theme.effects.glowIntensity);
      }
      if (theme.effects.textShadow) {
        root.style.setProperty("--theme-text-shadow", theme.effects.textShadow);
      }
    }

    // Apply typography if provided
    if (theme.typography) {
      if (theme.typography.fontFamily) {
        root.style.setProperty("--theme-font-family", theme.typography.fontFamily);
      }
      if (theme.typography.headingWeight) {
        root.style.setProperty("--theme-heading-weight", theme.typography.headingWeight);
      }
      if (theme.typography.bodyWeight) {
        root.style.setProperty("--theme-body-weight", theme.typography.bodyWeight);
      }
    }

    // Apply background art if provided
    if (theme.backgroundArt) {
      if (theme.backgroundArt.particleOpacity) {
        root.style.setProperty("--theme-particle-opacity", theme.backgroundArt.particleOpacity);
      }
      if (theme.backgroundArt.scanlineOpacity) {
        root.style.setProperty("--theme-scanline-opacity", theme.backgroundArt.scanlineOpacity);
      }
      if (theme.backgroundArt.gradientColors && theme.backgroundArt.gradientColors.length > 0) {
        const gradientString = `linear-gradient(120deg, ${theme.backgroundArt.gradientColors.join(", ")})`;
        root.style.setProperty("--theme-gradient", gradientString);
      }
    }
  }, []);

  /**
   * Apply a new theme
   */
  const applyTheme = useCallback((theme: ThemeTokens) => {
    setCurrentTheme(theme);
    applyThemeToDom(theme);
    
    // Save to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
      setIsCustomTheme(true);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [applyThemeToDom]);

  /**
   * Reset to default theme
   */
  const resetTheme = useCallback(() => {
    setCurrentTheme(DEFAULT_THEME);
    applyThemeToDom(DEFAULT_THEME);
    setIsCustomTheme(false);
    setGenerationStage("idle");
    
    // Clear from localStorage
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove theme from localStorage:", error);
    }
  }, [applyThemeToDom]);

  /**
   * Load theme from localStorage on mount
   */
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme) as ThemeTokens;
        setCurrentTheme(parsedTheme);
        applyThemeToDom(parsedTheme);
        setIsCustomTheme(true);
      } else {
        // Apply default theme on first load
        applyThemeToDom(DEFAULT_THEME);
      }
    } catch (error) {
      console.error("Failed to load theme from localStorage:", error);
      applyThemeToDom(DEFAULT_THEME);
    }
  }, [applyThemeToDom]);

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        generationStage,
        isCustomTheme,
        applyTheme,
        resetTheme,
        setGenerationStage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use the theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
