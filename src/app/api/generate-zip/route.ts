import type { NextRequest } from 'next/server';
import JSZip from 'jszip';
import generateFiles from '../../../../src/lib/builder/fileTemplates';
import type { AppConfig } from '../../../../src/lib/builder/types';
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    const cfg = (await req.json()) as AppConfig;
    const files = generateFiles(cfg);

    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => zip.file(path, content));

    // generate a Node Readable stream and convert to Web ReadableStream
    const nodeStream = zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });
    const webStream = Readable.toWeb(nodeStream as any) as unknown as ReadableStream;

    const filename = (files['package.json'] && JSON.parse(files['package.json']).name) || 'app';

    return new Response(webStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}.zip"`,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
