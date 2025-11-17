"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import type { ThemeTokens } from "@/lib/theme";
import { generateTheme } from "@/lib/themeApi";

const STAGE_LABELS: Record<string, string> = {
  idle: "Ready",
  analyzing: "Analyzing description...",
  designing: "Designing theme...",
  generating: "Generating tokens...",
  applying: "Applying theme...",
  done: "✓ Theme applied!",
  error: "✗ Error occurred",
};

export default function ThemeControlPanel() {
  const { generationStage, isCustomTheme, applyTheme, resetTheme, setGenerationStage } = useTheme();
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please enter a theme description");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStage("analyzing");

    try {
      // Simulate progress stages
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGenerationStage("designing");

      await new Promise((resolve) => setTimeout(resolve, 500));
      setGenerationStage("generating");

      // Call the API helper
      const data = await generateTheme(description);

      setGenerationStage("applying");
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Apply the theme
      applyTheme(data as ThemeTokens);

      setGenerationStage("done");
      setTimeout(() => setGenerationStage("idle"), 2000);
    } catch (err) {
      console.error("Theme generation error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setGenerationStage("error");
      setTimeout(() => setGenerationStage("idle"), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    resetTheme();
    setDescription("");
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border border-cyan-400/30 rounded-lg bg-surface/50 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">
        🎨 AI Theme Shaper
      </h2>

      <p className="text-sm text-muted mb-4">
        Describe the look and feel you want, and watch your theme transform in real-time.
      </p>

      <div className="space-y-4">
        {/* Theme Description Textarea */}
        <div>
          <label htmlFor="theme-description" className="block text-sm font-medium mb-2 text-foreground">
            Theme Description
          </label>
          <textarea
            id="theme-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g., 'Dark cyberpunk theme with neon purple and electric blue accents' or 'Warm sunset theme with orange, pink, and gold colors'"
            className="w-full h-24 px-3 py-2 bg-background border border-cyan-400/30 rounded text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50"
            rows={4}
          />
        </div>

        {/* Progress Indicator */}
        {generationStage !== "idle" && (
          <div className="p-3 bg-background/80 rounded border border-cyan-400/20">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="text-sm font-medium text-cyan-400">
                  {STAGE_LABELS[generationStage]}
                </div>
                <div className="mt-2 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-magenta-400 transition-all duration-500"
                    style={{
                      width:
                        generationStage === "analyzing"
                          ? "20%"
                          : generationStage === "designing"
                          ? "40%"
                          : generationStage === "generating"
                          ? "60%"
                          : generationStage === "applying"
                          ? "80%"
                          : generationStage === "done"
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              </div>
              {generationStage === "done" && (
                <span className="text-2xl animate-pulse">✓</span>
              )}
              {generationStage === "error" && (
                <span className="text-2xl text-pink-400">✗</span>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-pink-400/10 border border-pink-400/30 rounded text-pink-400 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className="flex-1 px-4 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400 text-cyan-400 font-medium rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Theme"}
          </button>

          <button
            onClick={handleReset}
            disabled={isGenerating || !isCustomTheme}
            className="px-4 py-2 bg-pink-400/10 hover:bg-pink-400/20 border border-pink-400 text-pink-400 font-medium rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Default
          </button>
        </div>

        {/* Status Indicator */}
        <div className="text-xs text-muted text-center">
          {isCustomTheme ? (
            <span className="text-cyan-400">✓ Custom theme active</span>
          ) : (
            <span>Using default CRT/EGA theme</span>
          )}
        </div>
      </div>
    </div>
  );
}
