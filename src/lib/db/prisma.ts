type PrismaClientInstance = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
};

declare global {
  var prisma: PrismaClientInstance | undefined;
}

function createPrismaClient(): PrismaClientInstance {
  try {
    const { PrismaClient } = eval("require")("@prisma/client") as {
      PrismaClient: new (options?: { log?: string[] }) => PrismaClientInstance;
    };

    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch {
    throw new Error(
      "@prisma/client is not installed. Run `npm install` (or your package manager install command) before starting the app.",
    );
  }
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
