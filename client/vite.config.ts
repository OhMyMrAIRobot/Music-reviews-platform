import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      tailwindcss(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['vite.svg'],
        manifest: {
          name: 'MusicReview',
          short_name: 'MusicReview',
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
