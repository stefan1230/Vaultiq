import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import AuthScreen from './components/AuthScreen';
import MainApp from './components/MainApp';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setLoading(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleAuth = (u) => setUser(u);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user && !loading) {
    return <AuthScreen onAuth={handleAuth} showThemeToggle />;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading-screen__icon">⬡</span>
        <p className="loading-screen__text">Loading Vaultiq…</p>
      </div>
    );
  }

  return <MainApp user={user} onSignOut={handleSignOut} />;
}
