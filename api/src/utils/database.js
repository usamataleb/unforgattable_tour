import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance to be reused
const prisma = new PrismaClient();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
