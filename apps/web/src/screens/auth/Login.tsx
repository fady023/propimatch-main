import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../store/auth';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          setLoading(true); setError(null);
          await login(email, password);
          navigate('/chat');
        } catch (err: any) {
          setError(err?.message || 'Login failed');
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <label className="mb-1 block text-xs text-[#A7BBC2]">Email</label>
        <Input placeholder="you@example.com" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-xs text-[#A7BBC2]">Password</label>
        <Input placeholder="••••••••" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
      </div>
      {error && <div className="text-sm" style={{ color: 'var(--danger)' }}>{error}</div>}
      <Button type="submit" className="w-full rounded-xl py-3 text-sm font-semibold" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</Button>
      <div className="flex justify-between text-xs text-[#A7BBC2]">
        <Link to="/auth/forgot" className="hover:text-primary">Forgot password?</Link>
        <Link to="/auth/register" className="hover:text-primary">Create account</Link>
      </div>
    </form>
  );
}

