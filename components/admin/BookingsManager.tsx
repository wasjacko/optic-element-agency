import React, { useState, useEffect } from 'react';
import { getAdminBookings, updateBookingStatus, createBooking, Booking } from '../../src/utils/booking-client';
import {
    Calendar as CalendarIcon,
    List,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Plus,
    Mail,
    Phone,
    FileText,
    X,
    Check,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookingsManager: React.FC = () => {
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Modal State
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Booking Form State
    const [newBooking, setNewBooking] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '10:00',
        duration: '4h',
        notes: 'Manual Admin Booking'
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setIsLoading(true);
        const data = await getAdminBookings();
        setBookings(data);
        setIsLoading(false);
    };

    // --- Actions ---

    const handleStatusUpdate = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
        setActionLoading(id);
        const res = await updateBookingStatus(id, status);
        if (res.success) {
            await loadBookings();
            if (selectedBooking && selectedBooking.id === id) {
                // Update local selected state to reflect change immediately in modal
                setSelectedBooking(prev => prev ? { ...prev, status } : null);
            }
        } else {
            alert("Failed to update status: " + res.message);
        }
        setActionLoading(null);
    };

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const [hours, minutes] = newBooking.time.split(':').map(Number);
        const start = new Date(newBooking.date);
        start.setHours(hours, minutes, 0, 0);

        const durationHours = newBooking.duration === 'Full Day' ? 8 : parseInt(newBooking.duration);
        const end = new Date(start);
        end.setHours(start.getHours() + durationHours);

        const res = await createBooking({
            name: newBooking.name,
            email: newBooking.email,
            phone: newBooking.phone,
            start: start.toISOString(),
            end: end.toISOString(),
            notes: newBooking.notes
        });

        setIsCreating(false);

        if (res.success) {
            setShowAddModal(false);
            setNewBooking({ name: '', email: '', phone: '', date: '', time: '10:00', duration: '4h', notes: 'Manual Admin Booking' });
            await loadBookings();
        } else {
            alert("Failed to create booking: " + res.message);
        }
    };

    // --- Helpers ---

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-500/20"><CheckCircle size={10} /> Confirmed</span>
            case 'CANCELLED': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-500/20"><XCircle size={10} /> Cancelled</span>
            default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20"><Clock size={10} /> Pending</span>
        }
    }

    // --- Views ---

    const CalendarView = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const days = Array.from({ length: totalDays }, (_, i) => i + 1);
        const blanks = Array.from({ length: startDay }, (_, i) => i);

        const bookingsByDay: Record<number, Booking[]> = {};
        bookings.forEach(b => {
            const d = new Date(b.start);
            if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
                const day = d.getDate();
                if (!bookingsByDay[day]) bookingsByDay[day] = [];
                bookingsByDay[day].push(b);
            }
        });

        return (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden h-full flex flex-col animate-in fade-in duration-300">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold uppercase tracking-tight">
                            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-1">
                            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b bg-gray-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">{d}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1 min-h-[500px] bg-gray-50/10">
                    {blanks.map(i => <div key={`blank-${i}`} className="border-b border-r bg-gray-50/30" />)}
                    {days.map(day => {
                        const daysBookings = bookingsByDay[day] || [];
                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div key={day} className={`border-b border-r p-2 relative group min-h-[100px] transition-colors ${isToday ? 'bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                                <span className={`text-xs font-bold mb-2 block ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>{day}</span>
                                <div className="space-y-1">
                                    {daysBookings.map(booking => (
                                        <button
                                            key={booking.id}
                                            onClick={() => { setSelectedBooking(booking); setIsDetailOpen(true); }}
                                            className={`w-full text-left p-1.5 rounded text-[10px] font-semibold truncate transition-all hover:scale-[1.02] active:scale-95 border ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-800 border-green-100' :
                                                    booking.status === 'CANCELLED' ? 'bg-gray-50 text-gray-400 border-gray-100 line-through' :
                                                        'bg-yellow-50 text-yellow-800 border-yellow-100'
                                                }`}
                                        >
                                            {new Date(booking.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {booking.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const ListView = () => (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-9 pr-4 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-mono text-[11px] uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Client</th>
                        <th className="px-6 py-4 font-semibold">Date & Time</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {bookings.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No bookings found.</td>
                        </tr>
                    ) : bookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{booking.name}</div>
                                <div className="text-xs text-gray-400 flex flex-col gap-0.5 mt-0.5">
                                    <span>{booking.email}</span>
                                    <span>{booking.phone}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                <div className="font-medium">{new Date(booking.start).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    {new Date(booking.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                    {new Date(booking.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {getStatusBadge(booking.status)}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => { setSelectedBooking(booking); setIsDetailOpen(true); }}
                                    className="text-xs font-bold uppercase tracking-wider hover:underline"
                                >
                                    Manage
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-gray-300 gap-2">
                <Loader2 size={32} className="animate-spin text-black" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading Calendar...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Bookings</h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">Manage studio reservations</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setView('calendar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'calendar' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            <CalendarIcon size={16} /> Calendar
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'list' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            <List size={16} /> List
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-black/20"
                    >
                        <Plus size={16} /> New Booking
                    </button>
                </div>
            </div>

            {/* Content */}
            {view === 'calendar' ? <CalendarView /> : <ListView />}

            {/* Modals placed here for cleaner DOM */}
            <AnimatePresence>
                {/* 1. View / Edit Details Modal */}
                {isDetailOpen && selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b flex items-start justify-between bg-gray-50">
                                <div>
                                    <h3 className="text-xl font-bold uppercase tracking-tight text-gray-900">{selectedBooking.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                        <CalendarIcon size={14} />
                                        {new Date(selectedBooking.start).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status Actions */}
                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Status</span>
                                        {getStatusBadge(selectedBooking.status)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {selectedBooking.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                                                    disabled={!!actionLoading}
                                                    className="flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md text-xs font-bold uppercase hover:bg-green-600 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === selectedBooking.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                                                    disabled={!!actionLoading}
                                                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2 rounded-md text-xs font-bold uppercase hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === selectedBooking.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {selectedBooking.status === 'CONFIRMED' && (
                                            <button
                                                onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                                                disabled={!!actionLoading}
                                                className="col-span-2 flex items-center justify-center gap-2 bg-white border border-red-100 text-red-600 py-2 rounded-md text-xs font-bold uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === selectedBooking.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Mail size={14} />
                                            </div>
                                            <a href={`mailto:${selectedBooking.email}`} className="font-medium text-gray-700 hover:text-black hover:underline">{selectedBooking.email}</a>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Phone size={14} />
                                            </div>
                                            <a href={`tel:${selectedBooking.phone}`} className="font-medium text-gray-700 hover:text-black hover:underline">{selectedBooking.phone}</a>
                                        </div>
                                    </div>
                                </div>

                                {selectedBooking.notes && (
                                    <div className="space-y-2 pt-4 border-t">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notes</h4>
                                        <p className="text-sm text-gray-600 italic bg-yellow-50/50 p-3 rounded-md border border-yellow-100">
                                            "{selectedBooking.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* 2. Create Booking Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="font-bold text-gray-900">New Booking</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Client Info</label>
                                        <input
                                            type="text"
                                            placeholder="Client Name"
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all mb-2"
                                            value={newBooking.name}
                                            onChange={e => setNewBooking({ ...newBooking, name: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                                                value={newBooking.email}
                                                onChange={e => setNewBooking({ ...newBooking, email: e.target.value })}
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                                                value={newBooking.phone}
                                                onChange={e => setNewBooking({ ...newBooking, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reservation Details</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all mb-2"
                                            value={newBooking.date}
                                            onChange={e => setNewBooking({ ...newBooking, date: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                                                value={newBooking.time}
                                                onChange={e => setNewBooking({ ...newBooking, time: e.target.value })}
                                            >
                                                <option value="09:00">09:00 AM</option>
                                                <option value="10:00">10:00 AM</option>
                                                <option value="11:00">11:00 AM</option>
                                                <option value="13:00">01:00 PM</option>
                                                <option value="14:00">02:00 PM</option>
                                                <option value="15:00">03:00 PM</option>
                                            </select>
                                            <select
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                                                value={newBooking.duration}
                                                onChange={e => setNewBooking({ ...newBooking, duration: e.target.value })}
                                            >
                                                <option value="2h">2 Hours</option>
                                                <option value="4h">4 Hours (Half Day)</option>
                                                <option value="Full Day">Full Day (8h)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="flex-1 bg-black text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isCreating ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                        Create Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
