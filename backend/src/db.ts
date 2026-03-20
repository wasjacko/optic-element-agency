let _prisma: any = null;

function getPrisma() {
    if (!_prisma) {
        try {
            // Dynamic require to avoid crash at import time if Prisma isn't configured
            const { PrismaClient } = require('@prisma/client');
            _prisma = new PrismaClient();
        } catch (e: any) {
            console.error('Prisma initialization failed:', e.message);
            throw new Error('Database not configured. Booking features are unavailable.');
        }
    }
    return _prisma;
}

// Proxy that lazily initializes Prisma only when actually used
const prisma = new Proxy({} as any, {
    get(_target, prop) {
        return getPrisma()[prop];
    }
});

export default prisma;
