const hostNameStage = {
    "dev": "http://localhost:4000",
    "prod": "https://it-track.arinchawut.com"
}
let hostname = hostNameStage[process.env.STAGE]
hostname = "http://localhost:4000"
module.exports = {
    hostname
}