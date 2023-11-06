/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
            },
            {
                // http://localhost:3000/
                protocol: "http",
                hostname: "*.localhost",
            },
            {
                // www.melivecode.com
                protocol: "https",
                hostname: "*.melivecode.com",
            },
        ],
    },
}

module.exports = nextConfig
