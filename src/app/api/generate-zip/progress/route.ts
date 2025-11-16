import { getJob } from '../../../../lib/zipJobs';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');
    if (!jobId) return new Response('Missing jobId', { status: 400 });

    const job = getJob(jobId);
    if (!job) return new Response('Job not found', { status: 404 });

    // Use the global ReadableStream to match Web types in Next's Response
    // @ts-ignore
    const stream = new (globalThis as any).ReadableStream({
      start(controller: any) {
        const onProgress = (payload: any) => {
          const msg = `data: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(new TextEncoder().encode(msg));
        };

        job.emitter.on('progress', onProgress);

        // Keep the connection open; cleanup when closed
        controller.enqueue(new TextEncoder().encode('data: {"status":"connected"}\n\n'));

        // on cancel/close
        return () => {
          try { job.emitter.removeListener('progress', onProgress); } catch (_) {}
        };
      }
    });

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
  } catch (err: any) {
    return new Response(String(err), { status: 500 });
  }
}
