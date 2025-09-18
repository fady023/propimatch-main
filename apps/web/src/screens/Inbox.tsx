import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { Card, Button } from '../components/ui';
import { Link } from 'react-router-dom';

export function Inbox() {
  const [convos, setConvos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [lastBy, setLastBy] = useState<Record<string, { content: string; createdAt: string } | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [u, c] = await Promise.all([api.getUsers(), api.getConversations()]);
        const convArr = c as any[];
        const by: Record<string, { content: string; createdAt: string } | undefined> = {};
        // fetch last message per convo in parallel (best-effort)
        await Promise.all(
          convArr.map(async (conv) => {
            try {
              const msgs = await api.getMessages(conv.id as string);
              by[conv.id as string] = (msgs as any[])[(msgs as any[]).length - 1];
            } catch {}
          })
        );
        if (!cancelled) { setUsers(u as any[]); setConvos(convArr); setLastBy(by); }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="container mx-auto py-2">
      <Card className="p-0">
        <div className="flex items-center justify-between border-b p-3" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-base font-semibold">Chats</h3>
          <Button variant="ghost" size="sm" aria-label="New chat">＋</Button>
        </div>
        {loading && <div className="p-3 text-sm" style={{ color: 'var(--muted)' }}>Loading…</div>}
        {error && <div className="p-3 text-sm" style={{ color: 'var(--danger)' }}>{error}</div>}
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {convos.length === 0 && !loading && !error && (
            <div className="p-3 text-sm" style={{ color: 'var(--muted)' }}>No conversations yet.</div>
          )}
          {convos.map((c) => {
            const other = users.find((u) => u.id !== 'u1' && c.participantIds.includes(u.id));
            const last = lastBy[c.id as string];
            return (
              <Link key={c.id} to={`/inbox/${c.id}`} className="flex items-center gap-3 p-3 hover:bg-[color:var(--surface)]">
                <img src={other?.avatarUrl} className="h-12 w-12 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">{other?.name ?? 'Conversation'}</div>
                    <div className="shrink-0 text-[11px]" style={{ color: 'var(--muted)' }}>{new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="truncate text-[12px]" style={{ color: 'var(--muted)' }}>{last?.content ?? 'Tap to view conversation'}</div>
                </div>
                {!!c.unreadCount && <span className="ml-2 min-w-6 rounded-full bg-[color:var(--primary)] px-2 py-0.5 text-center text-[10px] text-white">{c.unreadCount}</span>}
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

