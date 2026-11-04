/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return {
      afterFiles: [
        { source: '/line-cv', destination: '/cv/tran-nam-anh-cv.pdf' },
      ],
    };
  },
  async headers() {
    return ['/line-cv', '/cv/tran-nam-anh-cv.pdf'].map((source) => ({
      source,
      headers: [
        {
          key: 'Content-Disposition',
          value: 'inline; filename="Tran Nam Anh - CV.pdf"',
        },
        { key: 'Cache-Control', value: 'public, max-age=3600' },
      ],
    }));
  },
};

export default nextConfig;
