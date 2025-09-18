import React from 'react';

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary caught', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-10">
          <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
            <button onClick={() => location.reload()} className="rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border)' }}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


