import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Tối ưu hóa images
  images: {
    domains: ['k9-backend.onrender.com'], // Thêm domain của backend nếu có sử dụng hình ảnh từ backend
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },

  // Cấu hình môi trường
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  // Tối ưu hóa production build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Cấu hình output
  output: 'standalone',

  // Cấu hình headers bảo mật
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Cấu hình redirects nếu cần
  async redirects() {
    return [];
  },

  // Cấu hình rewrites nếu cần
  async rewrites() {
    return [];
  },

  // Tối ưu hóa webpack nếu cần
  webpack: (config, { isServer }) => {
    // Thêm cấu hình webpack tùy chỉnh nếu cần
    return config;
  },
};

module.exports = nextConfig;