/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false
    ,
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
        ],
    },
}

module.exports = nextConfig
