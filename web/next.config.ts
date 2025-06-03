import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Cấu hình cho Docker hot reload
  ...(process.env.NODE_ENV === 'development' && {
    webpackDevMiddleware: (config: any) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      return config;
    },
  }),
  
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

  // Disable static optimization for specific routes
  unstable_runtimeJS: true,
  
  // Prevent static optimization for authentication routes
  async headers() {
    return [
      {
        // Áp dụng cho tất cả các route verify
        source: '/:path*/(verify-driver|verify-admin|verify-vendor|verify-store)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
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

export default nextConfig;