import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  transpilePackages: ['@vhyxui/react', '@vhyxui/core'],
};

export default config;
