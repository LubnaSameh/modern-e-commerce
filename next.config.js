/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'i.pravatar.cc',
      'images.unsplash.com',
      'ui-avatars.com',
      'randomuser.me',
      'placehold.co',
      'localhost',
      'via.placeholder.com',
      'verjpvrtbvljhzbwbdch.blob.vercel-storage.com',
      'res.cloudinary.com',
      'example.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      }
    ]
  },
  poweredByHeader: false
};

module.exports = nextConfig; 
