import React, { useEffect, useState } from 'react';
import { AuthSession, ClientProperty } from './types';
import { storage } from './services/storage';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ClientDashboard } from './components/client/ClientDashboard';

export default function App() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => storage.getAuth());
  const [activeClient, setActiveClient] = useState<ClientProperty | null>(() => {
    const session = storage.getAuth();
    if (session && session.role === 'client' && session.clientPropertyId) {
      return storage.getClientById(session.clientPropertyId) || null;
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'client' | 'join'>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => storage.getTheme());

  // Sync view based on auth session
  useEffect(() => {
    if (!authSession) {
      setCurrentView('landing');
    } else if (authSession.role === 'admin') {
      setCurrentView('admin');
    } else if (authSession.role === 'client') {
      if (authSession.clientPropertyId) {
        const client = storage.getClientById(authSession.clientPropertyId);
        if (client && client.paymentStatus === 'paid' && client.status !== 'suspended') {
          setActiveClient(client);
          setCurrentView('client');
        } else {
          // If not paid or suspended, land on landing page
          storage.setAuth(null);
          setAuthSession(null);
          setCurrentView('landing');
        }
      }
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    storage.setTheme(nextTheme);
  };

  const handleLoginSuccess = (session: AuthSession, client?: ClientProperty) => {
    setAuthSession(session);
    if (session.role === 'admin') {
      setCurrentView('admin');
    } else if (client) {
      setActiveClient(client);
      setCurrentView('client');
    }
  };

  const handleLogout = () => {
    storage.setAuth(null);
    setAuthSession(null);
    setActiveClient(null);
    setCurrentView('landing');
  };

  // Called when client completes dummy payment in Join section
  const handleJoinSuccess = (newClient: ClientProperty) => {
    const session: AuthSession = {
      role: 'client',
      email: newClient.email,
      clientPropertyId: newClient.id,
    };
    storage.setAuth(session);
    setAuthSession(session);
    setActiveClient(newClient);
    setCurrentView('client');
  };

  // Admin inspects client PMS
  const handleAdminSelectClientPMS = (client: ClientProperty) => {
    setActiveClient(client);
    setCurrentView('client');
  };

  const handleSwitchClientProperty = (newClient: ClientProperty) => {
    setActiveClient(newClient);
    if (authSession) {
      const updatedSession = { ...authSession, clientPropertyId: newClient.id };
      storage.setAuth(updatedSession);
      setAuthSession(updatedSession);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#090A0F] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'admin' && authSession?.role !== 'admin') {
            setIsLoginModalOpen(true);
            return;
          }
          if (view === 'client' && (!authSession || authSession.role !== 'client')) {
            setIsLoginModalOpen(true);
            return;
          }
          setCurrentView(view);
        }}
        authSession={authSession}
        activeClient={activeClient}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Router */}
      {currentView === 'landing' || currentView === 'join' ? (
        <LandingPage
          onJoinSuccess={handleJoinSuccess}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          theme={theme}
        />
      ) : currentView === 'admin' && authSession?.role === 'admin' ? (
        <AdminDashboard
          onSelectClientPMS={handleAdminSelectClientPMS}
          onLogout={handleLogout}
          theme={theme}
        />
      ) : currentView === 'client' && activeClient ? (
        <ClientDashboard
          client={activeClient}
          onLogout={handleLogout}
          onSwitchProperty={handleSwitchClientProperty}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        /* Fallback for unauthenticated access: always show Landing Page */
        <LandingPage
          onJoinSuccess={handleJoinSuccess}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          theme={theme}
        />
      )}

      {/* Login Authentication Modal */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onNavigateToJoin={() => {
          setCurrentView('landing');
          setTimeout(() => {
            const el = document.getElementById('join-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        theme={theme}
      />
    </div>
  );
}
