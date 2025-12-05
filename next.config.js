/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [],
  },
  
  // Headers for Content Security Policy
  // Note: 'unsafe-eval' is required for Next.js development mode
  // In production builds, Next.js doesn't use eval, so this warning disappears
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Required for Next.js dev mode
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: https:",
                  "font-src 'self' data:",
                  "connect-src 'self' https:",
                ].join('; ')
              : [
                  "default-src 'self'",
                  "script-src 'self'", // Production: no unsafe-eval needed
                  "style-src 'self' 'unsafe-inline'",
                  "img-src 'self' data: https:",
                  "font-src 'self' data:",
                  "connect-src 'self' https:",
                ].join('; '),
          },
        ],
      },
    ];
  },
  
  // Note: Remove 'output: standalone' for Vercel deployment
  // Vercel handles the build output automatically
}

module.exports = nextConfig

