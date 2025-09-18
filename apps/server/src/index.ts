import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as data from '@propimatch/data';

const { users, listings, requests, conversations, messages, notifications, transactions, currentUser } = data as typeof import('@propimatch/data');

const server = Fastify({ logger: true });

await server.register(cors, { origin: true });

server.get('/health', async () => ({ ok: true }));

server.get('/me', async () => currentUser);
server.get('/users', async () => users);

// Minimal auth mock
server.post('/auth/login', async (req: any, reply) => {
  const body = req.body as { email?: string } | undefined;
  const user = users.find(u => u.email === body?.email) || currentUser;
  return reply.send({ token: 'demo-token', user });
});

server.get('/listings', async () => listings);
server.get('/listings/:id', async (req: any, reply) => {
  const item = listings.find((l: typeof listings[number]) => l.id === req.params.id);
  if (!item) return reply.code(404).send({ error: 'Not found' });
  return item;
});

server.get('/requests', async () => requests);

// In-memory actions store
const actions: Record<string, { shortlisted?: boolean; discarded?: boolean }> = {};
server.post('/actions/:listingId/shortlist', async (req: any) => {
  const id = req.params.listingId as string;
  actions[id] = { ...(actions[id]||{}), shortlisted: true, discarded: false };
  return { ok: true, id, state: actions[id] };
});
server.post('/actions/:listingId/discard', async (req: any) => {
  const id = req.params.listingId as string;
  actions[id] = { ...(actions[id]||{}), discarded: true, shortlisted: false };
  return { ok: true, id, state: actions[id] };
});
server.get('/actions', async () => actions);

server.get('/matches/for-request/:id', async (req: any) => {
  const r = requests.find((x: typeof requests[number]) => x.id === req.params.id);
  if (!r) return [];
  const reqObj = r; // non-null request reference
  const normalize = (t: 'sale'|'rent') => (t === 'sale' ? 'buy' : 'rent');
  function score(listing: typeof listings[number]) {
    let s = 0;
    s += (normalize(listing.type) === reqObj.type) ? 20 : 0;
    const la = (listing.location||'').toLowerCase();
    const lb = (reqObj.location||'').toLowerCase();
    if (lb && (la.includes(lb) || lb.includes(la))) s += 20; else if (lb) s += 8;
    if (typeof reqObj.bedrooms === 'number') {
      const diff = Math.abs((listing.bedrooms||0) - reqObj.bedrooms);
      s += Math.max(0, 20 - diff*7);
    } else s += 10;
    if (typeof reqObj.budget === 'number' && reqObj.budget > 0) {
      if (listing.price <= reqObj.budget) s += 20; else {
        const over = listing.price - reqObj.budget;
        const tol = reqObj.budget * 0.5;
        s += Math.max(0, 20 - (over/tol)*20);
      }
    } else s += 10;
    if (Array.isArray(reqObj.amenities) && reqObj.amenities.length) {
      const want = new Set((reqObj.amenities as string[]).map((a: string) => a.toLowerCase()));
      const have = (listing.amenities||[]).map((a: string) => a.toLowerCase());
      const overlap = have.filter((a: string) => want.has(a)).length;
      s += Math.min(20, (overlap/Math.max(1, want.size))*20);
    } else s += 10;
    return Math.round(Math.min(100,s));
  }
  return listings
    .map((l: typeof listings[number]) => ({ id: `${reqObj.id}-${l.id}`, requestId: reqObj.id, listingId: l.id, score: score(l) }))
    .sort((a: { score: number }, b: { score: number }) => b.score-a.score);
});

server.get('/inbox', async () => conversations);
server.get('/inbox/:id/messages', async (req: any) => messages.filter((m: typeof messages[number]) => m.conversationId === req.params.id));

// Accept / Reject match for a request (mock persistence)
const decisions: Record<string, 'accepted'|'rejected'> = {};
server.post('/matches/:requestId/:listingId/accept', async (req: any) => {
  const { requestId, listingId } = req.params as { requestId: string; listingId: string };
  decisions[`${requestId}:${listingId}`] = 'accepted';
  return { ok: true };
});
server.post('/matches/:requestId/:listingId/reject', async (req: any) => {
  const { requestId, listingId } = req.params as { requestId: string; listingId: string };
  decisions[`${requestId}:${listingId}`] = 'rejected';
  return { ok: true };
});

// Schedule viewing (mock)
type ViewingBody = { date: string; time: string; note?: string };
server.post('/viewings/:listingId', async (req: any) => {
  const { listingId } = req.params as { listingId: string };
  const body = (req.body || {}) as ViewingBody;
  return { ok: true, listingId, scheduledAt: `${body.date}T${body.time}:00`, note: body.note || '' };
});

server.get('/wallet/transactions', async () => transactions);
server.get('/notifications', async () => notifications);

const port = Number(process.env.PORT||4000);
server.listen({ port, host: '0.0.0.0' }).then(() => {
  server.log.info(`server listening on ${port}`);
}).catch((err) => {
  server.log.error(err);
  process.exit(1);
});


