import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Grid, Calendar as CalendarIcon, Clock, Check, ArrowRight } from 'lucide-react';

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

type DurationOption = '1h' | '2h' | '3h' | '4h' | 'Full Day';
const DURATION_OPTIONS: DurationOption[] = ['1h', '2h', '3h', '4h', 'Full Day'];
const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const TheLab: React.FC<TheLabProps> = ({ onContactClick }) => {
    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Booking State
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedDuration, setSelectedDuration] = useState<DurationOption>('4h');
    const [selectedTime, setSelectedTime] = useState('10:00');
    const [message, setMessage] = useState('');

    // Calendar View State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedDates, setBookedDates] = useState<Date[]>([]);

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

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedDate = selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No Date Selected';

        const subject = `Studio Booking Request - ${formattedDate}`;
        const body = `
BOOKING REQUEST
---------------
Date: ${formattedDate}
Duration: ${selectedDuration}

Message:
${message}
        `.trim();
        window.location.href = `mailto:contact@opticelement.agency?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const { days, firstDay } = getDaysInMonth(currentMonth);

    return (
        <div className="min-h-screen font-sans bg-white overflow-x-hidden pt-24 selection:bg-black selection:text-white">

            {/* SECTION 1: HEADER */}
            <section className="relative pt-24 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-12 uppercase text-center">
                        THE LAB
                    </h1>
                </div>
            </section>

            {/* SECTION 2: SHOWCASE GALLERY */}
            {/* SECTION 2: SHOWCASE GALLERY (Full Width) */}
            <section className="w-full h-[85vh] relative">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                    <div
                        className="relative w-full h-full overflow-hidden cursor-pointer group"
                        onClick={() => openGallery(0)}
                    >
                        <img
                            src={LAB_IMAGES[0]}
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
                                    src={img}
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
            {/* SECTION 3: LIGHT & CLEAN BOOKING SYSTEM (Left: Config | Right: Form) */}
            <section id="booking-section" className="bg-neutral-50 py-24 px-6 md:px-0">
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
                                {/* Duration */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Duration</label>
                                    <div className="flex flex-wrap gap-2">
                                        {DURATION_OPTIONS.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setSelectedDuration(opt)}
                                                className={`
                                                    px-5 py-2.5 rounded-full text-xs font-medium transition-all border
                                                    ${selectedDuration === opt
                                                        ? 'bg-black text-white border-black shadow-md'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-black'}
                                                `}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: DETAILS & ACTION */}
                        <div className="w-full lg:w-[55%] p-8 lg:p-12 flex flex-col bg-white">
                            <form onSubmit={handleBookingSubmit} className="flex-1 flex flex-col h-full">

                                <div className="space-y-2 mb-6">
                                    <h3 className="text-2xl font-bold text-black">Project Details</h3>
                                    <p className="text-gray-500 text-sm">Tell us about your shoot requirements.</p>
                                </div>

                                {/* Message */}
                                <div className="space-y-3 flex-1 min-h-[200px] mb-8">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full h-full bg-gray-50 border-0 rounded-2xl p-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 outline-none resize-none transition-all text-base"
                                    />
                                </div>

                                {/* Action */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="text-left w-full sm:w-auto">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Summary</div>
                                            <div className="text-black font-medium text-lg leading-tight">
                                                {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Select Date'}
                                            </div>
                                            <div className="text-[#FF5000] text-sm font-medium">
                                                {selectedDuration}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!selectedDate}
                                            className="relative group bg-black hover:bg-[#111] disabled:bg-gray-200 disabled:pointer-events-none text-white px-10 py-5 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold tracking-widest uppercase">Send The Request</span>
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
                                    src={ALL_GALLERY_IMAGES[currentImageIndex]}
                                    alt="Gallery"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-full max-h-full object-contain rounded-sm"
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
