/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['via.placeholder.com'],
    },
    output: 'standalone',
    experimental: {
        appDir: true
    }
};

export default nextConfig;