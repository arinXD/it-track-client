const STAGE = process.env.NEXT_PUBLIC_STAGE
const HOSTNAME_STAGES = {
    dev: process.env.NEXT_PUBLIC_BACKEND_API_DEV,
    prod: process.env.NEXT_PUBLIC_BACKEND_API_PROD,
};

const getHostname = () => {
    return HOSTNAME_STAGES[STAGE] || HOSTNAME_STAGES.dev;
};

export const hostname = getHostname();
console.log(`[HOSTNAME CONFIG] STAGE: ${STAGE}, HOSTNAME: ${hostname}`);