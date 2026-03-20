import { Request, Response } from 'express';
import { sendLoginCode } from '../services/email.js';
import jwt from 'jsonwebtoken';
import { getPrismaClient } from '../db.js';

// Pre-check for mandatory secret
if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET environment variable is missing.");
}

const getALLOWED_EMAILS = () => (process.env.ALLOWED_EMAILS || "")
    .replace(/"/g, "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

const OTP_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_OTP_ATTEMPTS = 5;

export const requestLoginCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email: rawEmail } = req.body;
        const email = (rawEmail || "").trim().toLowerCase();
        const allowed = getALLOWED_EMAILS();
        const prisma = await getPrismaClient();

        if (!email || !allowed.includes(email)) {
            // Security: Always return success to prevent timing attacks/enumeration
            await new Promise(r => setTimeout(r, 1000));
            return res.json({ success: true, message: "Code sent if email is authorized." });
        }

        // Check cooldown and last request in DB (Serverless safe)
        const existing = await prisma.adminOtp.findUnique({ where: { email } });
        if (existing) {
            const elapsed = Date.now() - existing.lastRequestAt.getTime();
            if (elapsed < OTP_COOLDOWN_MS) {
                const waitSec = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000);
                return res.status(429).json({ 
                    success: false, 
                    message: `Please wait ${waitSec}s before requesting a new code.` 
                });
            }
        }

        // Generate 6-digit Code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Upsert OTP in DB (Persistent)
        await prisma.adminOtp.upsert({
            where: { email },
            update: { 
                code, 
                expiresAt, 
                lastRequestAt: new Date(),
                attempts: 0 
            },
            create: { 
                email, 
                code, 
                expiresAt, 
                attempts: 0 
            }
        });

        // Send Email
        await sendLoginCode(email, code);

        return res.json({ success: true, message: "Code sent." });

    } catch (error) {
        console.error("Login Request Error:", error);
        return res.status(500).json({ success: false, message: "Server error. Please check your DB connection." });
    }
};

export const verifyLoginCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, code } = req.body;
        const prisma = await getPrismaClient();

        if (!email || !code) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }

        const storedData = await prisma.adminOtp.findUnique({ where: { email } });

        if (!storedData) {
            return res.status(401).json({ success: false, message: "Invalid or expired code" });
        }

        // 1. Check Brute Force (Max 5 attempts)
        if (storedData.attempts >= MAX_OTP_ATTEMPTS) {
            return res.status(403).json({ success: false, message: "Security block: too many attempts. Please request a new code." });
        }

        // 2. Check Expiry
        if (new Date() > storedData.expiresAt) {
            await prisma.adminOtp.delete({ where: { email } });
            return res.status(401).json({ success: false, message: "Code expired" });
        }

        // 3. Check Code
        if (storedData.code !== code) {
            // Increment attempts
            await prisma.adminOtp.update({
                where: { email },
                data: { attempts: { increment: 1 } }
            });
            return res.status(401).json({ success: false, message: "Invalid code" });
        }

        // Success! Clear the code
        await prisma.adminOtp.delete({ where: { email } });

        // Throw if configuration is missing
        if (!process.env.JWT_SECRET) {
            throw new Error("Internal Configuration Error: JWT_SECRET missing");
        }

        // Return a real JWT token
        const token = jwt.sign(
            { email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({ success: true, token });

    } catch (error) {
        console.error("Verify Login Error:", error);
        const msg = error instanceof Error ? error.message : "Internal Server Error";
        return res.status(500).json({ error: msg });
    }
};

