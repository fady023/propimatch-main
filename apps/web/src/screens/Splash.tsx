import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding', { replace: true }), 1000);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="mb-4 h-16 w-16 rounded-2xl bg-primary"></div>
      <h1 className="text-2xl font-bold">Propimatch</h1>
      <p className="text-[#A7BBC2]">Matching properties with people, conversationally.</p>
    </div>
  );
}

