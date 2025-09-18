import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../store/auth';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          setLoading(true); setError(null);
          await register(email, password);
          navigate('/onboarding');
        } catch (err: any) {
          setError(err?.message || 'Registration failed');
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <label className="mb-1 block text-xs text-[#A7BBC2]">Name</label>
        <Input placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-xs text-[#A7BBC2]">Email</label>
        <Input placeholder="you@example.com" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-xs text-[#A7BBC2]">Password</label>
        <Input placeholder="••••••••" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
      </div>
      {error && <div className="text-sm" style={{ color: 'var(--danger)' }}>{error}</div>}
      <Button type="submit" className="w-full rounded-xl py-3 text-sm font-semibold" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
      <div className="text-center text-xs text-[#A7BBC2]">
        Already have an account? <Link to="/auth/login" className="hover:text-primary">Login</Link>
      </div>
    </form>
  );
}

