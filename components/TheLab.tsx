import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Grid, Calendar as CalendarIcon, Clock, Check, ArrowRight } from 'lucide-react';
import { createBooking } from '../src/utils/booking-client';

const getOptimizedWixUrl = (url: string, isMobile: boolean) => {
    if (!url.includes('static.wixstatic.com')) return url;
    // Wix URL format: .../v1/fit/w_2000,h_2000,q_95/...
    const width = isMobile ? 800 : 1600;
    const quality = isMobile ? 80 : 90;
    return url.replace(/w_\d+,h_\d+,q_\d+/, `w_${width},h_${width},q_${quality}`);
};

const LAB_IMAGES = [
    "https://static.wixstatic.com/media/8fb0bb_bf5b3308eb7d475785f9fc1f1e4aeaa0~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_bf5b3308eb7d475785f9fc1f1e4aeaa0~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_d81cad432ff946868e06f9b908810d9f~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_d81cad432ff946868e06f9b908810d9f~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_1c7b6bb4f9c9471390d87965e1a0fe82~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_1c7b6bb4f9c9471390d87965e1a0fe82~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_0482a63adb7c47868131b9a3387c9178~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_0482a63adb7c47868131b9a3387c9178~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_c3edbc8b80074547bfa6cff52275c5ba~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_c3edbc8b80074547bfa6cff52275c5ba~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_23d7cd72ea1d45d183289753eed97699~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_23d7cd72ea1d45d183289753eed97699~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_c23b46b1f48642c4a1ed27dda41cd91e~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_c23b46b1f48642c4a1ed27dda41cd91e~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_a686a815dcf94fdb8fc0afbbccec169f~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_a686a815dcf94fdb8fc0afbbccec169f~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_bd4bd4c8f09240b8b5ecd27d7057fd40~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_bd4bd4c8f09240b8b5ecd27d7057fd40~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_b8cad9c058b94a8aa9f04749b8948c15~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_b8cad9c058b94a8aa9f04749b8948c15~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_bb86b17733344b4b930ef76776d32233~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_bb86b17733344b4b930ef76776d32233~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_055667fc06804e67903e407cd961817c~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_055667fc06804e67903e407cd961817c~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_ff155f9367ef4588a2b9880eee3220ec~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_ff155f9367ef4588a2b9880eee3220ec~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_950d3b289a3440f5b930749c00dd5852~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_950d3b289a3440f5b930749c00dd5852~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_6234ab8f71224241aa2119845e5a2f8f~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_6234ab8f71224241aa2119845e5a2f8f~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_07dd4197584d422b8463e861f7d888c3~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_07dd4197584d422b8463e861f7d888c3~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_77dea278b47b4fccbdc34859e302cf0b~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_77dea278b47b4fccbdc34859e302cf0b~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_8d75e5f7d33e4bf2a1ae267c6abeab3e~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_8d75e5f7d33e4bf2a1ae267c6abeab3e~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_3fc53239934e4ae39799ae139ea59b17~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_3fc53239934e4ae39799ae139ea59b17~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_f98569e5146f4ebb97ff9d826010c186~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_f98569e5146f4ebb97ff9d826010c186~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_37d71beee9114d2ba7ca167edb6cf1a8~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_37d71beee9114d2ba7ca167edb6cf1a8~mv2.jpg",
    "https://static.wixstatic.com/media/8fb0bb_1d6369c3b81e4a5d876fcf15233bd6d1~mv2.jpg/v1/fit/w_2000,h_2000,q_95/8fb0bb_1d6369c3b81e4a5d876fcf15233bd6d1~mv2.jpg"
];

const ALL_GALLERY_IMAGES = [...LAB_IMAGES];

interface TheLabProps {
    onContactClick: () => void;
}

