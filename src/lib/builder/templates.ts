import { AppConfig } from './types';

export function frontendSnippet(cfg: AppConfig): string {
  switch (cfg.frontend) {
    case 'next':
      return 'Next.js (React) with Server Components: good for SEO, full-stack rendering, and great DX.';
    case 'sveltekit':
      return 'SvelteKit: lightweight runtime, excellent bundle sizes, and very ergonomic reactivity.';
    case 'react-native':
      return 'React Native: for mobile-first apps; not web-first. Requires native build tooling.';
  }
}

export function dataLayerSnippet(cfg: AppConfig): string {
  switch (cfg.dataLayer) {
    case 'rest':
      return 'REST: simple HTTP APIs, maximum compatibility, straightforward caching.';
    case 'graphql':
      return 'GraphQL: flexible queries and single endpoint; adds complexity and caching considerations.';
    case 'trpc':
      return 'tRPC: typesafe RPC between client and server when using TypeScript end-to-end.';
    case 'none':
      return 'No backend: static or client-only, useful for prototypes and low-complexity apps.';
  }
}

export function databaseSnippet(cfg: AppConfig): string {
  switch (cfg.database) {
    case 'postgres':
      return 'Postgres: relational, ACID, good for structured data and complex queries.';
    case 'redis':
      return 'Redis: in-memory store, great for caching, pub/sub and real-time workloads.';
    case 'firebase':
      return 'Firebase: managed BaaS with realtime DB and auth; fast to bootstrap.';
    case 'local-only':
      return 'Local-only: store in browser or local files — for demos and prototypes.';
  }
}

export function authSnippet(cfg: AppConfig): string {
  switch (cfg.auth) {
    case 'clerk':
      return 'Clerk: modern auth provider with SDKs and strong UX for sign-in flows.';
    case 'auth0':
      return 'Auth0: mature identity platform with many integration options.';
    case 'nextauth':
      return 'NextAuth: open-source and flexible for Next.js apps.';
    case 'none':
      return 'No auth: public apps or prototype mode.';
  }
}

export function deploySnippet(cfg: AppConfig): string {
  switch (cfg.deploy) {
    case 'vercel':
      return 'Vercel: optimized for Next.js with great CI/CD and serverless functions.';
    case 'fly':
      return 'Fly.io: run full machines close to users, good for low-latency regional deployments.';
    case 'docker-vps':
      return 'Docker on VPS: most control; requires provisioning and ops knowledge.';
  }
}

export function baseFolderTree(cfg: AppConfig): string[] {
  const common = [
    'src/',
    'src/components/',
    'src/pages/',
    'public/',
    'package.json',
    'README.md',
  ];
  // simple, composable additions
  if (cfg.frontend === 'next') {
    common.push('src/app/', 'next.config.ts');
  }
  if (cfg.dataLayer === 'trpc') common.push('src/server/trpc/');
  if (cfg.dataLayer === 'graphql') common.push('src/server/graphql/');
  if (cfg.database === 'postgres') common.push('prisma/schema.prisma');
  if (cfg.database === 'redis') common.push('src/lib/redis.ts');
  if (cfg.auth !== 'none') common.push('src/lib/auth.ts');
  return common;
}
