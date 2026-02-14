'use client';

import { useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '@/lib/theme';
import { useTheme } from '@/components/ThemeProvider';

type ThemeOption = {
  name: string;
  value: string;
};

const presetThemes: ThemeOption[] = [
  { name: 'NEO', value: 'neo' },
  { name: 'EGA', value: 'ega' },
  { name: 'CRT', value: 'crt-green' },
  { name: 'TRON', value: 'tron' },
  { name: 'LIGHT', value: 'light' },
];

export default function ThemeToggle() {
  const { setPresetTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('neo');
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
      const exists = themeList.some(t => t.value === saved);
      if (exists) {
        setCurrentTheme(saved);
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

  const selectTheme = (value: string) => {
    setCurrentTheme(value);
    if (value === 'custom') {
      try {
        localStorage.setItem('alsenda-theme', value);
      } catch(e) {}
      try {
        document.cookie = `alsenda-theme=${value}; path=/; max-age=31536000; SameSite=Lax`;
      } catch(e) {}
      window.location.reload();
      return;
    }

    setPresetTheme(value);
  };

  if (!mounted) {
    return (
      <select className="theme-toggle" aria-label="Select theme" disabled value="neo">
        <option value="neo">NEO</option>
      </select>
    );
  }

  return (
    <select
      className="theme-toggle" 
      value={currentTheme}
      onChange={(e) => selectTheme(e.target.value)}
      aria-label="Select theme"
      title="Theme"
    >
      {themes.map((theme) => (
        <option key={theme.value} value={theme.value}>
          {theme.name}
        </option>
      ))}
    </select>
  );
}
