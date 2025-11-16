#!/usr/bin/env node
const WebSocket = require('ws');
const Redis = require('ioredis');

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT, 10) : 4001;
const REDIS_URL = process.env.REDIS_URL || null;

const wss = new WebSocket.Server({ port: PORT });
console.log(`WebSocket server listening on ws://0.0.0.0:${PORT}`);

let sub = null;
if (REDIS_URL) {
  try {
    sub = new Redis(REDIS_URL);
    sub.subscribe('chat:channel', (err, count) => {
      if (err) console.error('Redis subscribe error', err);
      else console.log('Subscribed to chat:channel');
    });
    sub.on('message', (channel, message) => {
      // broadcast to all connected clients
      const payload = message;
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    });
  } catch (e) {
    console.error('Failed to connect to Redis for pubsub', e);
  }
} else {
  console.warn('REDIS_URL not set; WebSocket server will not receive published messages.');
}

wss.on('connection', (ws, req) => {
  console.log('client connected');
  ws.on('close', () => console.log('client disconnected'));
  ws.on('error', (err) => console.error('ws error', err));
});
