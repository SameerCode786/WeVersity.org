import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import * as React from "react";
import { supabaseClient } from "../backend/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = React.createContext(undefined as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null as any);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check active session on app start
    const checkSession = async () => {
      try {
        // Check if supabaseClient has the getSession method
        if (typeof supabaseClient.auth.getSession === 'function') {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.warn('Error checking session:', error);
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    let subscription: { unsubscribe: () => void } | undefined;

    if (typeof supabaseClient.auth.onAuthStateChange === 'function') {
      const result = supabaseClient.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      });

      // Handle both possible return types
      if (result && typeof result === 'object') {
        if ('data' in result && result.data?.subscription) {
          subscription = result.data.subscription as { unsubscribe: () => void } | undefined;
        } else if ('subscription' in result) {
          subscription = result.subscription as { unsubscribe: () => void } | undefined;
        }
      }
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check if supabaseClient has the signInWithPassword method
      if (typeof supabaseClient.auth.signInWithPassword !== 'function') {
        console.warn('Supabase client is in mock mode. Login functionality is not available.');
        return {
          success: false,
          error: "Authentication is not configured. Please set up Supabase environment variables."
        };
      }

      // First, try to sign in
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Sign in regardless of email verification status (skip verification requirement)
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Invalid login credentials" };
    }
  };

  const logout = async () => {
    try {
      if (typeof supabaseClient.auth.signOut === 'function') {
        await supabaseClient.auth.signOut();
      }
    } catch (error) {
      console.warn('Error during logout:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    // Clear pending verification email
    await AsyncStorage.removeItem("pendingVerificationEmail");
  };

  const refreshUser = async () => {
    try {
      if (typeof supabaseClient.auth.getUser === 'function') {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.warn('Error refreshing user:', error);
    }
  };

  // Don't render children until we've checked the session
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};