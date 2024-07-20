/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'coin-images.coingecko.com',
          port: '', // Optional, leave it empty if there's no specific port
          pathname: '/coins/images/**', // Adjust the pathname as needed
        },
      ],
    },
  };
  
  export default nextConfig;
  