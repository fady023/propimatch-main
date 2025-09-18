import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="container mx-auto grid min-h-[70vh] place-items-center py-10">
      <div className="w-full max-w-md rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-lg font-semibold">Propimatch</span>
        </div>
        <Outlet />
        <div className="mt-6 text-center text-xs" style={{ color: 'var(--muted)' }}>
          <Link to="/onboarding" className="hover:text-primary">Back to onboarding</Link>
        </div>
      </div>
    </div>
  );
}

