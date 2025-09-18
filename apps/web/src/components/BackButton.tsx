import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = { defaultLabel?: string };

export function BackButton({ defaultLabel = 'Back' }: Props) {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const label: string = location.state?.prevLabel || defaultLabel;
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
      aria-label={`Back to ${label}`}
    >
      ← Back to {label}
    </button>
  );
}



