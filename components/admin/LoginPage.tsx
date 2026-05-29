
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, Key, CheckCircle2, Timer } from 'lucide-react';

const OTP_COOLDOWN = 30; // seconds

export const LoginPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { requestOtp, verifyOtp, isLocked, lockoutTimeLeft } = useAuth();

    const [step, setStep] = useState<'EMAIL' | 'CODE'>('EMAIL');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cooldown state
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Cleanup cooldown interval
    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    const startCooldown = () => {
        setCooldown(OTP_COOLDOWN);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    if (cooldownRef.current) clearInterval(cooldownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked || isSubmitting) return;

        // Block if cooldown is active (only for EMAIL step)
        if (step === 'EMAIL' && cooldown > 0) return;

        setIsSubmitting(true);
        setError(false);
        setMessage('');

        try {
            if (step === 'EMAIL') {
                if (!email) {
                    setError(true);
                    setMessage("Please enter your email.");
                    setIsSubmitting(false);
                    return;
                }

                const res = await requestOtp(email);
                if (res.success) {
                    setStep('CODE');
                    if (res.devOtpCode) {
                        setMessage(`✓ Code sent. [Dev mode OTP: ${res.devOtpCode}]`);
                        setCode(res.devOtpCode);
                        console.log(`[DEV ONLY] OTP Code: ${res.devOtpCode}`);
                    } else {
                        setMessage("✓ Code sent — check your inbox.");
                    }
                    startCooldown();
                } else {
                    setError(true);
                    setMessage(res.message || "Failed to send code.");
                }
            } else {
                if (!code || code.length < 6) {
                    setError(true);
                    setMessage("Please enter the 6-digit code.");
                    setIsSubmitting(false);
                    return;
                }

                const success = await verifyOtp(email, code);
                if (!success) {
                    setError(true);
                    setMessage("Invalid or expired code.");
                    setCode('');
                }
            }
        } catch (e) {
            setError(true);
            setMessage("Connection error — server unreachable.");
        }

        setIsSubmitting(false);
    };

    const handleResendCode = async () => {
        if (cooldown > 0 || isSubmitting || isLocked) return;

        setIsSubmitting(true);
        setError(false);
        setMessage('');

        try {
            const res = await requestOtp(email);
            if (res.success) {
                if (res.devOtpCode) {
                    setMessage(`✓ New code sent. [Dev mode OTP: ${res.devOtpCode}]`);
                    setCode(res.devOtpCode);
                } else {
                    setMessage("✓ New code sent — check your inbox.");
                }
                startCooldown();
            } else {
                setError(true);
                setMessage(res.message || "Failed to resend code.");
            }
        } catch (e) {
            setError(true);
            setMessage("Connection error — server unreachable.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="admin-theme min-h-screen w-full bg-white flex items-center justify-center p-6 text-gray-900">
            <style>{`
                @font-face {
                    font-family: 'CustomArial';
                    src: url('/assets/ArialCE.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
                .admin-theme * {
                    font-family: 'CustomArial', sans-serif !important;
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <svg viewBox="0 0 100 100" className="w-14 h-14 mx-auto mb-6 drop-shadow-sm" fill="none">
                        <path d="M0 0H30V10H10V30H0V0Z" fill="#111827" />
                        <path d="M70 0H100V30H90V10H70V0Z" fill="#111827" />
                        <path d="M100 70V100H70V90H90V70H100Z" fill="#111827" />
                        <path d="M30 100H0V70H10V90H30V100Z" fill="#111827" />
                        <path d="M44 32H56V44H68V56H56V68H44V56H32V44H44V32Z" fill="#EF5304" />
                    </svg>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
                        {step === 'EMAIL' ? 'Configurator Access' : 'Check your inbox'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isLocked
                            ? <span className="text-red-600 font-medium">System locked. Try again in {lockoutTimeLeft}s.</span>
                            : step === 'EMAIL'
                                ? 'Enter your email to access the site configurator.'
                                : `We've sent a 6-digit code to ${email}.`
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-4">
                        {step === 'EMAIL' ? (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 pl-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(false); }}
                                        disabled={isLocked || isSubmitting}
                                        placeholder="name@example.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 transition-all disabled:opacity-50"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 pl-1">Verification Code</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => { setCode(e.target.value); setError(false); }}
                                        disabled={isLocked || isSubmitting}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-lg tracking-widest text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 transition-all disabled:opacity-50 text-center"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Message */}
                    <AnimatePresence mode="wait">
                        {(error || message) && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className={`text-xs font-medium text-center p-3 rounded-lg flex items-center justify-center gap-2 ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}
                            >
                                {!error && <CheckCircle2 size={14} />}
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isLocked || isSubmitting || (step === 'EMAIL' && cooldown > 0)}
                        className="w-full bg-gray-900 hover:bg-black text-white font-medium text-sm rounded-xl py-3.5 transition-all shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                {step === 'EMAIL'
                                    ? (cooldown > 0 ? `Wait ${cooldown}s` : 'Send Code')
                                    : 'Verify & Login'
                                }
                                {!isSubmitting && cooldown === 0 && <ArrowRight size={16} />}
                                {cooldown > 0 && step === 'EMAIL' && <Timer size={14} />}
                            </>
                        )}
                    </button>

                    {step === 'CODE' && (
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => { setStep('EMAIL'); setError(false); setMessage(''); setCooldown(0); if (cooldownRef.current) clearInterval(cooldownRef.current); }}
                                className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors py-2"
                            >
                                ← Different email
                            </button>
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={cooldown > 0 || isSubmitting || isLocked}
                                className="text-xs font-medium transition-colors py-2 disabled:cursor-not-allowed"
                                style={{ color: cooldown > 0 ? '#9ca3af' : '#EF5304' }}
                            >
                                {cooldown > 0 ? (
                                    <span className="flex items-center gap-1">
                                        <Timer size={12} />
                                        Resend in {cooldown}s
                                    </span>
                                ) : (
                                    'Resend code'
                                )}
                            </button>
                        </div>
                    )}

                </form>

                <div className="mt-12 text-center border-t border-gray-100 pt-8 flex flex-col items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
                    >
                        ← Back to Website
                    </button>
                    <p className="text-xs text-gray-300 flex items-center justify-center gap-2">
                        <Lock size={12} />
                        Secure Admin Environment
                    </p>
                </div>

            </motion.div>
        </div>
    );
};
