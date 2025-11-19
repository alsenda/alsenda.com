import { describe, it, expect, vi } from 'vitest';
import type { ThemeTokens } from '../src/lib/theme';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Theme Generator API', () => {
  vi.stubEnv('GOOGLEAI_API_KEY', '');
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

  describe('Theme Structure', () => {
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
    }, 15000);
  });

  describe('AI vs Heuristic Generation', () => {
    it('should work when GOOGLEAI_API_KEY is not set (heuristic)', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'elegant light theme with teal and coral' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      
      expect(theme.colors).toBeDefined();
    }, 15000);

    it('should honor user disabling AI even when key present', async () => {
      // Re-stub key to simulate presence
      vi.stubEnv('GOOGLEAI_API_KEY', 'test-key');
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'cyberpunk neon', useAI: false }),
      });
      expect(res.status).toBe(200);
      const data = await res.json() as {
        metadata?: {
          usedAI: boolean;
          userDisabledAI?: boolean;
        }
      };
      expect(data.metadata).toBeDefined();
      expect(data.metadata?.usedAI).toBe(false);
      expect(data.metadata?.userDisabledAI).toBe(true);
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
    }, 15000);

    it('should handle special characters in description', async () => {
      const res = await fetch(`${API_BASE}/api/theme-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'theme with emojis 🎨🌈✨ and symbols @#$%' }),
      });
      expect(res.status).toBe(200);
      const theme: ThemeTokens = await res.json();
      expect(theme.colors).toBeDefined();
    }, 15000);

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
    }, 15000);
  });
});