type DurationOption = '2h' | '3h' | '4h' | 'Full Day';
const DURATION_OPTIONS: DurationOption[] = ['2h', '3h', '4h', 'Full Day'];
const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const TheLab: React.FC<TheLabProps & { data?: any }> = ({ onContactClick, data }) => {
    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Booking State
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedDuration, setSelectedDuration] = useState<DurationOption>('4h');
    const [selectedTime, setSelectedTime] = useState('10:00');

    // User Info State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    // Payment State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Calendar View State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedDates, setBookedDates] = useState<Date[]>([]);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // API Client
    // const { createBooking } = require('../src/utils/booking-client'); // Removed in favor of top-level import


    // Initialize Random Booked Dates
    useEffect(() => {
        const dates: Date[] = [];
        const today = new Date();
        // Generate random booked dates for next 3 months
        for (let i = 0; i < 15; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + Math.floor(Math.random() * 90));
            dates.push(d);
        }
        setBookedDates(dates);
    }, []);

    // Scroll to Top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    // --- Gallery Logic ---
    const openGallery = (index: number) => {
        setCurrentImageIndex(index);
        setIsGalleryOpen(true);
        document.body.style.overflow = 'hidden';
    };
    const closeGallery = () => {
        setIsGalleryOpen(false);
        document.body.style.overflow = '';
    };
    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % ALL_GALLERY_IMAGES.length);
    };
    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + ALL_GALLERY_IMAGES.length) % ALL_GALLERY_IMAGES.length);
    };
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeGallery();
        };
        if (isGalleryOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGalleryOpen]);


    // --- Booking Logic ---
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
        return { days, firstDay };
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentMonth(newDate);
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const isDateBooked = (date: Date) => {
        return bookedDates.some(d => isSameDay(d, date));
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !name || !email || !phone || !cardNumber || !expiry || !cvc) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        // Construct Start/End Dates
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const start = new Date(selectedDate);
        start.setHours(hours, minutes, 0, 0);

        const durationHours = selectedDuration === 'Full Day' ? 8 : parseInt(selectedDuration);
        const end = new Date(start);
        end.setHours(start.getHours() + durationHours);

        const res = await createBooking({
            name,
            email,
            phone,
            start: start.toISOString(),
            end: end.toISOString(),
            notes: message
        });

        setIsSubmitting(false);

        if (res.success) {
            setSubmitStatus('success');
            // Reset form
            setMessage('');
            setName('');
            setEmail('');
            setPhone('');
            setCardNumber('');
            setExpiry('');
            setCvc('');
            setSelectedDate(null);
        } else {
            console.error(res.message);
            setSubmitStatus('error');
        }
    };

    const { days, firstDay } = getDaysInMonth(currentMonth);

    // Calculate Price
    const getPrice = () => {
        const hours = selectedDuration === 'Full Day' ? 8 : parseInt(selectedDuration);
        return hours * 200;
    };

    return (
        <div className="relative min-h-screen font-sans bg-white overflow-x-hidden pt-24 md:pt-32 selection:bg-black selection:text-white">

            {/* LOGO IN TOP LEFT */}
            <div className="absolute top-16 left-8 md:top-20 md:left-16 z-20">
                <img
                    src="https://www.dropbox.com/scl/fi/l13guxf7gy7mllw5sf7mq/pl-black.png?rlkey=4alsl4nxr2rfcf3k4flarhlll&st=6c7rab4l&raw=1"
                    alt="Logo"
                    className="h-24 md:h-32 w-auto object-contain"
                />
            </div>

            {/* SECTION 1: HEADER */}
            <section className="relative pt-0 pb-0 bg-white">
                <div className="max-w-7xl mx-auto px-10 md:px-6 relative z-10 flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-4 md:mb-6 uppercase text-center">
                        {data?.title || "THE LAB"}
                    </h1>
                </div>
            </section>

            {/* SECTION 2: SHOWCASE GALLERY (Full Width) */}
            <section className="w-full h-[85vh] relative mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                    <div
                        className="relative w-full h-full overflow-hidden cursor-pointer group"
                        onClick={() => openGallery(0)}
                    >
                        <img
                            src={getOptimizedWixUrl(LAB_IMAGES[0], isMobile)}
                            alt="Main Studio"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                            loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-medium tracking-wide text-sm">Main Studio Floor</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 w-full h-full">
                        {LAB_IMAGES.slice(1, 4).map((img, idx) => (
                            <div
                                key={idx}
                                className="relative w-full h-full overflow-hidden cursor-pointer group"
                                onClick={() => openGallery(idx + 1)}
                            >
                                <img
                                    src={getOptimizedWixUrl(img, isMobile)}
                                    alt={`Studio Detail ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                        <div
                            className="relative w-full h-full bg-[#050505] cursor-pointer group flex flex-col items-center justify-center gap-3 overflow-hidden"
                            onClick={() => openGallery(4)}
                        >
                            <div className="absolute inset-0 opacity-40">
                                <img src={LAB_IMAGES[4]} className="w-full h-full object-cover grayscale blur-[2px] scale-110" alt="background" />
                            </div>
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
                            <div className="relative z-10 flex flex-col items-center">
                                <Grid className="text-white w-6 h-6 mb-2" strokeWidth={1.5} />
                                <span className="text-2xl md:text-3xl font-bold text-white tracking-tighter">+17</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">View Gallery</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating CTA */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
                    <button
                        onClick={() => {
                            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-white text-black px-10 py-4 font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl flex items-center gap-2"
                    >
                        Book The Lab <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* SECTION 3: LIGHT & CLEAN BOOKING SYSTEM (Left: Config | Right: Form) */}
            <section id="booking-section" className="bg-neutral-50 py-12 md:py-24 px-6 md:px-0">
                <div className="max-w-6xl mx-auto">

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">

                        {/* LEFT COLUMN: CONFIGURATION (Calendar + Time/Duration) */}
                        <div className="w-full lg:w-[45%] bg-white border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">

                            {/* 1. Calendar */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-black flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#FF5000]/10 flex items-center justify-center text-[#FF5000]">
                                            <CalendarIcon size={16} strokeWidth={2.5} />
                                        </div>
                                        Select Date
                                    </h2>
                                    <div className="flex bg-gray-50 rounded-full border border-gray-100 p-1">
                                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-full text-black transition-all">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="text-black font-medium min-w-[120px] flex items-center justify-center text-xs uppercase tracking-wider">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-full text-black transition-all">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100">
                                    {/* Days Header */}
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                        <div key={d} className="bg-white py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                                            {d}
                                        </div>
                                    ))}

                                    {/* Calendar Grid */}
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} className="bg-white h-10" />
                                    ))}
                                    {Array.from({ length: days }).map((_, i) => {
                                        const day = i + 1;
                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                                        const isToday = isSameDay(date, new Date());
                                        const isBooked = isDateBooked(date);
                                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                        const isUnavailable = isBooked || isPast;

                                        return (
                                            <button
                                                key={day}
                                                disabled={isUnavailable}
                                                onClick={(e) => { e.preventDefault(); if (!isUnavailable) setSelectedDate(date); }}
                                                className={`
                                                    relative w-full h-10 flex items-center justify-center text-sm font-medium transition-colors hover:z-10 rounded-full
                                                    ${isUnavailable
                                                        ? 'text-gray-300 bg-gray-50 cursor-not-allowed decoration-gray-300'
                                                        : isSelected
                                                            ? 'bg-black text-white ring-2 ring-black z-10 shadow-md'
                                                            : 'bg-white text-gray-600 hover:bg-[#FF5000] hover:text-white'}
                                                    ${isToday && !isSelected && !isUnavailable ? 'text-[#FF5000] font-bold' : ''}
                                                `}
                                            >
                                                {day}
                                                {isUnavailable && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="w-[120%] h-px bg-gray-200 rotate-45 transform origin-center" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100" />

                            {/* 2. Duration Only */}
                            <div className="p-6 pt-0 space-y-4">
                                {/* Duration + Time */}
                                <div className="space-y-6">
                                    {/* Duration */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Duration</label>
                                            <span className="text-xs font-bold text-[#FF5000] uppercase tracking-widest">$200 / Hour</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {DURATION_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setSelectedDuration(opt)}
                                                    className={`
                                                    px-4 py-2 rounded-full text-xs font-medium transition-all border
                                                    ${selectedDuration === opt
                                                            ? 'bg-black text-white border-black shadow-md'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-black'}
                                                `}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-gray-400 italic mt-1">* 2-hour minimum booking required.</p>
                                    </div>

                                    {/* Time */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Start Time</label>
                                        <div className="flex flex-wrap gap-2">
                                            {TIME_SLOTS.map((time) => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`
                                                    px-4 py-2 rounded-full text-xs font-medium transition-all border
                                                    ${selectedTime === time
                                                            ? 'bg-black text-white border-black shadow-md'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-black'}
                                                `}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: DETAILS & ACTION */}
                        <div className="w-full lg:w-[55%] p-8 lg:p-12 flex flex-col bg-white">
                            <form onSubmit={handleBookingSubmit} className="flex-1 flex flex-col h-full">

                                <div className="space-y-2 mb-6">
                                    <h3 className="text-2xl font-bold text-black">{data?.bookingTitle || "Project Details"}</h3>
                                    <p className="text-gray-500 text-sm">{data?.bookingSubtitle || "Tell us about your shoot requirements."}</p>
                                </div>

                                {/* User Details Inputs */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 border-0 rounded-xl px-6 py-4 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-50 border-0 rounded-xl px-6 py-4 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-gray-50 border-0 rounded-xl px-6 py-4 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-3 mb-6">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us about your project/shoot requirements..."
                                        className="w-full h-32 bg-gray-50 border-0 rounded-2xl p-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none resize-none transition-all text-sm"
                                    />
                                </div>

                                {/* Payment Details (UI ONLY) */}
                                <div className="space-y-3 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4 flex items-center justify-between">
                                        <span>Payment Details</span>
                                        <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">Secure (Test Mode)</span>
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Card Number */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Card Number"
                                                required
                                                value={cardNumber}
                                                onChange={(e) => {
                                                    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                                    const parts = [];
                                                    for (let i = 0; i < v.length; i += 4) {
                                                        parts.push(v.substring(i, i + 4));
                                                    }
                                                    if (parts.length) {
                                                        setCardNumber(parts.join(' '));
                                                    } else {
                                                        setCardNumber(v);
                                                    }
                                                }}
                                                maxLength={19}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-6 py-3 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm font-mono"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                required
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-6 py-3 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm font-mono"
                                                maxLength={5}
                                            />
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                required
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-6 py-3 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm font-mono"
                                                maxLength={3}
                                            />
                                        </div>
                                    </div>
                                </div>


                                {submitStatus === 'success' && (
                                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-center text-sm font-medium flex flex-col items-center">
                                        <Check className="mb-2" />
                                        Request sent successfully! We will contact you shortly to confirm details.
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-center text-sm font-medium">
                                        Something went wrong. Please try again or contact us directly.
                                    </div>
                                )}

                                {/* Action */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="text-left w-full sm:w-auto">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Total Estimated</div>
                                            <div className="text-black font-bold text-2xl leading-tight">
                                                ${getPrice()}
                                            </div>
                                            <div className="text-[#FF5000] text-sm font-medium">
                                                {selectedDuration} @ $200/hr
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!selectedDate || isSubmitting || !name || !email || !cardNumber}
                                            className="relative group bg-black hover:bg-[#111] disabled:bg-gray-200 disabled:pointer-events-none text-white px-12 md:px-8 py-5 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold tracking-widest uppercase">
                                                    {isSubmitting ? 'Processing...' : 'Book & Pay Deposit'}
                                                </span>
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL SLIDER */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
                        onClick={closeGallery}
                    >
                        <div
                            className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={getOptimizedWixUrl(ALL_GALLERY_IMAGES[currentImageIndex], isMobile)}
                                    alt="Gallery preview"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                                />
                            </AnimatePresence>
                            <button onClick={closeGallery} className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all group">
                                <span className="text-xs font-bold tracking-widest uppercase hidden md:block group-hover:pr-2 transition-all">Close</span>
                                <X size={20} />
                            </button>
                            <button onClick={prevImage} className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-[#FF5000] hover:bg-white/10 rounded-full transition-all">
                                <ChevronLeft size={40} />
                            </button>
                            <button onClick={nextImage} className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-[#FF5000] hover:bg-white/10 rounded-full transition-all">
                                <ChevronRight size={40} />
                            </button>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 font-mono text-sm tracking-widest">
                                {currentImageIndex + 1} / {ALL_GALLERY_IMAGES.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
