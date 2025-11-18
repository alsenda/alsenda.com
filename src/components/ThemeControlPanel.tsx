"use client";

import { useState, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { generateTheme, type ThemeGenerationResult } from "@/lib/themeApi";

const STAGE_LABELS: Record<string, string> = {
  idle: "Ready",
  analyzing: "Analyzing description...",
  designing: "Designing theme...",
  generating: "Generating tokens...",
  applying: "Applying theme...",
  done: "Theme applied successfully",
  error: "Error occurred",
};

export default function ThemeControlPanel() {
  const { generationStage, isCustomTheme, applyTheme, resetTheme, setGenerationStage } = useTheme();
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [generationMethod, setGenerationMethod] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  // Use ref to track if a generation is in flight (more reliable than state for fast clicks)
  const isGeneratingRef = useRef(false);

  const handleGenerate = async () => {
    // Guard: prevent duplicate calls using ref (faster than state updates)
    if (isGeneratingRef.current || isGenerating) {
      console.log("Generation already in progress, ignoring duplicate call");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a theme description");
      return;
    }

    // Set both ref and state to prevent any duplicate calls
    isGeneratingRef.current = true;
    setIsGenerating(true);
    setError(null);
    setWarning(null);
    setFeedback(null);
    setGenerationMethod(null);
    setAiResponse(null);
    setGenerationStage("analyzing");

    try {
      // Simulate progress stages
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGenerationStage("designing");

      await new Promise((resolve) => setTimeout(resolve, 500));
      setGenerationStage("generating");

      // Call the API helper
      const result: ThemeGenerationResult = await generateTheme(description);

      setGenerationStage("applying");
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Apply the theme
      applyTheme(result.theme);

      // Set feedback based on result
      setGenerationMethod(result.metadata.method);
      setAiResponse(result.metadata.aiResponse || null);
      
      // Show AI error as a warning if present, but still show success since fallback worked
      if (result.metadata.aiError) {
        setWarning(result.metadata.message || "AI generation failed, used fallback");
      } else {
        setFeedback(result.metadata.message || "Theme generated successfully");
      }

      setGenerationStage("done");
      setTimeout(() => setGenerationStage("idle"), 3000);
    } catch (err) {
      console.error("Theme generation error:", err);
      // Don't show error for aborted requests (user-initiated cancel)
      if (err instanceof Error && err.name === 'AbortError') {
        console.log("Request was cancelled");
      } else {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setGenerationStage("error");
        setTimeout(() => setGenerationStage("idle"), 3000);
      }
    } finally {
      // Always reset the generating flags
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  const handleReset = () => {
    resetTheme();
    setDescription("");
    setError(null);
    setWarning(null);
    setFeedback(null);
    setGenerationMethod(null);
    setAiResponse(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border border-cyan-400/30 rounded-lg bg-surface/50 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">
        AI Theme Shaper
      </h2>

      <p className="text-sm text-muted mb-4">
        Describe your desired theme and let AI generate it for you.
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
            placeholder="e.g., 'light theme with blue and orange' or 'dark cyberpunk with neon purple'"
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
            </div>
          </div>
        )}

        {/* Generation Method Feedback */}
        {generationMethod && !error && !warning && (
          <div className="p-3 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 text-sm">
            <div className="font-medium mb-1">Method: {generationMethod}</div>
            {feedback && <div className="text-xs text-muted">{feedback}</div>}
            {aiResponse && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer hover:text-cyan-300">
                  🤖 View AI Response
                </summary>
                <pre className="mt-2 text-xs bg-background/50 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                  {aiResponse}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Warning Message (AI failed but fallback worked) */}
        {warning && (
          <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded text-amber-400 text-sm">
            <div className="font-medium mb-1">⚠️ {generationMethod || "Fallback Used"}</div>
            <div className="text-xs mt-1">{warning}</div>
            {aiResponse && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer hover:text-amber-300">
                  🤖 View AI Response (before fallback)
                </summary>
                <pre className="mt-2 text-xs bg-background/50 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                  {aiResponse}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Error Message (Complete failure) */}
        {error && (
          <div className="p-3 bg-pink-400/10 border border-pink-400/30 rounded text-pink-400 text-sm">
            <div className="font-medium mb-1">❌ Error</div>
            <div className="text-xs mt-1">{error}</div>
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
            <span className="text-cyan-400">Custom theme active</span>
          ) : (
            <span>Using default CRT/EGA theme</span>
          )}
        </div>
      </div>
    </div>
  );
}
