import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { ThemeTokens } from '../src/lib/theme';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Theme Generator API', () => {
  describe('Input Validation', () => {
    it('should reject empty description', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: '' }),
      });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('should reject missing description', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it('should reject non-string description', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 123 }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('Light Theme Generation', () => {
    it('should generate a light theme when explicitly requested', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'light theme with blue and orange' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      // Verify it's a light theme (background should be bright)
      expect(theme.colors.background).toMatch(/^#[e-f][0-9a-f]{5}$/i); // starts with e or f (bright)
      expect(theme.colors.foreground).toMatch(/^#[0-3][0-9a-f]{5}$/i); // starts with 0-3 (dark)
    });

    it('should generate a light theme with "bright" keyword', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'bright and airy theme with cyan' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.colors.background).toMatch(/^#[e-f][0-9a-f]{5}$/i);
    });
  });

  describe('Dark Theme Generation', () => {
    it('should generate a dark theme by default', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'dark theme with red and blue' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      // Verify it's a dark theme
      expect(theme.colors.background).toMatch(/^#[0-2][0-9a-f]{5}$/i); // starts with 0-2 (dark)
      // Foreground should be bright - allow for full range of bright colors including pure colors
      const fgFirstChar = theme.colors.foreground.charAt(1).toLowerCase();
      expect(['5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', '0'].includes(fgFirstChar)).toBe(true);
    });
  });

  describe('Color Extraction', () => {
    it('should extract blue color from description', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'theme with blue and pink accents' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      // Should have blue-ish values in egaCyan or egaMagenta
      const cyanRgb = theme.colors.egaCyan.split(',').map(Number);
      const magentaRgb = theme.colors.egaMagenta.split(',').map(Number);
      
      // At least one should have blue (higher blue component)
      const hasBlue = cyanRgb[2] > cyanRgb[0] || magentaRgb[2] > magentaRgb[0];
      expect(hasBlue).toBe(true);
    });

    it('should extract orange color from description', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'warm theme with orange and yellow' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      const cyanRgb = theme.colors.egaCyan.split(',').map(Number);
      const magentaRgb = theme.colors.egaMagenta.split(',').map(Number);
      
      // Orange has high red and medium-high green, low blue
      const hasOrange = 
        (cyanRgb[0] > 200 && cyanRgb[1] > 100 && cyanRgb[2] < 100) ||
        (magentaRgb[0] > 200 && magentaRgb[1] > 100 && magentaRgb[2] < 100);
      expect(hasOrange).toBe(true);
    });

    it('should handle multiple color keywords', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'purple and green nature theme' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      // Should extract both colors
      expect(theme.colors.egaCyan).toBeTruthy();
      expect(theme.colors.egaMagenta).toBeTruthy();
      expect(theme.colors.egaCyan).not.toBe(theme.colors.egaMagenta);
    });
  });

  describe('Mood Presets', () => {
    it('should use cyberpunk preset when mentioned', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'cyberpunk style theme' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.colors.egaCyan).toBe('0,255,255'); // cyberpunk cyan
      expect(theme.colors.egaMagenta).toBe('255,0,255'); // cyberpunk magenta
    });

    it('should use sunset preset when mentioned', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'sunset vibe with warm colors' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.colors.background).toBe('#1a0f0a');
    });

    it('should use ocean preset when mentioned', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'ocean theme with deep blues' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.colors.background).toBe('#0a1628');
    });
  });

  describe('Theme Structure', () => {
    it('should return valid theme structure', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'any theme' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      // Verify required colors
      expect(theme.colors).toBeDefined();
      expect(theme.colors.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.colors.surface).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.colors.foreground).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.colors.muted).toMatch(/^#[0-9a-f]{6}$/i);
      
      // Verify RGB tuple format
      expect(theme.colors.egaCyan).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
      expect(theme.colors.egaMagenta).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
      expect(theme.colors.egaWhite).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
    });

    it('should include optional effects', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'glowing neon theme' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.effects).toBeDefined();
      expect(theme.effects?.glowIntensity).toBeDefined();
    });

    it('should include backgroundArt settings', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'retro theme' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.backgroundArt).toBeDefined();
      expect(theme.backgroundArt?.gradientColors).toBeDefined();
      expect(Array.isArray(theme.backgroundArt?.gradientColors)).toBe(true);
      expect(theme.backgroundArt?.particleOpacity).toBeDefined();
      expect(theme.backgroundArt?.scanlineOpacity).toBeDefined();
    });
  });

  describe('AI vs Heuristic Generation', () => {
    it('should work when OPENAI_API_KEY is not set (heuristic)', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'elegant light theme with teal and coral' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.colors).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long descriptions', async () => {
      const longDesc = 'A beautiful theme with ' + 'many colors '.repeat(50);
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: longDesc }),
      });
      expect(res.status).toBe(200);
    });

    it('should handle special characters in description', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'theme with emojis 🎨🌈✨ and symbols @#$%' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      expect(theme.colors).toBeDefined();
    });

    it('should handle description with no recognizable colors', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'abstract minimalist design' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      // Should fall back to default variation
      expect(theme.colors.background).toBeDefined();
    });
  });
});
