import { useSyncExternalStore } from 'react';
import api from '../lib/api';

type ActionState = Record<string, { shortlisted?: boolean; discarded?: boolean }>;

const STORAGE_KEY = 'propimatch:listings:actions:v1';
let state: ActionState = {};
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  state = raw ? JSON.parse(raw) : {};
} catch {
  state = {};
}

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function useActions() {
  const snapshot = useSyncExternalStore(
    (sub) => { listeners.add(sub); return () => listeners.delete(sub); },
    () => state
  );

  const set = async (id: string, next: Partial<{ shortlisted: boolean; discarded: boolean }>) => {
    const prev = state[id];
    state[id] = { ...(state[id] ?? {}), ...next };
    if (state[id].shortlisted) state[id].discarded = false;
    if (state[id].discarded) state[id].shortlisted = false;
    save(); emit();
    // optimistic API sync
    try {
      if (next.shortlisted) await api.shortlist(id);
      if (next.discarded) await api.discard(id);
    } catch {
      // revert on failure
      state[id] = prev ?? {} as any; save(); emit();
    }
  };

  return { state: snapshot, set };
}

