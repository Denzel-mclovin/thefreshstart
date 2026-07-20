// import { PrismaClient } from '@prisma/client';

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const prisma = global.prisma ?? new PrismaClient();
// if (!global.prisma) {
//   global.prisma = prisma;
// }

// export default prisma;


import { PrismaClient } from "../prisma/generated/client";


import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const pool = new PrismaPg({ connectionString: process.env.SUPABASE_URL! });
  return new PrismaClient({ adapter: pool });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

