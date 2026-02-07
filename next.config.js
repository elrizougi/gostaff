/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // هذا السطر هو المهم جداً لحل 404 لملفات _next
  experimental: {
    outputFileTracingRoot: __dirname,
  },

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
