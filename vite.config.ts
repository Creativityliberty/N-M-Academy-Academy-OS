import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
    ssr:
        command === 'serve'
            ? {
                  external: [
                      'react',
                      'react-dom',
                      'react-dom/server',
                      'react/jsx-runtime',
                      'react/jsx-dev-runtime',
                  ],
              }
            : {
                  noExternal: true,
              },

    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react-dom/server',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
        ],
    },

    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),

        inertia(),

        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),

        tailwindcss(),

        // Wayfinder only runs in dev (vite serve) — generated files are committed to git.
        // During `vite build` (Docker / CI) the plugin is skipped to avoid calling `php artisan`
        // when there is no running database or .env file available.
        ...(command === 'serve' ? [wayfinder({ formVariants: true })] : []),
    ],
}));
