import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-10">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
        <p className="mb-4" style={{ color: 'var(--muted)' }}>The page you are looking for doesn't exist.</p>
        <Link to="/" className="rounded-lg border px-4 py-2" style={{ borderColor: 'var(--border)' }}>Go home</Link>
      </div>
    </div>
  );
}




