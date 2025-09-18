import React, { useState } from 'react';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../store/auth';

export function Forgot() {
  const { reset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [sent, setSent] = useState(false);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          setLoading(true); setError(null);
          await reset(email, window.location.origin + '/auth/login');
          setSent(true);
        } catch (err: any) {
          setError(err?.message || 'Failed to send reset link');
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <label className="mb-1 block text-xs text-[#A7BBC2]">Email</label>
        <Input placeholder="you@example.com" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </div>
      {error && <div className="text-sm" style={{ color: 'var(--danger)' }}>{error}</div>}
      {sent && !error && <div className="text-sm" style={{ color: 'var(--success)' }}>Reset link sent. Check your email.</div>}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</Button>
    </form>
  );
}

