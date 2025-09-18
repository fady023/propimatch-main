import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Bell, Wallet, User, Search, Moon, Sun, Menu } from 'lucide-react';

const navItems = [
  { to: '/chat', label: 'Chat', icon: Search },
  { to: '/requests', label: 'Requests', icon: Home },
  { to: '/listings', label: 'Listings', icon: Home },
  { to: '/inbox', label: 'Inbox', icon: MessageCircle },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User }
];

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('pm:theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove('light');
      localStorage.setItem('pm:theme', 'dark');
    } else {
      root.classList.add('light');
      localStorage.setItem('pm:theme', 'light');
    }
  }, [dark]);
  return { dark, setDark };
}

export function NavBar() {
  const { pathname } = useLocation();
  const { dark, setDark } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <nav role="navigation" aria-label="Primary" className="sticky top-0 z-[999] border-b" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(o => !o)} className="rounded-lg p-2 hover:bg-[color:var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]" style={{ color: 'var(--text)' }}>
            <Menu size={20} />
          </button>
          <Link to="/" aria-label="Propimatch home" className="flex items-center gap-2 text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] rounded-md px-1" style={{ color: 'var(--text)' }}>
            <span className="inline-block h-6 w-6 rounded-md" style={{ background: 'var(--primary)' }} aria-hidden="true" />
            Propimatch
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Toggle theme" onClick={() => setDark(!dark)} className="rounded-lg p-2 hover:bg-[color:var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]" style={{ color: 'var(--text)' }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-40 p-2 md:hidden" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1" style={{ color: 'var(--muted)' }}>
          {navItems
            .filter(({ to }) => ['/chat', '/requests', '/listings', '/inbox', '/profile'].includes(to))
            .map(({ to, label, icon: Icon }) => (
              <Link
                aria-current={pathname.startsWith(to) ? 'page' : undefined}
                key={to}
                to={to}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs hover:bg-[color:var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
                style={{ color: pathname.startsWith(to) ? 'var(--primary)' : 'var(--muted)' }}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
        </div>
      </div>

      {/* Left sidebar like ChatGPT */}
      <aside
        aria-label="Sidebar"
        className={`fixed left-0 top-0 bottom-0 z-[900] w-64 border-r p-3 transition-transform duration-200 ease-out md:translate-x-0`}
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="mb-3 hidden items-center gap-2 md:flex">
          <span className="inline-block h-6 w-6 rounded-md" style={{ background: 'var(--primary)' }} aria-hidden="true" />
          <span className="font-semibold">Navigation</span>
        </div>
        <div className="grid gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} aria-current={pathname.startsWith(to) ? 'page' : undefined} onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-[color:var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]" style={{ color: pathname.startsWith(to) ? 'var(--primary)' : 'var(--text)' }}>
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[850] md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
    </nav>
  );
}

