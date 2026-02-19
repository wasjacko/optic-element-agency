
import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestAuthCode, verifyAuthCode } from '../../src/utils/auth-client';

// Default password hash (corresponding to "admin123")
const DEFAULT_HASH = "240be518fabd2724ddb6f04eeb1da5967406eb431c63fca5db4a22461ac6e8b6";

interface AuthContextType {
    isAuthenticated: boolean;
    requestOtp: (email: string) => Promise<{ success: boolean; message?: string }>;
    verifyOtp: (email: string, code: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
    isLocked: boolean;
    lockoutTimeLeft: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Security Configurations
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 1000; // 1 Minute
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 Minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Rate Limiting States
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(0);
    const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

    // Check Lockout Timer
    useEffect(() => {
        const timer = setInterval(() => {
            if (lockoutUntil > Date.now()) {
                setLockoutTimeLeft(Math.ceil((lockoutUntil - Date.now()) / 1000));
            } else {
                setLockoutTimeLeft(0);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [lockoutUntil]);

    useEffect(() => {
        // OWASP: Use sessionStorage instead of localStorage for sensitive sessions
        // so it clears when the tab is closed.
        const session = sessionStorage.getItem('oe_admin_session');
        const lastActivity = sessionStorage.getItem('oe_admin_last_activity');

        // Check Session Validity and Timeout
        if (session && lastActivity) {
            const timeSinceActivity = Date.now() - parseInt(lastActivity, 10);
            if (timeSinceActivity < SESSION_TIMEOUT) {
                setIsAuthenticated(true);
            } else {
                // Session expired
                logout();
            }
        }

        setIsLoading(false);
    }, []);

    // Update Activity Timestamp on clicks to keep session alive
    useEffect(() => {
        const updateActivity = () => {
            if (isAuthenticated) {
                sessionStorage.setItem('oe_admin_last_activity', Date.now().toString());
            }
        };
        window.addEventListener('click', updateActivity);
        return () => window.removeEventListener('click', updateActivity);
    }, [isAuthenticated]);

    const requestOtp = async (email: string) => {
        // 1. Check Rate Limiting
        if (Date.now() < lockoutUntil) return { success: false, message: "System Locked" };

        const res = await requestAuthCode(email);
        return res;
    };

    const verifyOtp = async (email: string, code: string) => {
        // 1. Check Rate Limiting
        if (Date.now() < lockoutUntil) return false;

        // 2. Verify Code
        const res = await verifyAuthCode(email, code);

        if (res.success) {
            // 3. Reset Attempts on Success
            setAttempts(0);
            setLockoutUntil(0);

            // 4. Create Session
            sessionStorage.setItem('oe_admin_session', res.token || 'valid');
            sessionStorage.setItem('oe_admin_last_activity', Date.now().toString());
            setIsAuthenticated(true);
            return true;
        } else {
            // 5. Increment Rate Limit
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= MAX_ATTEMPTS) {
                setLockoutUntil(Date.now() + LOCKOUT_DURATION);
            }

            return false;
        }
    };

    const logout = () => {
        sessionStorage.removeItem('oe_admin_session');
        sessionStorage.removeItem('oe_admin_last_activity');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            requestOtp,
            verifyOtp,
            logout,
            isLoading,
            isLocked: Date.now() < lockoutUntil,
            lockoutTimeLeft
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
