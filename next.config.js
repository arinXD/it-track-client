/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        domains: ['localhost:4000'],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "*it-track.arinchawut.com",
            },
            {
                protocol: "http",
                port:"4000",
                hostname: "localhost",
            },
            {
                protocol: "http",
                port:"3000",
                hostname: "*.localhost",
            },
        ],
    },
}

module.exports = nextConfig