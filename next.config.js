/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [],
  },
  
  // Note: Remove 'output: standalone' for Vercel deployment
  // Vercel handles the build output automatically
}

module.exports = nextConfig

