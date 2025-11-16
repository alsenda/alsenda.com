export type FrontendFramework = 'next' | 'sveltekit' | 'react-native';
export type DataLayer = 'rest' | 'graphql' | 'trpc' | 'none';
export type Database = 'postgres' | 'redis' | 'firebase' | 'local-only';
export type AuthProvider = 'clerk' | 'auth0' | 'nextauth' | 'none';
export type DeployTarget = 'vercel' | 'fly' | 'docker-vps';

export interface AppConfig {
  frontend: FrontendFramework;
  dataLayer: DataLayer;
  database: Database;
  auth: AuthProvider;
  deploy: DeployTarget;
}

export interface GeneratorResult {
  summary: string;
  folderTree: string[];
}
