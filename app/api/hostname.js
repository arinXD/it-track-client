const hostNameStage = {
    "dev": "http://localhost:4000",
    "prod": "https://it-track.arinchawut.com"
}
const hostname = hostNameStage[process.env.STAGE]
module.exports = {
    hostname
}