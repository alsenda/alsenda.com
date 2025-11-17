import type { ThemeTokens } from "@/lib/theme";

export async function generateTheme(description: string): Promise<ThemeTokens> {
  const res = await fetch("/api/theme-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) {
    throw new Error(`Failed to generate theme: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!data?.colors?.background) {
    throw new Error("Invalid theme data received from API");
  }
  return data as ThemeTokens;
}
