import React, { useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { listings, requests } from '@propimatch/data/index.ts';
import { Button, Card, Modal, Input } from '../components/ui';
import { MapView } from '../components/MapView';
import { BackButton } from '../components/BackButton';
import api from '../lib/api';

export function PropertyDetail() {
  const { id } = useParams();
  const location = useLocation();
  const fromRequests = Boolean((location.state as any)?.fromRequests);
  const fromListings = Boolean((location.state as any)?.fromListings);
  const listing = listings.find((l) => l.id === id) ?? listings[0];
  const [open, setOpen] = useState(false);
  const [decisions, setDecisions] = useState<Record<string, 'accepted' | 'rejected' | undefined>>({});
  const [viewDate, setViewDate] = useState('');
  const [viewTime, setViewTime] = useState('');
  const [viewNote, setViewNote] = useState('');

  const wantType = useMemo(() => (listing.type === 'sale' ? 'buy' : 'rent'), [listing.type]);
  const matchedRequests = useMemo(() => {
    const loc = (listing.location || '').toLowerCase();
    return requests.filter(r => r.type === wantType && loc.includes((r.location||'').toLowerCase()));
  }, [listing.location, wantType]);

  function computeMatchScore(r: typeof requests[number]): number {
    let score = 0;
    const wantType = listing.type === 'sale' ? 'buy' : 'rent';
    score += r.type === wantType ? 20 : 0;
    const locA = (listing.location || '').toLowerCase();
    const locB = (r.location || '').toLowerCase();
    if (locB && (locA.includes(locB) || locB.includes(locA))) score += 20; else if (locB) score += 8;
    if (typeof r.bedrooms === 'number') {
      const diff = Math.abs((listing.bedrooms || 0) - r.bedrooms);
      score += Math.max(0, 20 - diff * 7);
    } else {
      score += 10;
    }
    if (typeof r.budget === 'number' && r.budget > 0) {
      if (listing.price <= r.budget) score += 20; else {
        const over = listing.price - r.budget;
        const tolerance = r.budget * 0.5;
        score += Math.max(0, 20 - (over / tolerance) * 20);
      }
    } else {
      score += 10;
    }
    if (Array.isArray(r.amenities) && r.amenities.length) {
      const reqSet = new Set(r.amenities.map(a => a.toLowerCase()));
      const have = (listing.amenities || []).map(a => a.toLowerCase());
      const overlap = have.filter(a => reqSet.has(a)).length;
      score += Math.min(20, (overlap / Math.max(1, reqSet.size)) * 20);
    } else {
      score += 10;
    }
    return Math.round(Math.min(100, score));
  }

  return (
    <div className="container space-y-3 py-4">
      <BackButton defaultLabel={fromRequests ? 'Matches' : 'Listings'} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="grid grid-cols-3 gap-2">
            {listing.images.map((src, i) => (
              <img key={i} src={src} alt={listing.title} className="h-28 w-full rounded-lg object-cover md:h-48" />
            ))}
          </div>
          <div className="mt-3 min-h-[40vh] overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            <MapView points={useMemo(() => [{ id: listing.id, title: listing.title, lat: listing.coords.lat, lng: listing.coords.lng }], [listing.id])} />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-xl font-semibold">{listing.title}</h1>
          <div className="text-[#A7BBC2]">{listing.location}</div>
          <div className="text-lg font-medium">{listing.price.toLocaleString('en-AE', { style: 'currency', currency: listing.type === 'rent' ? 'AED' : 'AED' })}</div>
          <div className="text-sm">{listing.bedrooms} BR • {listing.bathrooms} BA • {listing.areaSqft} sqft</div>
          <Card className="p-3 text-sm text-[#A7BBC2]">{listing.description}</Card>
          <div className="flex flex-wrap gap-2 text-xs">
            {listing.amenities.map((a) => (
              <span key={a} className="rounded-full border border-[#1F2B33] px-3 py-1">{a}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {!fromListings && (
              <Button onClick={() => setOpen(true)} className="w-full md:w-auto">Schedule Viewing</Button>
            )}
            {fromRequests && (
              <Link to="/inbox" className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>Contact</Link>
            )}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Request Viewing">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await api.createViewing(listing.id, viewDate, viewTime, viewNote || undefined);
              setOpen(false);
              setViewDate(''); setViewTime(''); setViewNote('');
              alert('Viewing requested');
            } catch (err) {
              alert('Failed to request viewing');
            }
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Input type="date" value={viewDate} onChange={(e)=>setViewDate(e.target.value)} required />
            <Input type="time" value={viewTime} onChange={(e)=>setViewTime(e.target.value)} required />
          </div>
          <textarea
            className="w-full rounded-lg border p-2 text-sm"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            placeholder="Optional note"
            value={viewNote}
            onChange={(e)=>setViewNote(e.target.value)}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Modal>

      {!fromRequests && (
        <div className="space-y-2 pt-4">
          <h3 className="text-md font-semibold">Matched Requests</h3>
          <div className="grid gap-2">
            {matchedRequests.length === 0 && (
              <div className="text-sm" style={{ color: 'var(--muted)' }}>No matching buyer/tenant requests yet.</div>
            )}
            {matchedRequests.map(r => (
              <Card key={r.id} className="p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="truncate text-sm">{r.type.toUpperCase()} • {r.location}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>Budget: {r.budget.toLocaleString('en-AE', { style: 'currency', currency: 'AED' })} • {r.bedrooms ?? '-'} BR • Created {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="mb-1 inline-block rounded-full px-2 py-1 text-[10px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      Match {computeMatchScore(r)}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{decisions[r.id] ?? r.status}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
                  <Button
                    size="sm"
                    variant={decisions[r.id] === 'accepted' ? 'primary' : 'outline'}
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      setDecisions(d => ({ ...d, [r.id]: 'accepted' }));
                      try { await api.acceptMatch(r.id, listing.id); } catch { /* ignore */ }
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant={decisions[r.id] === 'rejected' ? 'danger' : 'outline'}
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      setDecisions(d => ({ ...d, [r.id]: 'rejected' }));
                      try { await api.rejectMatch(r.id, listing.id); } catch { /* ignore */ }
                    }}
                  >
                    Reject
                  </Button>
                  <Button asChild size="sm" variant="secondary" className="w-full sm:w-auto">
                    <Link to="/inbox">Contact</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

