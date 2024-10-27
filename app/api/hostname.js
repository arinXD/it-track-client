require("dotenv").config();

const hostNameStage = {
    dev: "http://localhost:4000",
    prod: "https://it-track.arinchawut.com"
};

const getHostname = () => {
    const stage = process.env.STAGE;
    return hostNameStage[stage];
};

export const hostname = getHostname();

export const getServerSideHostname = () => {
    const stage = process.env.STAGE;
    return hostNameStage[stage];
};