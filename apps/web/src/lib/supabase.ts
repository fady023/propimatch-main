import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env ?? {};
const url = env.VITE_SUPABASE_URL as string | undefined;
const anon = env.VITE_SUPABASE_ANON_KEY as string | undefined;
const disable = env.VITE_AUTH_MODE === 'mock' || env.VITE_DISABLE_SUPABASE === '1';

function isValidHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export const supabase = !disable && isValidHttpUrl(url) && !!anon
  ? createClient(url as string, anon as string)
  : null as any;

if (disable) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] Disabled via VITE_AUTH_MODE=mock or VITE_DISABLE_SUPABASE=1. Using local mock auth.');
} else if (!supabase) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing or invalid VITE_SUPABASE_URL/ANON_KEY. Using local mock auth.');
}

export default supabase;



