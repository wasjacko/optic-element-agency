
import { Request, Response } from 'express';
import { sendLoginCode } from '../services/email';
import jwt from 'jsonwebtoken';

// In-Memory Store for OTPs (Map<email, {code, expiresAt}>)
// In production, use Redis or Database
const otpStore = new Map<string, { code: string, expiresAt: number }>();

const ALLOWED_ADMIN_EMAILS = (process.env.ALLOWED_EMAILS || "")
    .replace(/"/g, "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

// Rate limit: track last OTP request time per email (30s cooldown)
const otpCooldownStore = new Map<string, number>();
const OTP_COOLDOWN_MS = 30 * 1000; // 30 seconds

export const requestLoginCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email: rawEmail } = req.body;
        const email = (rawEmail || "").trim().toLowerCase();

        if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) {
            // Security: Always return success even if email is invalid to prevent enumeration
            await new Promise(r => setTimeout(r, 1000));
            return res.json({ success: true, message: "Code sent if email is authorized." });
        }

        // Check cooldown
        const lastRequest = otpCooldownStore.get(email) || 0;
        const elapsed = Date.now() - lastRequest;
        if (elapsed < OTP_COOLDOWN_MS) {
            const waitSec = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000);
            return res.status(429).json({ 
                success: false, 
                message: `Please wait ${waitSec}s before requesting a new code.` 
            });
        }

        // Generate 6-digit Code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store Code (5 minutes expiry)
        otpStore.set(email, {
            code,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        // Mark cooldown
        otpCooldownStore.set(email, Date.now());

        // Send Email
        await sendLoginCode(email, code);

        return res.json({ success: true, message: "Code sent." });

    } catch (error) {
        console.error("Login Request Error:", error);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

export const verifyLoginCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(401).json({ success: false, message: "Invalid or expired code" });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(401).json({ success: false, message: "Code expired" });
        }

        if (storedData.code !== code) {
            return res.status(401).json({ success: false, message: "Invalid code" });
        }

        // Success! Clear the code so it can't be reused
        otpStore.delete(email);

        // Return a real JWT token
        const token = jwt.sign(
            { email, role: 'admin' },
            process.env.JWT_SECRET || 'oe-agency-super-secure-key-2026',
            { expiresIn: '8h' }
        );

        return res.json({ success: true, token });

    } catch (error) {
        console.error("Verify Login Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
