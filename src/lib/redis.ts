import Redis from 'ioredis';

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (client) return client;
  const url = process.env.REDIS_URL || process.env.REDIS_URI;
  if (!url) return null;
  client = new Redis(url);
  client.on('error', (e) => {
    // eslint-disable-next-line no-console
    console.error('Redis error', e && e.message ? e.message : e);
  });
  return client;
}

export default getRedis;
