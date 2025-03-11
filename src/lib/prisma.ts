import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

interface GlobalWithPrisma extends NodeJS.Global {
    prisma?: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // In development, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as GlobalWithPrisma).prisma) {
        (global as GlobalWithPrisma).prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    prisma = (global as GlobalWithPrisma).prisma as PrismaClient;
}

export { prisma };
export default prisma; 