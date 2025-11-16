import { describe, it, expect } from 'vitest';
import { POST } from '../src/app/api/generate-zip/route';

describe('generate-zip API', () => {
  it('returns a non-empty zip for default config', async () => {
    const cfg = {
      frontend: 'next',
      dataLayer: 'rest',
      database: 'local-only',
      auth: 'none',
      deploy: 'vercel',
    };

    const req = new Request('http://localhost/api/generate-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    });

    const res = await POST(req as any);
    expect(res).toBeDefined();
    // Ensure content-type header is zip
    const ct = res.headers?.get('Content-Type');
    expect(ct).toMatch(/zip/);
    // consume as arrayBuffer and assert non-empty
    const buffer = await (res.arrayBuffer ? res.arrayBuffer() : res.text());
    if (buffer instanceof ArrayBuffer) {
      expect(buffer.byteLength).toBeGreaterThan(0);
    } else {
      // fallback: ensure non-empty text
      expect(String(buffer).length).toBeGreaterThan(0);
    }
  });
});
