import { AppConfig, GeneratorResult } from './types';
import { frontendSnippet, dataLayerSnippet, databaseSnippet, authSnippet, deploySnippet, baseFolderTree } from './templates';

export function configToProject(cfg: AppConfig): GeneratorResult {
  // Compose a human-readable summary with trade-offs
  const parts: string[] = [];
  parts.push(`Frontend: ${cfg.frontend}`);
  parts.push(frontendSnippet(cfg));
  parts.push(`Data layer: ${cfg.dataLayer}`);
  parts.push(dataLayerSnippet(cfg));
  parts.push(`Database: ${cfg.database}`);
  parts.push(databaseSnippet(cfg));
  parts.push(`Auth: ${cfg.auth}`);
  parts.push(authSnippet(cfg));
  parts.push(`Deployment: ${cfg.deploy}`);
  parts.push(deploySnippet(cfg));

  const summary = parts.join('\n\n');

  // folder tree is built compositionally
  const folderTree = baseFolderTree(cfg);

  return { summary, folderTree };
}

export type { AppConfig, GeneratorResult } from './types';
