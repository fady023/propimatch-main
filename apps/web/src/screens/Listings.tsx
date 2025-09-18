import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card } from '../components/ui';

export function Listings() {
  const [tab, setTab] = useState<'all'|'sale'|'rent'>('all');
  const [lists, setLists] = useState<any[]>([]);
  const [reqs, setReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const STORAGE_KEY = 'propimatch:listings:active:v1';
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(activeMap)); } catch {} }, [activeMap]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [l, r] = await Promise.all([api.getListings(), api.getRequests()]);
        if (!cancelled) { setLists(l as any[]); setReqs(r as any[]); }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const withMatches = useMemo(() => {
    return lists.map(l => {
      const wantType = l.type === 'sale' ? 'buy' : 'rent';
      const matches = reqs.filter(r => r.type === wantType && (l.location||'').toLowerCase().includes((r.location||'').toLowerCase())).length;
      return { listing: l, matches };
    });
  }, [lists, reqs]);

  const filtered = useMemo(() => withMatches.filter(({ listing: l }) => tab==='all' ? true : l.type === tab), [withMatches, tab]);

  return (
    <div className="container space-y-3 py-4">
      {loading && <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading…</div>}
      {error && <div className="text-sm" style={{ color: 'var(--danger)' }}>{error}</div>}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Listings</h2>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          <button className={`rounded-full px-3 py-1 ${tab==='all'?'border':''}`} style={{ borderColor: 'var(--primary)' }} onClick={()=>setTab('all')}>All</button>
          <button className={`rounded-full px-3 py-1 ${tab==='sale'?'border':''}`} style={{ borderColor: 'var(--primary)' }} onClick={()=>setTab('sale')}>Sale</button>
          <button className={`rounded-full px-3 py-1 ${tab==='rent'?'border':''}`} style={{ borderColor: 'var(--primary)' }} onClick={()=>setTab('rent')}>Rent</button>
        </div>
      </div>
      <div className="grid gap-3">
        {filtered.map(({ listing: l, matches }) => (
          <Card key={l.id} className="flex items-center gap-3 p-3 hover:border-primary">
            <img src={l.images[0]} alt={l.title} className="h-16 w-20 rounded-lg object-cover" />
            <Link to={`/property/${l.id}`} state={{ fromListings: true }} className="flex-1 min-w-0">
              <div className="text-sm truncate">{l.title}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{l.location} • {l.bedrooms} BR • {l.areaSqft} sqft</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Created {new Date(l.createdAt).toLocaleDateString?.() || new Date().toLocaleDateString()}</div>
            </Link>
            <div className="text-right" onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 rounded-lg px-3 py-1 text-[10px] font-semibold tracking-wide" style={{ background: 'var(--primary)', color: '#fff' }} aria-label={`${matches} matches`}>
                {matches} MATCHES
              </div>
              <div className="flex items-center justify-end gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                <span>{activeMap[l.id] !== false ? 'Active' : 'Inactive'}</span>
                <label className="relative inline-flex cursor-pointer items-center" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={activeMap[l.id] !== false} onChange={(e) => { setActiveMap((m) => ({ ...m, [l.id]: e.target.checked })); }} className="peer sr-only" />
                  <div className="peer h-5 w-9 rounded-full bg-[color:var(--border)] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[color:var(--primary)] peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

