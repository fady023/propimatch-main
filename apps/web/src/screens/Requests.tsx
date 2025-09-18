import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card } from '../components/ui';

export function Requests() {
  const [tab, setTab] = useState<'all'|'buy'|'rent'>('all');
  const [reqs, setReqs] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STORAGE_KEY = 'propimatch:requests:active:v1';
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(activeMap)); } catch {} }, [activeMap]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [r, l] = await Promise.all([api.getRequests(), api.getListings()]);
        if (!cancelled) { setReqs(r as any[]); setLists(l as any[]); }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const withMatchCounts = useMemo(() => {
    return reqs.map((r) => {
      const matches = lists.filter((l) => (r.type === 'buy' ? l.type === 'sale' : l.type === 'rent') && (l.location||'').toLowerCase().includes((r.location||'').toLowerCase())).length;
      return { req: r, matches };
    });
  }, [reqs, lists]);

  const filtered = useMemo(() => withMatchCounts.filter(({ req }) => tab === 'all' ? true : req.type === tab), [withMatchCounts, tab]);

  return (
    <div className="container space-y-3 py-4">
      {loading && <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading…</div>}
      {error && <div className="text-sm" style={{ color: 'var(--danger)' }}>{error}</div>}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Requests</h2>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          <button className={`rounded-full px-3 py-1 ${tab==='all'?'border':''}`} style={{ borderColor: 'var(--primary)' }} onClick={()=>setTab('all')}>All</button>
          <button className={`rounded-full px-3 py-1 ${tab==='buy'?'border':''}`} style={{ borderColor: 'var(--primary)' }} onClick={()=>setTab('buy')}>Buy</button>
          <button className={`rounded-full px-3 py-1 ${tab==='rent'?'border':''}`} style={{ borderColor: 'var(--primary)' }} onClick={()=>setTab('rent')}>Rent</button>
        </div>
      </div>
      <div className="grid gap-3">
        {filtered.map(({ req: r, matches }) => (
          <Card key={r.id} className="p-4 hover:border-primary">
            <div className="flex items-center justify-between">
              <Link to={`/requests/${r.id}`} className="min-w-0 flex-1">
                <div className="text-sm truncate">{r.type.toUpperCase()} • {r.location}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Created {new Date(r.createdAt).toLocaleDateString()} • Matches: {matches}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Budget: {r.budget.toLocaleString('en-AE', { style: 'currency', currency: 'AED' })}</div>
              </Link>
              <div className="ml-3 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="rounded-lg px-3 py-1 text-[10px] font-semibold tracking-wide" style={{ background: 'var(--primary)', color: '#fff' }} aria-label={`${matches} matches`}>
                  {matches} MATCHES
                </div>
                <div className="mt-2 flex items-center justify-end gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                  <span>{activeMap[r.id] !== false ? 'Active' : 'Inactive'}</span>
                  <label className="relative inline-flex cursor-pointer items-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={activeMap[r.id] !== false} onChange={(e) => { setActiveMap((m) => ({ ...m, [r.id]: e.target.checked })); }} className="peer sr-only" />
                    <div className="peer h-5 w-9 rounded-full bg-[color:var(--border)] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[color:var(--primary)] peer-checked:after:translate-x-4" />
                  </label>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

