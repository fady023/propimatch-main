import React from 'react';
import { currentUser } from '@propimatch/data';
import { Button, Card, Input } from '../components/ui';
import { useAuth } from '../store/auth';

export function Profile() {
  const { logout } = useAuth();
  return (
    <div className="container grid gap-4 py-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatarUrl} className="h-14 w-14 rounded-full" />
          <div>
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-xs text-[#A7BBC2]">{currentUser.email}</div>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </Card>
      <Card className="p-4 md:col-span-2">
        <h3 className="mb-3 text-sm font-semibold">Edit Profile</h3>
        <form className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-[#A7BBC2]">Name</label>
            <Input defaultValue={currentUser.name} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[#A7BBC2]">Phone</label>
            <Input placeholder="+971…" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-[#A7BBC2]">Notifications</label>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked /> Email</label>
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked /> Push</label>
            </div>
          </div>
          <div className="md:col-span-2">
            <Button>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

