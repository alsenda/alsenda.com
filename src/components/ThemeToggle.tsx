'use client';

import { useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '@/lib/theme';

type ThemeOption = {
  name: string;
  value: string;
};

const presetThemes: ThemeOption[] = [
  { name: 'EGA', value: 'ega' },
  { name: 'CRT', value: 'crt-green' },
  { name: 'TRON', value: 'tron' },
  { name: 'LIGHT', value: 'light' },
];

export default function ThemeToggle() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hasCustomTheme, setHasCustomTheme] = useState(false);
  const [themes, setThemes] = useState<ThemeOption[]>(presetThemes);

  useEffect(() => {
    setMounted(true);
    const customTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const hasCustom = !!customTheme;
    setHasCustomTheme(hasCustom);
    const themeList: ThemeOption[] = hasCustom 
      ? [...presetThemes, { name: 'CUSTOM', value: 'custom' }]
      : [...presetThemes];
    setThemes(themeList);
    const saved = localStorage.getItem('alsenda-theme');
    if (saved) {
      const index = themeList.findIndex(t => t.value === saved);
      if (index !== -1) {
        setCurrentThemeIndex(index);
        document.documentElement.setAttribute('data-theme', saved);
      }
    }
  }, []);

  useEffect(() => {
    const checkCustomTheme = () => {
      const customTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const hasCustom = !!customTheme;
      if (hasCustom !== hasCustomTheme) {
        setHasCustomTheme(hasCustom);
        const themeList: ThemeOption[] = hasCustom 
          ? [...presetThemes, { name: 'CUSTOM', value: 'custom' }]
          : [...presetThemes];
        setThemes(themeList);
      }
    };
    const interval = setInterval(checkCustomTheme, 1000);
    window.addEventListener('storage', checkCustomTheme);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkCustomTheme);
    };
  }, [hasCustomTheme]);

  const cycleTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setCurrentThemeIndex(nextIndex);
    if (nextTheme.value !== 'custom') {
      document.documentElement.setAttribute('data-theme', nextTheme.value);
    }
    try {
      localStorage.setItem('alsenda-theme', nextTheme.value);
    } catch(e) {}
    try {
      document.cookie = `alsenda-theme=${nextTheme.value}; path=/; max-age=31536000; SameSite=Lax`;
    } catch(e) {}
    if (nextTheme.value === 'custom') {
      window.location.reload();
    }
  };

  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Switch theme" disabled>
        {presetThemes[0].name}
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
