import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-transform duration-[var(--duration-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const sizes: Record<ButtonSize, string> = { sm: 'h-9 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-11 px-5 text-base' };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[color:var(--primary)] text-white hover:brightness-95',
    secondary: 'bg-[color:var(--surface-elev)] text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]',
    outline: 'border border-[color:var(--border)] hover:bg-[color:var(--surface)]',
    ghost: 'hover:bg-[color:var(--surface)]',
    danger: 'bg-[color:var(--danger)] text-white hover:brightness-95'
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {loading && <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-lg border px-4 py-3 text-sm shadow-[var(--shadow-xs)] focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)] ${className}`}
      style={{
        background: 'var(--surface-elev)',
        borderColor: 'var(--border)',
        color: 'var(--text)'
      }}
      {...props}
    />
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Card: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div className={`rounded-[var(--radius-md)] border shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)] ${className}`} style={{ background: 'var(--surface-elev)', borderColor: 'var(--border)' }} {...props} />
);

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
      <div className="w-full max-w-lg rounded-xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-[color:var(--surface)]">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}
export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => (
  <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-[var(--shadow-sm)] ${role === 'user' ? 'text-white rounded-br-sm' : 'rounded-bl-sm border'}`}
      style={role === 'user' ? { background: 'var(--primary)' } : { background: 'var(--surface-elev)', borderColor: 'var(--border)' }}
    >
      {content}
    </div>
  </div>
);

// Simple Badge/Chip/Toggle/Drawer
export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = '', ...p }) => (
  <span className={`inline-flex items-center rounded-full bg-[color:var(--surface)] px-2 py-1 text-[10px] font-medium ${className}`} style={{ border: '1px solid var(--border)' }} {...p} />
);

export const Chip: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...p }) => (
  <button className={`rounded-full border px-3 py-1 text-xs transition-colors hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] ${className}`} style={{ borderColor: 'var(--border)', color: 'var(--muted)' }} {...p} />
);

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void } & React.HTMLAttributes<HTMLButtonElement>> = ({ checked, onChange, className = '', ...p }) => (
  <button aria-pressed={checked} onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition-colors ${className}`} style={{ background: checked ? 'var(--primary)' : 'var(--border)' }} {...p}>
    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" style={{ transform: checked ? 'translateX(20px)' : 'translateX(0px)' }} />
  </button>
);

export const Drawer: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10000]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] border-l p-4" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

