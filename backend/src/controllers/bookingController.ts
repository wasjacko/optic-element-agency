import { Request, Response } from 'express';
import prisma from '../db';
import { bookingSchema, generateActionToken, verifyActionToken } from '../utils';
import { sendAdminRequestEmail, sendClientPendingEmail, sendClientConfirmationEmail, sendClientCancellationEmail } from '../services/email';
import { subMinutes } from 'date-fns';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Validate Input
        const result = bookingSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Validation failed', details: result.error.errors });
            return;
        }

        // Honeypot check
        if (req.body._gotcha) {
            // Silently fail or return success to bot
            res.status(201).json({ message: 'Request received' });
            return;
        }

        const { name, email, phone, start, end, notes } = result.data;
        const startDate = new Date(start);
        const endDate = new Date(end);

        // 2. Transactional Overlap Check & Creation
        const newBooking = await prisma.$transaction(async (tx) => {
            // Logic: Overlap if (start < existingEnd) AND (end > existingStart)
            // And Status is CONFIRMED or PENDING (valid for 30m)

            const validPendingThreshold = subMinutes(new Date(), 30);

            const collision = await tx.booking.findFirst({
                where: {
                    AND: [
                        {
                            OR: [
                                { status: 'CONFIRMED' },
                                {
                                    AND: [
                                        { status: 'PENDING' },
                                        { createdAt: { gt: validPendingThreshold } }
                                    ]
                                }
                            ]
                        },
                        {
                            start: { lt: endDate },
                            end: { gt: startDate }
                        }
                    ]
                }
            });

            if (collision) {
                throw new Error('SLOT_OCCUPIED');
            }

            return tx.booking.create({
                data: {
                    name,
                    email,
                    phone,
                    start: startDate,
                    end: endDate,
                    notes,
                    status: 'PENDING'
                }
            });
        });

        // 3. Post-Creation Actions (Async)
        const token = generateActionToken(newBooking.id);

        // Send Emails (don't await to keep response fast, or await if critical)
        await Promise.all([
            sendAdminRequestEmail(newBooking, token),
            sendClientPendingEmail(newBooking)
        ]);

        res.status(201).json({
            bookingId: newBooking.id,
            status: 'PENDING',
            message: 'Booking request created'
        });

    } catch (error: any) {
        if (error.message === 'SLOT_OCCUPIED') {
            res.status(409).json({ error: 'Selected slot is no longer available' });
            return;
        }
        console.error('Create Booking Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            res.status(400).json({ error: 'Missing from or to parameters' });
            return;
        }

        const fromDate = new Date(from as string);
        const toDate = new Date(to as string);
        const validPendingThreshold = subMinutes(new Date(), 30);

        const busySlots = await prisma.booking.findMany({
            where: {
                start: { gte: fromDate, lt: toDate },
                OR: [
                    { status: 'CONFIRMED' },
                    {
                        AND: [
                            { status: 'PENDING' },
                            { createdAt: { gt: validPendingThreshold } }
                        ]
                    }
                ]
            },
            select: {
                start: true,
                end: true,
                status: true
            }
        });

        res.json({ busy: busySlots });
    } catch (error) {
        console.error('Get Availability Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const confirmBooking = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        res.status(400).send('Invalid token');
        return;
    }

    const payload = verifyActionToken(token);
    if (!payload) {
        res.status(403).send('Invalid or expired token');
        return;
    }

    try {
        const booking = await prisma.booking.findUnique({ where: { id: payload.bookingId } });
        if (!booking) {
            res.status(404).send('Booking not found');
            return;
        }

        if (booking.status === 'CANCELLED') {
            res.send(`<h1>Action Impossible</h1><p>Cette réservation a déjà été annulée.</p>`);
            return;
        }

        if (booking.status === 'CONFIRMED') {
            res.send(`<h1>Déjà Confirmé</h1><p>Cette réservation est déjà confirmée.</p>`);
            return;
        }

        // Optional: Re-check overlap here for strict correctness, but usually optional for admin override
        // We assume admin wins.

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'CONFIRMED' }
        });

        await sendClientConfirmationEmail(updated);

        res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: green;">Confirmation Réussie</h1>
        <p>Le client a été notifié.</p>
      </div>
    `);
    } catch (error) {
        console.error('Confirm Error:', error);
        res.status(500).send('Server Error');
    }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        res.status(400).send('Invalid token');
        return;
    }

    const payload = verifyActionToken(token);
    if (!payload) {
        res.status(403).send('Invalid or expired token');
        return;
    }

    try {
        const booking = await prisma.booking.findUnique({ where: { id: payload.bookingId } });
        if (!booking) {
            res.status(404).send('Booking not found');
            return;
        }

        // Idempotency: if already cancelled
        if (booking.status === 'CANCELLED') {
            res.send(`<h1>Déjà Annulé</h1><p>Cette réservation est déjà annulée.</p>`);
            return;
        }

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'CANCELLED' }
        });

        await sendClientCancellationEmail(updated);

        res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: red;">Réservation Annulée</h1>
        <p>Le client a été notifié.</p>
      </div>
    `);
    } catch (error) {
        console.error('Cancel Error:', error);
        res.status(500).send('Server Error');
    }
};

// ADMIN API ============================================================

export const getAdminBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        console.error('Get Admin Bookings Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateBookingStatusAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['CONFIRMED', 'CANCELLED', 'PENDING'].includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        const booking = await prisma.booking.findUnique({ where: { id } });

        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        // Send emails based on status change (before updating to check diff)
        // Actually, update first is safer for DB consistency, then send email.
        // But we need to know previous status to send "changed" email.
        const previousStatus = booking.status;

        const updated = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        if (status === 'CONFIRMED' && previousStatus !== 'CONFIRMED') {
            await sendClientConfirmationEmail(updated);
        } else if (status === 'CANCELLED' && previousStatus !== 'CANCELLED') {
            await sendClientCancellationEmail(updated);
        }

        res.json(updated);

    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
