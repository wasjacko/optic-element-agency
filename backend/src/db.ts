import { createRequire } from 'module';
const requireModule = createRequire(import.meta.url);

let _prisma: any = null;

async function initPrisma() {
    if (!_prisma) {
        try {
            const mod = await import('@prisma/client');
            const PrismaClient = mod.PrismaClient;
            _prisma = new PrismaClient();
        } catch (e: any) {
            console.error('Prisma initialization failed:', e.message);
            throw new Error('Database not configured. Booking features are unavailable.');
        }
    }
    return _prisma;
}

// Export a function to get prisma lazily
export async function getPrismaClient() {
    return initPrisma();
}

// Also export a proxy for backward compatibility with sync access
const prisma = new Proxy({} as any, {
    get(_target, prop) {
        if (!_prisma) {
            // If prisma hasn't been initialized yet, try sync approach
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { PrismaClient } = requireModule('@prisma/client') as any;
                _prisma = new PrismaClient();
            } catch (e: any) {
                console.error('Prisma lazy init failed:', e.message);
                throw new Error('Database not configured');
            }
        }
        return _prisma[prop];
    }
});

export default prisma;
