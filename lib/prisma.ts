// @ts-ignore
import { PrismaClient } from '@prisma/client';

// File utilitas ini mencegah inisialisasi PrismaClient berkali-kali 
// pada saat pengembangan (development mode) yang sering melakukan reload.
// Praktik ini penting untuk menghindari error kehabisan koneksi pada database.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Logging query berguna saat pengembangan
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
