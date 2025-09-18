import { useSyncExternalStore } from 'react';
import supabase from '../lib/supabase';

interface AuthState { isAuthenticated: boolean; userName?: string; email?: string; }

const KEY = 'pm:auth';
let state: AuthState = { isAuthenticated: false };
try {
  const raw = localStorage.getItem(KEY);
  state = raw ? JSON.parse(raw) : state;
} catch {}

const listeners = new Set<() => void>();
function emit() { for (const l of listeners) l(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

export function useAuth() {
  const snapshot = useSyncExternalStore(
    (sub) => { listeners.add(sub); return () => listeners.delete(sub); },
    () => state
  );
  const login = async (email: string, password: string) => {
    if (!supabase) { state = { isAuthenticated: true, email }; save(); emit(); return; }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    state = { isAuthenticated: true, email: data.user?.email ?? email, userName: data.user?.email ?? email };
    save(); emit();
  };
  const register = async (email: string, password: string) => {
    if (!supabase) return;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };
  const reset = async (email: string, redirectTo?: string) => {
    if (!supabase) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  };
  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    state = { isAuthenticated: false }; save(); emit();
  };
  return { ...snapshot, login, register, reset, logout };
}

