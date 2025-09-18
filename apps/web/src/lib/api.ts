const ENV_BASE = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
const HOST_BASE = typeof window !== 'undefined' && window.location?.hostname
  ? `http://${window.location.hostname}:4000`
  : 'http://127.0.0.1:4000';
const BASE_URL = ENV_BASE || HOST_BASE;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  health: () => http<{ ok: boolean }>('/health'),
  me: () => http('/me'),
  getRequests: () => http('/requests'),
  getListings: () => http('/listings'),
  getUsers: () => http('/users'),
  getConversations: () => http('/inbox'),
  getMessages: (id: string) => http(`/inbox/${id}/messages`),
  getMatchesForRequest: (id: string) => http(`/matches/for-request/${id}`),
  shortlist: (listingId: string) => http(`/actions/${listingId}/shortlist`, { method: 'POST', body: JSON.stringify({}) }),
  discard: (listingId: string) => http(`/actions/${listingId}/discard`, { method: 'POST', body: JSON.stringify({}) }),
  acceptMatch: (requestId: string, listingId: string) => http(`/matches/${requestId}/${listingId}/accept`, { method: 'POST', body: JSON.stringify({}) }),
  rejectMatch: (requestId: string, listingId: string) => http(`/matches/${requestId}/${listingId}/reject`, { method: 'POST', body: JSON.stringify({}) }),
  createViewing: (listingId: string, date: string, time: string, note?: string) =>
    http(`/viewings/${listingId}`, { method: 'POST', body: JSON.stringify({ date, time, note }) }),
};

export default api;


