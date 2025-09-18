import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { ChatBubble, Input, Button, Card } from '../components/ui';
import { BackButton } from '../components/BackButton';

export function Conversation() {
  const { id } = useParams();
  const [convo, setConvo] = useState<any | null>(null);
  const [chat, setChat] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight;
  }, [id, chat.length]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [u, convs, msgs] = await Promise.all([
          api.getUsers(),
          api.getConversations(),
          id ? api.getMessages(id) : Promise.resolve([]),
        ]);
        const found = (convs as any[]).find(c => c.id === id) || null;
        if (!cancelled) { setUsers(u as any[]); setConvo(found); setChat(msgs as any[]); }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const other = useMemo(() => {
    if (!convo) return undefined;
    return users.find(u => u.id !== 'u1' && (convo?.participantIds||[]).includes(u.id));
  }, [convo, users]);

  if (!convo) {
    return (
      <div className="container py-6">
        <BackButton defaultLabel="Inbox" />
        <div className="mt-4" style={{ color: 'var(--muted)' }}>Conversation not found.</div>
      </div>
    );
  }

  return (
    <div className="container space-y-3 py-4">
      <BackButton defaultLabel="Inbox" />
      <Card className="flex h-[70vh] flex-col md:h-[calc(100vh-160px)]">
        <div className="flex items-center gap-3 border-b p-3" style={{ borderColor: 'var(--border)' }}>
          <img src={other?.avatarUrl} className="h-8 w-8 rounded-full" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{other?.name ?? 'Conversation'}</div>
            <div className="text-[11px]" style={{ color: 'var(--muted)' }}>Online recently</div>
          </div>
          <div className="ml-auto text-[11px]" style={{ color: 'var(--muted)' }}>
            <Link to="/inbox" className="rounded-full px-2 py-1 hover:underline">All chats</Link>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-2 overflow-auto p-3">
          {chat.map((m) => (
            <ChatBubble key={m.id} role={m.senderId === 'u1' ? 'user' : 'assistant'} content={m.content} />
          ))}
        </div>
        <div className="border-t p-2" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" />
            <Button size="md" onClick={() => setText('')}>Send</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Conversation;


