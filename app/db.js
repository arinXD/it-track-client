const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => {
    return new PrismaClient();
};

let prisma = null;

if (typeof globalThis === 'object') {
    if (!globalThis.prisma) {
        globalThis.prisma = prismaClientSingleton();
    }
    prisma = globalThis.prisma;
} else {
    prisma = prismaClientSingleton();
}

module.exports = prisma;

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}
