import { AppConfig } from './types';

export function frontendSnippet(cfg: AppConfig): string {
  switch (cfg.frontend) {
    case 'next':
      return `Next.js (React) with Server Components

Pros:
- Built-in server rendering and streaming via RSC, excellent for SEO.
- Great developer experience, rich ecosystem and Vercel optimizations.

Cons:
- Can be heavier than purely client SPA approaches; learning curve around RSC boundaries.`;
    case 'sveltekit':
      return `SvelteKit

Pros:
- Extremely small runtime and fast client bundles.
- Very ergonomic reactivity model for UI logic.

Cons:
- Smaller ecosystem than React; migration and community libs may be less plentiful.`;
    case 'react-native':
      return `React Native (mobile)

Pros:
- Native mobile UX and performance; single codebase for iOS/Android.

Cons:
- Not web-first; requires native toolchains and different deployment targets.`;
  }
}

export function dataLayerSnippet(cfg: AppConfig): string {
  switch (cfg.dataLayer) {
    case 'rest':
      return `REST

Pros:
- Simple, well-understood, great caching and tooling.

Cons:
- Can require multiple endpoints and overfetching if not designed carefully.`;
    case 'graphql':
      return `GraphQL

Pros:
- Flexible queries and strong client control over payloads.

Cons:
- Added complexity (schema, resolvers, caching, and tooling).`;
    case 'trpc':
      return `tRPC

Pros:
- Fully type-safe end-to-end in TypeScript, minimal boilerplate.

Cons:
- Tied to TypeScript; more coupling between client and server (which can be a pro for some teams).`;
    case 'none':
      return `No backend

Pros:
- Fast iteration and deployment; great for demos and front-end only apps.

Cons:
- Limited persistence and multi-user features without external services.`;
  }
}

export function databaseSnippet(cfg: AppConfig): string {
  switch (cfg.database) {
    case 'postgres':
      return `Postgres

Pros:
- ACID, relational queries, strong consistency and tooling.

Cons:
- Requires migrations and more ops work than managed BaaS.`;
    case 'redis':
      return `Redis

Pros:
- Extremely fast in-memory operations, excellent for caches and real-time primitives.

Cons:
- Data persistence model differs from relational DBs; not always suitable as the primary store.`;
    case 'firebase':
      return `Firebase

Pros:
- Managed realtime database, auth, and storage; quick to prototype.

Cons:
- Vendor lock-in risks and pricing considerations at scale.`;
    case 'local-only':
      return `Local-only

Pros:
- Zero infra; ideal for demos and single-user prototypes.

Cons:
- Not suited for multi-user production apps.`;
  }
}

export function authSnippet(cfg: AppConfig): string {
  switch (cfg.auth) {
    case 'clerk':
      return `Clerk

Pros:
- Opinionated SDKs and UX for quick integration.

Cons:
- External dependency and cost for some features.`;
    case 'auth0':
      return `Auth0

Pros:
- Mature, feature-rich identity platform.

Cons:
- Can be heavy and complex for small projects.`;
    case 'nextauth':
      return `NextAuth

Pros:
- Open-source, flexible and integrates well with Next.js.

Cons:
- Requires some configuration for providers and database sessions.`;
    case 'none':
      return `No auth

Pros:
- Zero friction to ship a public app quickly.

Cons:
- No user-specific data or private features.`;
  }
}

export function deploySnippet(cfg: AppConfig): string {
  switch (cfg.deploy) {
    case 'vercel':
      return `Vercel

Pros:
- First-class for Next.js deployments with serverless functions and preview deployments.

Cons:
- Serverless costs and cold-start considerations for some workloads.`;
    case 'fly':
      return `Fly.io

Pros:
- Run machines close to users; good for low-latency global apps.

Cons:
- More ops knowledge required than pure serverless hosting.`;
    case 'docker-vps':
      return `Docker on VPS

Pros:
- Maximum control and portability.

Cons:
- Requires ops work: provisioning, monitoring, and scaling.`;
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
