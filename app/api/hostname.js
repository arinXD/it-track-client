require("dotenv").config();

const hostNameStage = {
    dev: "http://localhost:4000",
    prod: "https://it-track.arinchawut.com",
    test: "https://hazardous-thirty-addition-fraction.trycloudflare.com"
};

const getHostname = () => {
    const stage = process.env.STAGE || "prod";
    return hostNameStage.test;
};

export const hostname = getHostname();

export const getServerSideHostname = () => {
    const stage = process.env.STAGE;
    return hostNameStage.test;
};