import { EventEmitter } from 'events';
import type { AppConfig } from './builder/types';

type Job = {
  id: string;
  cfg: AppConfig;
  emitter: EventEmitter;
  createdAt: number;
};

const jobs = new Map<string, Job>();

export function createJob(id: string, cfg: AppConfig) {
  const job: Job = { id, cfg, emitter: new EventEmitter(), createdAt: Date.now() };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string) {
  return jobs.get(id);
}

export function removeJob(id: string) {
  const j = jobs.get(id);
  if (j) {
    try { j.emitter.removeAllListeners(); } catch (_) {}
  }
  return jobs.delete(id);
}

export default { createJob, getJob, removeJob };
