import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 reactCompiler: false,
  experimental:{
    turbopackFileSystemCacheForDev:true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fvjyxnsxylajudptslro.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
