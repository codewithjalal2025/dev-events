import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents:true,
  typescript:{
    ignoreBuildErrors: true
  },
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // hostname: "images.unsplash.com"

        
      }
    ]
  }
};

export default nextConfig;
