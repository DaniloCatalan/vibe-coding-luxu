"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Checks admin role silently — never blocks the UI.
    const checkAdmin = async (userId: string | undefined) => {
      if (!userId) {
        if (mounted) setIsAdmin(false);
        return;
      }
      try {
        const { data } = await supabase.rpc('is_admin');
        if (mounted) setIsAdmin(!!data);
      } catch (err) {
        console.error("Error checking admin status:", err);
        if (mounted) setIsAdmin(false);
      }
    };

    // isLoading is ONLY used for the very first check on page load.
    // After that, user/session/isAdmin update silently in the background.
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
        await checkAdmin(session?.user?.id);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for subsequent auth events (login, logout, token refresh).
    // We do NOT set isLoading here — user/session are updated immediately,
    // and the admin flag updates quietly in the background.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip the initial session event — already handled in initializeAuth.
      if (event === 'INITIAL_SESSION') return;

      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Update admin status silently (no isLoading = true here)
        checkAdmin(session?.user?.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
