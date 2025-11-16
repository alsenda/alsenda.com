// This route now acts as a compatibility download endpoint if a jobId is passed.
import JSZip from 'jszip';
import generateFiles from '../../../../src/lib/builder/fileTemplates';
import type { AppConfig } from '../../../../src/lib/builder/types';
import { Readable } from 'stream';
import { getJob, createJob, removeJob } from '../../../../src/lib/zipJobs';
import { v4 as uuidv4 } from 'uuid';

// Simple runtime validation
function isValidConfig(obj: any): obj is AppConfig {
  const frontends = ['next', 'sveltekit', 'react-native'];
  const data = ['rest', 'graphql', 'trpc', 'none'];
  const db = ['postgres', 'redis', 'firebase', 'local-only'];
  const auth = ['clerk', 'auth0', 'nextauth', 'none'];
  const deploy = ['vercel', 'fly', 'docker-vps'];
  return obj && frontends.includes(obj.frontend) && data.includes(obj.dataLayer) && db.includes(obj.database) && auth.includes(obj.auth) && deploy.includes(obj.deploy);
}

// In-memory rate limiter per IP
const rateMap = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const LIMIT = 10; // max in window

function checkRate(ip: string) {
  const now = Date.now();
  const rec = rateMap.get(ip) || { count: 0, windowStart: now };
  if (now - rec.windowStart > WINDOW_MS) {
    rec.count = 0; rec.windowStart = now;
  }
  rec.count += 1;
  rateMap.set(ip, rec);
  return rec.count <= LIMIT;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (!checkRate(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    // If caller provided jobId, treat as download request for that job
    if (body?.jobId) {
      const jobId = String(body.jobId);
      const job = getJob(jobId);
      if (!job) {
        return new Response(JSON.stringify({ error: 'Job not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      const files = generateFiles(job.cfg);
      const zip = new JSZip();
      const entries = Object.entries(files);
      entries.forEach(([path, content], idx) => {
        zip.file(path, content);
        const pct = Math.round(((idx + 1) / entries.length) * 80);
        try { job.emitter.emit('progress', { pct, file: path }); } catch (_) {}
      });

      // generate a Node Readable stream and convert to Web ReadableStream
      const nodeStream = zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });
      const webStream = Readable.toWeb(nodeStream as any) as unknown as ReadableStream;

      // Emit final progress when stream ends
      nodeStream.on('end', () => {
        try { job.emitter.emit('progress', { pct: 100 }); } catch (_) {}
        removeJob(jobId);
      });

      const filename = (files['package.json'] && JSON.parse(files['package.json']).name) || 'app';
      return new Response(webStream, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}.zip"`,
          'X-Job-Id': jobId,
        },
      });
    }

    // Otherwise treat as init: validate config and create a job
    const cfg = body as AppConfig;
    if (!isValidConfig(cfg)) {
      return new Response(JSON.stringify({ error: 'Invalid AppConfig' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const jobId = uuidv4();
    createJob(jobId, cfg);
    return new Response(JSON.stringify({ jobId }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
