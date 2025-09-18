import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
const Splash = lazy(() => import('./screens/Splash.tsx').then(m => ({ default: m.Splash })));
const AuthLayout = lazy(() => import('./screens/auth/AuthLayout.tsx').then(m => ({ default: m.AuthLayout })));
const Login = lazy(() => import('./screens/auth/Login.tsx').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./screens/auth/Register.tsx').then(m => ({ default: m.Register })));
const Forgot = lazy(() => import('./screens/auth/Forgot.tsx').then(m => ({ default: m.Forgot })));
const Onboarding = lazy(() => import('./screens/Onboarding.tsx').then(m => ({ default: m.Onboarding })));
const ChatAssistant = lazy(() => import('./screens/ChatAssistant.tsx').then(m => ({ default: m.ChatAssistant })));
const Requests = lazy(() => import('./screens/Requests.tsx').then(m => ({ default: m.Requests })));
const Listings = lazy(() => import('./screens/Listings.tsx').then(m => ({ default: m.Listings })));
const MatchResults = lazy(() => import('./screens/MatchResults.tsx').then(m => ({ default: m.MatchResults })));
const PropertyDetail = lazy(() => import('./screens/PropertyDetail.tsx').then(m => ({ default: m.PropertyDetail })));
const Inbox = lazy(() => import('./screens/Inbox.tsx').then(m => ({ default: m.Inbox })));
const Conversation = lazy(() => import('./screens/Conversation.tsx').then(m => ({ default: m.Conversation })));
const Notifications = lazy(() => import('./screens/Notifications.tsx').then(m => ({ default: m.Notifications })));
const Wallet = lazy(() => import('./screens/Wallet.tsx').then(m => ({ default: m.Wallet })));
const Profile = lazy(() => import('./screens/Profile.tsx').then(m => ({ default: m.Profile })));
const Admin = lazy(() => import('./screens/Admin.tsx').then(m => ({ default: m.Admin })));
const NotFound = lazy(() => import('./screens/NotFound.tsx'));
import { NavBar } from './components/NavBar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <NavBar />
      <ErrorBoundary>
      <Suspense fallback={<div className="container py-6" style={{ color: 'var(--muted)' }}>Loading…</div>}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/auth" element={<AuthLayout />}> 
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot" element={<Forgot />} />
        </Route>

        <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/requests/:id" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
        <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
        <Route path="/listings/:id" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
        <Route path="/property/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/inbox/:id" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
    </div>
  );
}

