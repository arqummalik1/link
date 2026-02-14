import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define context type
interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                // Cold-start check: if "remember me" was not selected, sign out
                const rememberMe = localStorage.getItem('linkvault_remember');
                const isFirstLoad = !sessionStorage.getItem('linkvault_session_active');

                if (session && rememberMe === 'false' && isFirstLoad) {
                    // User chose NOT to stay logged in and this is a new browser session
                    await supabase.auth.signOut();
                    setSession(null);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Mark this browser session as active (survives tab refreshes but not browser close)
                if (session) {
                    sessionStorage.setItem('linkvault_session_active', 'true');
                }

                setSession(session);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session) {
                    sessionStorage.setItem('linkvault_session_active', 'true');
                }
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async () => {
        window.location.href = '/login';
    };

    const signOut = async () => {
        localStorage.removeItem('linkvault_remember');
        sessionStorage.removeItem('linkvault_session_active');
        await supabase.auth.signOut();
    };

    const value = {
        user,
        session,
        loading,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
