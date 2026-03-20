
import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestAuthCode, verifyAuthCode } from '../../src/utils/auth-client';

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

    // Check Session on Start
    useEffect(() => {
        const checkSession = () => {
            try {
                const session = sessionStorage.getItem('oe_admin_session');
                const lastActivity = sessionStorage.getItem('oe_admin_last_activity');
                
                if (session && lastActivity) {
                    const isTimeout = (Date.now() - parseInt(lastActivity)) > SESSION_TIMEOUT;
                    if (!isTimeout) {
                        setIsAuthenticated(true);
                    } else {
                        sessionStorage.removeItem('oe_admin_session');
                        sessionStorage.removeItem('oe_admin_last_activity');
                    }
                }
            } catch (e) {
                console.error("Auth session check error:", e);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
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
        if (Date.now() < lockoutUntil) return { success: false, message: "System Locked" };
        const res = await requestAuthCode(email);
        return res;
    };

    const verifyOtp = async (email: string, code: string) => {
        if (Date.now() < lockoutUntil) return false;

        const res = await verifyAuthCode(email, code);

        if (res.success) {
            setAttempts(0);
            setLockoutUntil(0);
            sessionStorage.setItem('oe_admin_session', res.token || 'valid');
            sessionStorage.setItem('oe_admin_last_activity', Date.now().toString());
            setIsAuthenticated(true);
            return true;
        } else {
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
