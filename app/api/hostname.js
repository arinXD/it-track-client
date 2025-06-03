require("dotenv").config();

const hostNameStage = {
    test: "https://hazardous-thirty-addition-fraction.trycloudflare.com"
};

const getHostname = () => {
    return hostNameStage.test;
};

export const hostname = getHostname();

export const getServerSideHostname = () => {
    return hostNameStage.test;
};