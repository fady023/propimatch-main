import React from 'react';
import { listings, users, transactions } from '@propimatch/data';
import { Card, Button } from '../components/ui';

export function Admin() {
  return (
    <div className="container grid gap-4 py-4 md:grid-cols-3">
      <Card className="p-4">
        <h3 className="mb-2 text-sm font-semibold">Users</h3>
        <div className="grid gap-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-lg border border-[#1F2B33] p-2 text-sm">
              <div>{u.name}</div>
              <div className="flex gap-2">
                <Button variant="outline">Ban</Button>
                <Button variant="outline">Deactivate</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4 md:col-span-2">
        <h3 className="mb-2 text-sm font-semibold">Listings Moderation</h3>
        <div className="grid gap-2">
          {listings.map((l) => (
            <div key={l.id} className="grid items-center gap-2 rounded-lg border border-[#1F2B33] p-2 md:grid-cols-6">
              <img src={l.images[0]} className="h-14 w-full rounded-lg object-cover md:col-span-1" />
              <div className="md:col-span-3">
                <div className="text-sm font-medium">{l.title}</div>
                <div className="text-xs text-[#A7BBC2]">{l.location}</div>
              </div>
              <div className="flex gap-2 md:col-span-2 md:justify-end">
                <Button variant="outline">Approve</Button>
                <Button variant="ghost">Reject</Button>
              </div>
            </div>
          ))}
        </div>
        <h3 className="mt-6 text-sm font-semibold">Credits</h3>
        <div className="grid gap-2">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-[#1F2B33] p-2 text-sm">
              <div>{t.description ?? t.type}</div>
              <div>{t.amount}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

