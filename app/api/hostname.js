
const hostNameStage = {
    dev: "http://localhost:4000",
    prod: "https://it-track.arinchawut.com"
};

const getHostname = () => {
    const stage = process.env.NEXT_PUBLIC_STAGE || 'dev';
    return hostNameStage[stage] || hostNameStage.dev;
};

export const hostname = getHostname();

export const getServerSideHostname = () => {
    const stage = process.env.STAGE || 'dev';
    return hostNameStage[stage] || hostNameStage.dev;
};