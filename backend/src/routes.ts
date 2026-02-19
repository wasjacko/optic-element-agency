import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { createBooking, getAvailability, confirmBooking, cancelBooking, getAdminBookings, updateBookingStatusAdmin } from './controllers/bookingController';
import { requestLoginCode, verifyLoginCode } from './controllers/authController';
import { getContent, updateContent } from './controllers/cmsController';

const router = Router();

// Rate Limiter: 10 requests per 15 minutes per IP
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many booking attempts, please try again later." }
});

// JSON Endpoints
router.post('/bookings', bookingLimiter, createBooking);
router.get('/bookings/availability', getAvailability);

// Action Endpoints (Link targets)
router.get('/bookings/confirm', confirmBooking);
router.get('/bookings/cancel', cancelBooking);

// Admin Endpoints
router.get('/admin/bookings', getAdminBookings);
router.post('/admin/bookings/:id/status', updateBookingStatusAdmin);

// Auth Endpoints
router.post('/auth/send-code', requestLoginCode);
router.post('/auth/verify-code', verifyLoginCode);

// CMS Content Manager
router.get('/cms/content', getContent); // Get JSON
router.post('/cms/content', updateContent); // Save JSON

// Admin Content Update (Removed)
// import { updateContent } from './controllers/adminController';
// router.post('/admin/content', updateContent);

export default router;
