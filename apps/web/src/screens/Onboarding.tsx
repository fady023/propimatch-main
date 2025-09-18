import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { LogIn } from 'lucide-react';

const slides = [
  { title: 'Welcome to Propimatch', body: 'Chat with our AI to describe your needs and get matched.' },
  { title: 'Shortlist matches', body: 'Swipe or tap shortlist/discard on properties you like.' },
  { title: 'Schedule viewings', body: 'Book viewings and chat with listers seamlessly.' }
];

export function Onboarding() {
  const [i, setI] = useState(0);
  const s = slides[i];
  return (
    <div className="container grid min-h-[70vh] place-items-center py-8">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-3xl bg-primary" />
        <h2 className="mb-2 text-xl font-semibold">{s.title}</h2>
        <p className="mb-6 text-[#A7BBC2]">{s.body}</p>
        <div className="mb-6 flex items-center justify-center gap-1">
          {slides.map((_, idx) => (
            <div key={idx} className={`h-2 w-2 rounded-full ${idx === i ? 'bg-primary' : 'bg-[#1F2B33]'}`} />
          ))}
        </div>
        {i < slides.length - 1 ? (
          <Button onClick={() => setI(i + 1)} className="w-full">Continue</Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link to="/auth/register" className="col-span-2">
              <Button className="w-full">Get Started</Button>
            </Link>
            <Link to="/auth/login" className="col-span-2">
              <Button variant="outline" className="w-full rounded-xl border-2 py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[color:var(--surface)]">
                <LogIn size={16} />
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

