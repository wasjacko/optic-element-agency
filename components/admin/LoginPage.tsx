
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, Key } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const { requestOtp, verifyOtp, isLocked, lockoutTimeLeft } = useAuth();

    const [step, setStep] = useState<'EMAIL' | 'CODE'>('EMAIL');
    const [email, setEmail] = useState('webwacilait@gmail.com');
    const [code, setCode] = useState('');

    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked || isSubmitting) return;

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
                    setMessage("An access code has been sent to your email.");
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
            setMessage("Network error. Please try again.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center p-6 text-gray-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-lg mb-6 shadow-xl shadow-gray-200">
                        VM
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
                        {step === 'EMAIL' ? 'Welcome back' : 'Check your inbox'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isLocked
                            ? <span className="text-red-600 font-medium">System locked. Try again in {lockoutTimeLeft}s.</span>
                            : step === 'EMAIL'
                                ? 'Enter your email to access the admin panel.'
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
                    {(error || message) && (
                        <div className={`text-xs font-medium text-center p-3 rounded-lg ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLocked || isSubmitting}
                        className="w-full bg-gray-900 hover:bg-black text-white font-medium text-sm rounded-xl py-3.5 transition-all shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                {step === 'EMAIL' ? 'Send Code' : 'Verify & Login'}
                                {!isSubmitting && <ArrowRight size={16} />}
                            </>
                        )}
                    </button>

                    {step === 'CODE' && (
                        <button
                            type="button"
                            onClick={() => { setStep('EMAIL'); setError(false); setMessage(''); }}
                            className="w-full text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors py-2"
                        >
                            Use a different email
                        </button>
                    )}

                </form>

                <div className="mt-12 text-center border-t border-gray-100 pt-8">
                    <p className="text-xs text-gray-300 flex items-center justify-center gap-2">
                        <Lock size={12} />
                        Secure Admin Environment
                    </p>
                </div>

            </motion.div>
        </div>
    );
};
