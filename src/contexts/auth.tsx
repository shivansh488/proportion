
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

/**
 * Interface defining the shape of the authentication context
 */
interface AuthContextType {
  user: User | null;        // Current authenticated user
  session: Session | null;  // Active session details
  loading: boolean;         // Authentication loading state
}

// Default context state
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

/**
 * AuthProvider Component
 * 
 * Manages authentication state and provides it to child components
 * through React Context.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Authentication state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Initialize authentication state
     * Checks for existing session and sets up auth state listeners
     */
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);

        // Set up real-time auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Context value
  const contextValue = {
    user,
    session,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * 
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
