'use client';

import { useEffect, useState } from 'react';

const themes = [
  { name: 'EGA', value: 'ega' },
  { name: 'CRT', value: 'crt-green' },
  { name: 'TRON', value: 'tron' },
  // Add more themes here in the future
] as const;

export default function ThemeToggle() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved theme from localStorage
    const saved = localStorage.getItem('alsenda-theme');
    if (saved) {
      const index = themes.findIndex(t => t.value === saved);
      if (index !== -1) {
        setCurrentThemeIndex(index);
        document.documentElement.setAttribute('data-theme', saved);
      }
    }
  }, []);

  const cycleTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    setCurrentThemeIndex(nextIndex);
    document.documentElement.setAttribute('data-theme', nextTheme.value);
    try {
      localStorage.setItem('alsenda-theme', nextTheme.value);
    } catch(e) {}
    try {
      // Persist to cookie for potential SSR usage or future edge logic
      document.cookie = `alsenda-theme=${nextTheme.value}; path=/; max-age=31536000; SameSite=Lax`;
    } catch(e) {}
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button 
        className="theme-toggle" 
        aria-label="Switch theme"
        disabled
      >
        {themes[0].name}
      </button>
    );
  }

  return (
    <button 
      className="theme-toggle" 
      onClick={cycleTheme}
      aria-label={`Switch theme (current: ${themes[currentThemeIndex].name})`}
      title="Click to switch theme"
    >
      {themes[currentThemeIndex].name}
    </button>
  );
}
