import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { toZonedTime, format } from 'date-fns-tz';
import { addDays, isBefore, isAfter, differenceInMinutes, getDay, getMinutes, getHours, startOfDay } from 'date-fns';

const PARIS_TZ = 'Europe/Paris';

// --- JWT Utils ---
export const generateActionToken = (bookingId: string) => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
    return jwt.sign({ bookingId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyActionToken = (token: string): { bookingId: string } | null => {
    try {
        if (!process.env.JWT_SECRET) return null;
        return jwt.verify(token, process.env.JWT_SECRET) as { bookingId: string };
    } catch (e) {
        return null;
    }
};

// --- Validation Utils ---

// Helper to convert UTC input to Paris time for validation
const getParisTime = (date: Date) => toZonedTime(date, PARIS_TZ);

export const bookingSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    start: z.string().datetime(),
    end: z.string().datetime(),
    notes: z.string().optional().transform(val => val?.slice(0, 500)), // Sanitize length
    _gotcha: z.string().optional() // Honeypot
}).superRefine((data, ctx) => {
    const start = new Date(data.start);
    const end = new Date(data.end);
    const now = new Date();

    // 1. Basic Timing
    if (!isBefore(start, end)) {
        ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['end'] });
        return;
    }

    // 2. Future only
    if (isBefore(start, now)) {
        ctx.addIssue({ code: 'custom', message: 'Booking must be in the future', path: ['start'] });
        return;
    }

    // 3. Max window (90 days)
    if (isAfter(start, addDays(now, 90))) {
        ctx.addIssue({ code: 'custom', message: 'Cannot book more than 90 days in advance', path: ['start'] });
    }

    // 4. Minimum Duration (1 hour)
    if (differenceInMinutes(end, start) < 60) {
        ctx.addIssue({ code: 'custom', message: 'Minimum booking duration is 1 hour', path: ['end'] });
    }

    // 5. 30 Minutes Step
    if (getMinutes(start) % 30 !== 0 || getMinutes(end) % 30 !== 0) {
        ctx.addIssue({ code: 'custom', message: 'Time must be in 30-minute increments', path: ['start'] });
    }

    // 6. Business Hours (09:00 - 20:00 Paris) & Days
    const startParis = getParisTime(start);
    const endParis = getParisTime(end);

    const startHour = getHours(startParis);
    const endHour = getHours(endParis);
    const endMinutes = getMinutes(endParis);

    // Check if Sunday (0 is Sunday in date-fns)
    if (getDay(startParis) === 0) {
        ctx.addIssue({ code: 'custom', message: 'Studio is closed on Sundays', path: ['start'] });
    }

    // Open 09:00
    if (startHour < 9) {
        ctx.addIssue({ code: 'custom', message: 'Studio opens at 09:00 Paris time', path: ['start'] });
    }

    // Close 20:00 (End time strictly <= 20:00)
    // Logic: if Hour > 20, invalid. If Hour == 20, minutes must be 0.
    if (endHour > 20 || (endHour === 20 && endMinutes > 0)) {
        ctx.addIssue({ code: 'custom', message: 'Studio closes at 20:00 Paris time', path: ['end'] });
    }
});
