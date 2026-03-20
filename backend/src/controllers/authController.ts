
import { Request, Response } from 'express';
import { sendLoginCode } from '../services/email';
import jwt from 'jsonwebtoken';

// In-Memory Store for OTPs (Map<email, {code, expiresAt}>)
// In production, use Redis or Database
const otpStore = new Map<string, { code: string, expiresAt: number }>();

const ALLOWED_ADMIN_EMAILS = [
    "santiago_c_t@live.com",
    "webwacilait@gmail.com",
    "wasshait@gmail.com"
];

export const requestLoginCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body;

        if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) {
            // Security: Always return success even if email is invalid to prevent enumeration
            // But for this specific "single admin" case, we can be strict or loose.
            // Let's just return success with a fake delay.
            await new Promise(r => setTimeout(r, 1000));
            return res.json({ success: true, message: "Code sent if email is authorized." });
        }

        // Generate 6-digit Code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store Code (5 minutes expiry)
        otpStore.set(email, {
            code,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        // Send Email
        await sendLoginCode(email, code);

        return res.json({ success: true, message: "Code sent." });

    } catch (error) {
        console.error("Login Request Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
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
