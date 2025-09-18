import React, { useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Filter } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { Link } from 'react-router-dom';
import { getActionFor, setActionFor } from '../lib/prefs';
import { useActions } from '../store/useActions';
import { MapView } from '../components/MapView';
import { BackButton } from '../components/BackButton';

type View = 'grid' | 'list' | 'map';

export function MatchResults() {
  const { id } = useParams();
  const location = useLocation();
  const isFromRequests = location.pathname.startsWith('/requests');
  const isFromListings = location.pathname.startsWith('/listings');
  const [view, setView] = useState<View>('grid');
  const [sort, setSort] = useState<'price-asc'|'price-desc'|'score-desc'|'value-desc'>('score-desc');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<'all'|'rent'|'sale'>('all');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [minBedrooms, setMinBedrooms] = useState<number | ''>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minArea, setMinArea] = useState<number | ''>('');
  const [maxArea, setMaxArea] = useState<number | ''>('');
  const [hideDiscarded, setHideDiscarded] = useState<boolean>(true);
  const [items, setItems] = useState<any[]>([]);
  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state, set } = useActions();

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [lists, reqMatches] = await Promise.all([
          api.getListings(),
          id ? api.getMatchesForRequest(id) : Promise.resolve([]),
        ]);
        if (!cancelled) {
          setItems(lists as any[]);
          // If we have an id param (from requests), synthesize a request object for scoring display
          if (id && Array.isArray(reqMatches)) {
            // We don't have the original request details via this endpoint; fallback to a minimal object
            setRequest({ id });
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  function normalizeTypeForRequest(listingType: 'rent'|'sale'): 'buy'|'rent' {
    return listingType === 'sale' ? 'buy' : 'rent';
  }

  function computeMatchScore(listing: typeof listings[number]): number {
    if (!request) return 50;
    let score = 0;

    // Type match (20)
    score += normalizeTypeForRequest(listing.type) === request.type ? 20 : 0;

    // Location partial match (20)
    const locA = (listing.location || '').toLowerCase();
    const locB = (request.location || '').toLowerCase();
    if (locB && (locA.includes(locB) || locB.includes(locA))) score += 20; else if (locB) score += 8;

    // Bedrooms proximity (20)
    if (typeof request.bedrooms === 'number') {
      const diff = Math.abs((listing.bedrooms || 0) - request.bedrooms);
      const bedroomScore = Math.max(0, 20 - diff * 7);
      score += bedroomScore;
    } else {
      score += 10;
    }

    // Price within budget (20)
    if (typeof request.budget === 'number' && request.budget > 0) {
      if (listing.price <= request.budget) score += 20;
      else {
        const over = listing.price - request.budget;
        const tolerance = request.budget * 0.5; // linear drop-off up to +50%
        const priceScore = Math.max(0, 20 - (over / tolerance) * 20);
        score += priceScore;
      }
    } else {
      score += 10;
    }

    // Amenities overlap (20)
    if (Array.isArray(request.amenities) && request.amenities.length) {
      const reqSet = new Set(request.amenities.map(a => a.toLowerCase()));
      const have = (listing.amenities || []).map(a => a.toLowerCase());
      const overlap = have.filter(a => reqSet.has(a)).length;
      const amenityScore = Math.min(20, (overlap / Math.max(1, reqSet.size)) * 20);
      score += amenityScore;
    } else {
      score += 10;
    }

    return Math.round(Math.min(100, score));
  }

  function computeMarketValueScore(listing: typeof listings[number]): number {
    const peers = items.filter(l => l.type === listing.type && l.bedrooms === listing.bedrooms);
    const avg = peers.length ? peers.reduce((s, l) => s + l.price, 0) / peers.length : listing.price;
    // Higher score if below average
    const delta = (avg - listing.price) / Math.max(1, avg); // -inf..1
    const scaled = Math.round(Math.max(0, Math.min(1, 0.5 + delta)) * 100); // 0..100 centered
    return scaled;
  }

  const itemsWithScores = useMemo(() => {
    return items.map(l => ({
      listing: l,
      matchScore: computeMatchScore(l),
      valueScore: computeMarketValueScore(l)
    }));
  }, [items, request]);

  const filteredItems = useMemo(() => {
    return itemsWithScores.filter(({ listing }) => {
      if (hideDiscarded && state[listing.id]?.discarded) return false;
      if (typeFilter !== 'all' && listing.type !== typeFilter) return false;
      if (locationQuery.trim().length) {
        const terms = locationQuery.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
        if (terms.length) {
          const loc = (listing.location || '').toLowerCase();
          const anyMatch = terms.some(t => loc.includes(t));
          if (!anyMatch) return false;
        }
      }
      if (minBedrooms !== '' && (listing.bedrooms || 0) < (minBedrooms as number)) return false;
      if (minPrice !== '' && listing.price < (minPrice as number)) return false;
      if (maxPrice !== '' && listing.price > (maxPrice as number)) return false;
      if (minArea !== '' && (listing.areaSqft || 0) < (minArea as number)) return false;
      if (maxArea !== '' && (listing.areaSqft || 0) > (maxArea as number)) return false;
      return true;
    });
  }, [itemsWithScores, hideDiscarded, state, typeFilter, minBedrooms, maxPrice]);

  const sortedItems = useMemo(() => {
    const arr = [...filteredItems];
    switch (sort) {
      case 'price-asc':
        arr.sort((a, b) => a.listing.price - b.listing.price); break;
      case 'price-desc':
        arr.sort((a, b) => b.listing.price - a.listing.price); break;
      case 'value-desc':
        arr.sort((a, b) => b.valueScore - a.valueScore); break;
      case 'score-desc':
      default:
        arr.sort((a, b) => b.matchScore - a.matchScore); break;
    }
    return arr;
  }, [filteredItems, sort]);

  const listContent = (
    <div className={view === 'grid' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'grid gap-3'}>
      {sortedItems.map(({ listing: l, matchScore, valueScore }) => {
        const action = state[l.id] ?? getActionFor(l.id);
        return (
          view === 'grid' ? (
            <Card key={l.id} className="group flex flex-col overflow-hidden p-0">
              <Link to={`/property/${l.id}`} state={isFromRequests ? { fromRequests: true } : isFromListings ? { fromListings: true } : undefined} aria-label={`Open ${l.title} details`}>
                <img src={l.images[0]} alt={l.title} className="h-40 w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col p-3">
                <Link to={`/property/${l.id}`} state={isFromRequests ? { fromRequests: true } : isFromListings ? { fromListings: true } : undefined} className="block" aria-label={`Open ${l.title} details`}>
                  <div className="truncate text-sm font-medium">{l.title}</div>
                  <div className="truncate text-xs" style={{ color: 'var(--muted)' }}>{l.location}</div>
                  <div className="mt-1 text-sm font-semibold">{l.price.toLocaleString('en-AE', { style: 'currency', currency: 'AED' })}</div>
                </Link>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="rounded-full px-2 py-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>Match {matchScore}%</span>
                  <span className="rounded-full px-2 py-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>Value {valueScore}</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <Button
                    size="sm"
                    variant={action.shortlisted ? 'secondary' : 'outline'}
                    className={`rounded-full ${action.shortlisted ? 'border-primary text-primary' : ''}`}
                    onClick={() => set(l.id, { shortlisted: true })}
                  >
                    {action.shortlisted ? '✓ Shortlisted' : 'Shortlist'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`rounded-full ${action.discarded ? 'opacity-60' : ''}`}
                    onClick={() => set(l.id, { discarded: true })}
                  >
                    Discard
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card key={l.id} className="flex items-center gap-3 p-3">
              <Link to={`/property/${l.id}`} state={isFromRequests ? { fromRequests: true } : isFromListings ? { fromListings: true } : undefined} className="contents" aria-label={`Open ${l.title} details`}>
                <img src={l.images[0]} alt={l.title} className="h-16 w-20 rounded-lg object-cover" />
              </Link>
              <div className="flex-1">
                <Link to={`/property/${l.id}`} state={isFromRequests ? { fromRequests: true } : isFromListings ? { fromListings: true } : undefined} className="block" aria-label={`Open ${l.title} details`}>
                  <div className="text-sm">{l.title}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{l.location}</div>
                  <div className="mt-1 text-sm font-medium">{l.price.toLocaleString('en-AE', { style: 'currency', currency: 'AED' })}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="rounded-full px-2 py-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>Match {matchScore}%</span>
                    <span className="rounded-full px-2 py-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>Value {valueScore}</span>
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={action.shortlisted ? 'border-primary text-primary rounded-full' : 'rounded-full'}
                  onClick={() => set(l.id, { shortlisted: true })}
                >
                  {action.shortlisted ? '✓ Shortlisted' : 'Shortlist'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={action.discarded ? 'opacity-60 rounded-full' : 'rounded-full'}
                  onClick={() => set(l.id, { discarded: true })}
                >
                  Discard
                </Button>
              </div>
            </Card>
          )
        );})}
    </div>
  );

  return (
    <div className="container space-y-3 py-4">
      <BackButton defaultLabel="Requests" />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Matches for {id}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-label="Open filters" onClick={() => setFilterOpen(true)} className="rounded-lg p-2 hover:bg-[color:var(--surface)]" style={{ color: 'var(--text)', border: '1px solid var(--border)' }}>
            <Filter size={16} />
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-lg border p-2 text-xs" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} aria-label="Sort results">
            <option value="score-desc">Sort: Best Match</option>
            <option value="value-desc">Sort: Best Value</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          {(['grid','list','map'] as View[]).map(v => (
            <Button key={v} variant={view === v ? 'primary' : 'outline'} onClick={() => setView(v)}>{v}</Button>
          ))}
        </div>
      </div>

      <div className="hidden gap-3 md:grid md:grid-cols-2">
        <div className="min-h-[60vh]">{listContent}</div>
        <div className="min-h-[60vh] overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <MapView points={useMemo(() => items.map((l) => ({ id: l.id, title: l.title, lat: l.coords.lat, lng: l.coords.lng })), [items])} />
        </div>
      </div>

      <div className="md:hidden">
        {view !== 'map' && listContent}
        {view === 'map' && (
          <MapView points={useMemo(() => items.map((l) => ({ id: l.id, title: l.title, lat: l.coords.lat, lng: l.coords.lng })), [items])} />
        )}
      </div>

      {filterOpen && (
        <div className="fixed inset-0" role="dialog" aria-modal="true" onClick={() => setFilterOpen(false)} style={{ zIndex: 10000 }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] border-l p-4" style={{ background: 'var(--bg)', borderColor: 'var(--border)', zIndex: 10001 }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 text-sm font-semibold">Filters</div>
            <div className="grid gap-3 text-xs">
              <label className="grid gap-1">
                <span style={{ color: 'var(--muted)' }}>Property type</span>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="rounded-lg border p-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                  <option value="all">All</option>
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span style={{ color: 'var(--muted)' }}>Locations (comma-separated)</span>
                <input value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="Dubai Marina, JVC" className="rounded-lg border p-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1">
                  <span style={{ color: 'var(--muted)' }}>Min price (AED)</span>
                  <input type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} className="rounded-lg border p-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} />
                </label>
                <label className="grid gap-1">
                  <span style={{ color: 'var(--muted)' }}>Max price (AED)</span>
                  <input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} className="rounded-lg border p-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1">
                  <span style={{ color: 'var(--muted)' }}>Min size (sqft)</span>
                  <input type="number" min={0} value={minArea} onChange={(e) => setMinArea(e.target.value === '' ? '' : Number(e.target.value))} className="rounded-lg border p-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} />
                </label>
                <label className="grid gap-1">
                  <span style={{ color: 'var(--muted)' }}>Max size (sqft)</span>
                  <input type="number" min={0} value={maxArea} onChange={(e) => setMaxArea(e.target.value === '' ? '' : Number(e.target.value))} className="rounded-lg border p-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} />
                </label>
              </div>
              <label className="grid gap-1">
                <span style={{ color: 'var(--muted)' }}>Min bedrooms</span>
                <input type="number" min={0} value={minBedrooms} onChange={(e) => setMinBedrooms(e.target.value === '' ? '' : Number(e.target.value))} className="rounded-lg border p-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={hideDiscarded} onChange={(e) => setHideDiscarded(e.target.checked)} />
                <span style={{ color: 'var(--muted)' }}>Hide discarded</span>
              </label>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="primary" onClick={() => setFilterOpen(false)}>Apply</Button>
              <Button variant="outline" onClick={() => { setTypeFilter('all'); setLocationQuery(''); setMinBedrooms(''); setMinPrice(''); setMaxPrice(''); setMinArea(''); setMaxArea(''); setHideDiscarded(true); }}>Reset</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

