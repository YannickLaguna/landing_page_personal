/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // servidor Node autocontenido para Docker (deploy/Dockerfile)
    poweredByHeader: false, // no anunciar "X-Powered-By: Next.js"
    trailingSlash: true,
    reactStrictMode: true,
    i18n: {
        locales: ['en', 'es'],
        defaultLocale: 'en'
    }
};

module.exports = nextConfig;
