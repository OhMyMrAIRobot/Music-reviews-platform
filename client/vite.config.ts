import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = (env.VITE_SERVER_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
  const apiBaseEscaped = escapeForRegex(apiBase);
  const apiPublicUrlPattern = new RegExp(`^${apiBaseEscaped}/public(/.*)?$`);
  const apiDataUrlPattern = new RegExp(`^${apiBaseEscaped}(/.*)?$`);

  return {
    plugins: [
      tailwindcss(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['vite.svg'],
        manifest: {
          name: 'Flom',
          short_name: 'Flom',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          theme_color: '#0a0a0a',
          background_color: '#0a0a0a',
          icons: [
            {
              src: '/vite.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: apiPublicUrlPattern,
              handler: 'CacheFirst',
              options: {
                cacheName: 'api-public-static',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: apiDataUrlPattern,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-data',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ request, url, sameOrigin }) => {
                if (!sameOrigin) {
                  return false;
                }
                const dest = request.destination;
                if (
                  dest === 'style' ||
                  dest === 'script' ||
                  dest === 'font' ||
                  dest === 'image'
                ) {
                  return true;
                }
                return /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/i.test(
                  url.pathname
                );
              },
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: ({ url }) => url.origin === 'https://rsms.me',
              handler: 'CacheFirst',
              options: {
                cacheName: 'inter-font',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
      }),
    ],
  };
});
