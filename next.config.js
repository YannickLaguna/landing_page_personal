/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // servidor Node autocontenido para Docker (deploy/Dockerfile)
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,
    i18n: {
        locales: ['en', 'es'],
        defaultLocale: 'en'
    }
};

module.exports = nextConfig;
