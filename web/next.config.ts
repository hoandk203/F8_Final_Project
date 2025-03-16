import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig)