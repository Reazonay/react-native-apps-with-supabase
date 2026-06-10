import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

interface AuthState {
  status: AuthStatus;
  message: string | null;
  userEmail: string | null;
}

// ---------------------------------------------------------------------------
// Hook: useAuth – Signup + aktuelle Session
// ---------------------------------------------------------------------------

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    status: 'idle',
    message: null,
    userEmail: null,
  });

  // Aktuelle Session beim Mount prüfen
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setState(s => ({ ...s, userEmail: session.user.email ?? null }));
      }
    });

    // Auf Auth-Änderungen reagieren (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(s => ({ ...s, userEmail: session?.user?.email ?? null }));
    });

    return () => subscription.unsubscribe();
  }, []);

  // ---- Sign Up ----
  const signUp = useCallback(async (email: string, password: string) => {
    setState({ status: 'loading', message: 'Registrierung läuft...', userEmail: null });

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setState({ status: 'error', message: error.message, userEmail: null });
      return false;
    }

    setState({
      status: 'success',
      message: 'Konto erfolgreich erstellt!',
      userEmail: data.user?.email ?? null,
    });
    return true;
  }, []);

  // ---- Sign In ----
  const signIn = useCallback(async (email: string, password: string) => {
    setState({ status: 'loading', message: 'Anmeldung läuft...', userEmail: null });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setState({ status: 'error', message: error.message, userEmail: null });
      return false;
    }

    setState({
      status: 'success',
      message: 'Angemeldet!',
      userEmail: data.user?.email ?? null,
    });
    return true;
  }, []);

  // ---- Sign Out ----
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ status: 'idle', message: null, userEmail: null });
  }, []);

  return { ...state, signUp, signIn, signOut };
}
