import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingFormProps {
    accentColor?: string;
    textColor?: string;
}

const API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001/api";

export const BookingForm: React.FC<BookingFormProps> = ({ accentColor = '#EF5304', textColor = '#000000' }) => {
    const [step, setStep] = useState<'date' | 'time' | 'details' | 'success'>('date');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [busySlots, setBusySlots] = useState<{ start: string, end: string }[]>([]);

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Fetch availability when month changes
    useEffect(() => {
        const fetchAvailability = async () => {
            // Simply fetch all busy slots for the month
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString();

            try {
                const res = await fetch(`${API_URL}/bookings/availability?from=${startOfMonth}&to=${endOfMonth}`);
                if (res.ok) {
                    const data = await res.json();
                    setBusySlots(data.busy || []);
                }
            } catch (e) {
                console.error("Failed to fetch availability", e);
            }
        };
        fetchAvailability();
    }, [currentMonth]);

    const handleDateSelect = (date: Date) => {
        // Prevent selecting past dates
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;

        setSelectedDate(date);
        setStep('time');
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setStep('details');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) return;

        setLoading(true);

        // Construct start/end dates
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const start = new Date(selectedDate);
        start.setHours(hours, minutes, 0, 0);

        // Default 2 hour slot for now
        const end = new Date(start);
        end.setHours(hours + 2, minutes, 0, 0);

        try {
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    start: start.toISOString(),
                    end: end.toISOString()
                })
            });

            if (res.ok) {
                setStep('success');
            } else {
                alert("Booking failed. This slot might be taken.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    };

    // Calendar Helpers
    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

    const Checkmark = () => (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 mx-auto"
        >
            <CheckCircle size={40} />
        </motion.div>
    );

    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    return (
        <div className="w-full h-full bg-white flex flex-col p-8 md:p-12 font-sans relative overflow-hidden">
            {/* Progress Bar (Optional) */}
            <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
                <motion.div
                    className="h-full bg-black"
                    initial={{ width: '25%' }}
                    animate={{ width: step === 'date' ? '25%' : step === 'time' ? '50%' : step === 'details' ? '75%' : '100%' }}
                    style={{ backgroundColor: accentColor }}
                />
            </div>

            {step !== 'success' && (
                <div className="flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span className={step === 'date' ? 'text-black' : ''}>1. Date</span>
                    <span>/</span>
                    <span className={step === 'time' ? 'text-black' : ''}>2. Time</span>
                    <span>/</span>
                    <span className={step === 'details' ? 'text-black' : ''}>3. Info</span>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'date' && (
                    <motion.div
                        key="date"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ color: textColor }}>Select a Date</h2>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        <div className="text-center font-bold mb-4 uppercase tracking-widest text-sm text-gray-500">
                            {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-center text-xs font-bold text-gray-300 uppercase">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: firstDayOfMonth(currentMonth) }).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                                const day = i + 1;
                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                const isSelected = selectedDate?.toDateString() === date.toDateString();

                                return (
                                    <button
                                        key={day}
                                        disabled={isPast}
                                        onClick={() => handleDateSelect(date)}
                                        className={`
                                            aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all
                                            ${isSelected ? 'text-white shadow-lg scale-110' : 'hover:bg-gray-100 text-gray-700'}
                                            ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                                        `}
                                        style={{ backgroundColor: isSelected ? accentColor : undefined }}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {step === 'time' && (
                    <motion.div
                        key="time"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        <button onClick={() => setStep('date')} className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black">
                            <ChevronLeft size={14} /> Back
                        </button>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2" style={{ color: textColor }}>Select a Time</h2>
                        <p className="text-gray-500 text-sm mb-8">For {selectedDate?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className="py-4 border border-gray-200 rounded-lg text-sm font-bold hover:border-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Clock size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                                    {time}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'details' && (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        <button onClick={() => setStep('time')} className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black">
                            <ChevronLeft size={14} /> Back
                        </button>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8" style={{ color: textColor }}>Your Details</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-1 focus:border-black outline-none transition-all"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required type="email"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-1 focus:border-black outline-none transition-all"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required type="tel"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-1 focus:border-black outline-none transition-all"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 py-4 rounded-lg text-white font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                style={{ backgroundColor: accentColor }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center py-12"
                    >
                        <Checkmark />
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ color: textColor }}>Booking Confirmed!</h2>
                        <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                            We have received your booking request for {selectedDate?.toLocaleDateString()} at {selectedTime}. You will receive a confirmation email shortly.
                        </p>
                        <button
                            onClick={() => { setStep('date'); setSelectedDate(null); setSelectedTime(null); setFormData({ name: '', email: '', phone: '', notes: '' }); }}
                            className="bg-gray-100 hover:bg-gray-200 text-black px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Book Another
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
