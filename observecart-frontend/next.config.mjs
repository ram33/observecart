/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/login',
        destination: 'http://user-service:3004/login',
      },
      {
        source: '/api/register',
        destination: 'http://user-service:3004/register',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://product-service:3001/products/:path*',
      },
      {
        source: '/api/cart/:path*',
        destination: 'http://cart-service:3002/cart/:path*',
      },
      {
        source: '/api/orders',
        destination: 'http://order-service:3003/orders',
      },
    ]
  },
};

export default nextConfig;
