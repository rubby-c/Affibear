/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                hostname: '*'
            }
        ]
    },
    transpilePackages: ['echarts', 'zrender']
};

module.exports = nextConfig;