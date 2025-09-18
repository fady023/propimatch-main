import React from 'react';
import { notifications } from '@propimatch/data/index.ts';
import { Card } from '../components/ui';
import { Link } from 'react-router-dom';

export function Notifications() {
  return (
    <div className="container space-y-3 py-4">
      <h2 className="text-lg font-semibold">Notifications</h2>
      <div className="grid gap-3">
        {notifications.map((n) => (
          <Link key={n.id} to={n.type === 'message' ? '/inbox' : n.type === 'match' ? '/requests' : '/'}>
            <Card className="p-3 hover:border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{n.body}</div>
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

