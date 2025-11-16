import { describe, it, expect } from 'vitest';
import { POST } from '../src/app/api/generate-zip/route';
import JSZip from 'jszip';

describe('generate-zip API', () => {
  it('creates a job and returns a non-empty zip for default config', async () => {
    const cfg = {
      frontend: 'next',
      dataLayer: 'rest',
      database: 'local-only',
      auth: 'none',
      deploy: 'vercel',
    };

    // init job
    const initReq = new Request('http://localhost/api/generate-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    });
    const initRes = await POST(initReq as any);
    expect(initRes.status).toBe(200);
    const body = JSON.parse(await initRes.text());
    expect(body.jobId).toBeTruthy();
    const jobId = body.jobId;

    // download zip for job
    const dlReq = new Request('http://localhost/api/generate-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    });
    const dlRes = await POST(dlReq as any);
    expect(dlRes).toBeDefined();
    const ct = dlRes.headers?.get('Content-Type');
    expect(ct).toMatch(/zip/);

    const ab = await dlRes.arrayBuffer();
    expect(ab.byteLength).toBeGreaterThan(0);

    // extract zip and verify files
    const zip = await JSZip.loadAsync(ab);
    const expected = ['package.json', 'app/page.tsx', 'app/layout.tsx'];
    for (const name of expected) {
      const file = zip.file(name);
      expect(file).toBeTruthy();
    }
  });
});
