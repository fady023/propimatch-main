import React, { useEffect, useRef, useState } from 'react';
import { ChatBubble, Button, Input } from '../components/ui';
import { MessageSquarePlus, RefreshCw, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { messages } from '@propimatch/data/index.ts';

interface Msg { role: 'user' | 'assistant'; content: string }

export function ChatAssistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! Tell me about the property you want to buy or rent in the UAE. You can mention location, budget, bedrooms, and any must-have amenities.' }
  ]);
  const [input, setInput] = useState('Looking for a 2BR in Dubai Marina under 8k with parking');
  const [loading, setLoading] = useState(false);
  const [agentIndex, setAgentIndex] = useState<number | null>(null);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setInput('');
    setLoading(true);
    // Simple streaming mock
    const reply = 'Great! I found 3 matches. You can view them in Requests → r1.';
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setMessages((m) => {
        const base = m.filter((_, idx) => idx < next.length);
        const updated = [...base, { role: 'assistant', content: reply.slice(0, i) }];
        setAgentIndex(updated.length - 1);
        return updated;
      });
      if (i >= reply.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 30);
  };

  return (
    <div className="container grid min-h-[calc(100vh-120px)] grid-rows-[1fr_auto] gap-4 py-2 md:min-h-[calc(100vh-80px)]">
      <div className="mx-auto w-full max-w-2xl space-y-3 overflow-auto px-1">
        {messages.map((m, idx) => (
          <ChatBubble key={idx} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--muted)] border-t-transparent" />
            Assistant is thinking…
          </div>
        )}
      </div>

      <div className="sticky bottom-2 left-0 right-0 mx-auto w-full max-w-2xl rounded-2xl border p-2" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your property needs…" />
          <Button onClick={send} aria-label="Send">
            <MessageSquarePlus size={18} />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {['2BR Marina under 8k', 'Townhouse in Abu Dhabi', 'Studio near Metro'].map((chip) => (
            <button key={chip} className="rounded-full border px-3 py-1 hover:border-primary hover:text-primary" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }} onClick={() => setInput(chip)}>
              {chip}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <button className="flex items-center gap-1 rounded-lg border px-2 py-1 hover:border-primary" style={{ borderColor: 'var(--border)' }} onClick={() => {
            if (agentIndex != null) {
              setLoading(true);
              const reply = 'Sure — refining your matches now…';
              let i = 0;
              const start = messages.slice(0, agentIndex);
              const interval = setInterval(() => {
                i += 2;
                setMessages([...start, { role: 'assistant', content: reply.slice(0, i) }, ...messages.slice(agentIndex + 1)]);
                if (i >= reply.length) { clearInterval(interval); setLoading(false); }
              }, 30);
            }
          }}>
            <RefreshCw size={14} /> Regenerate
          </button>
          <button className="flex items-center gap-1 rounded-lg border px-2 py-1 hover:border-primary" style={{ borderColor: 'var(--border)' }} onClick={() => navigator.clipboard.writeText(messages[messages.length-1]?.content ?? '')}>
            <Copy size={14} /> Copy
          </button>
          <button className="flex items-center gap-1 rounded-lg border px-2 py-1 hover:border-primary" style={{ borderColor: 'var(--border)' }}>
            <ThumbsUp size={14} />
          </button>
          <button className="flex items-center gap-1 rounded-lg border px-2 py-1 hover:border-primary" style={{ borderColor: 'var(--border)' }}>
            <ThumbsDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

