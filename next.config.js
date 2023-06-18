/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/github',
        destination: 'https://github.com/joaodematte/fmd',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
