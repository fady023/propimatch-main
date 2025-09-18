import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Card, Button, Modal, Input } from '../components/ui';

export function Wallet() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('50');
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try { setLoading(true); const data = await api.health().then(()=>api as any).wallet?.transactions ?? await api['wallet_transactions']?.(); } catch {}
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await (api as any).health().then(()=> fetch((import.meta as any).env?.VITE_API_BASE_URL ? `${(import.meta as any).env.VITE_API_BASE_URL}/wallet/transactions` : `http://${window.location.hostname}:4000/wallet/transactions`).then(r=>r.json()));
        if (!cancelled) setTxs(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  const balance = txs.reduce((acc, t) => acc + (t.type === 'purchase' ? t.amount : t.type === 'spend' ? -t.amount : t.amount), 0);
  return (
    <div className="container space-y-3 py-4">
      <h2 className="text-lg font-semibold">Wallet & Credits</h2>
      <Card className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs text-[#A7BBC2]">Current Balance</div>
          <div className="text-2xl font-bold">{balance} credits</div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Buy Credits</Button>
          <Button variant="outline">Redeem</Button>
        </div>
      </Card>
      <div className="grid gap-2">
        {txs.map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-3 text-sm">
            <div>
              <div className="font-medium">{t.description ?? t.type}</div>
              <div className="text-xs text-[#A7BBC2]">{new Date(t.createdAt).toLocaleString()}</div>
            </div>
            <div className="font-medium">{t.type === 'spend' ? '-' : '+'}{t.amount}</div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Buy Credits">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            alert(`Purchased ${amount} credits`);
          }}
        >
          <div>
            <label className="mb-1 block text-xs" style={{ color: 'var(--muted)' }}>Amount</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min={10} />
          </div>
          <Button type="submit" className="w-full">Pay</Button>
        </form>
      </Modal>
    </div>
  );
}

