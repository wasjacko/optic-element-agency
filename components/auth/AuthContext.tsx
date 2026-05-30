
import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestAuthCode, verifyAuthCode, setInMemoryToken } from '../../src/utils/auth-client';

interface AuthContextType {
    isAuthenticated: boolean;
    requestOtp: (email: string) => Promise<{ success: boolean; message?: string; devOtpCode?: string }>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
            setInMemoryToken(res.token || 'valid');
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
        setInMemoryToken(null);
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
